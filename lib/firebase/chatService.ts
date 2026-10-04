import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './config';
import { ChatMessage, SubjectArea, SavedNote } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface DbChatSession {
  id: string;
  userId: string;
  title: string;
  subject: SubjectArea;
  mode: string;
  language: 'en' | 'bn';
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export async function createChatSession(
  userId: string,
  title: string,
  subject: SubjectArea = 'general',
  mode = 'socratic',
  language: 'en' | 'bn' = 'bn'
): Promise<DbChatSession> {
  const path = 'chats';
  try {
    const chatRef = doc(collection(db, 'chats'));
    const newSession: DbChatSession = {
      id: chatRef.id,
      userId,
      title: title || 'New Conversation',
      subject,
      mode,
      language,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(chatRef, {
      ...newSession,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newSession;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function getUserChatSessions(userId: string): Promise<DbChatSession[]> {
  const path = 'chats';
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        title: data.title || 'Conversation',
        subject: data.subject || 'general',
        mode: data.mode || 'socratic',
        language: data.language || 'bn',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Date.now(),
        isPinned: data.isPinned || false,
      };
    }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToUserChats(
  userId: string,
  onChatsUpdate: (chats: DbChatSession[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    return onSnapshot(
      q,
      (snap) => {
        const chats = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId,
            title: data.title || 'Conversation',
            subject: data.subject || 'general',
            mode: data.mode || 'socratic',
            language: data.language || 'bn',
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Date.now(),
            isPinned: data.isPinned || false,
          };
        }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        onChatsUpdate(chats);
      },
      (error) => {
        console.warn('Realtime chat subscription error:', error);
      }
    );
  } catch (error) {
    console.warn('Failed to subscribe to user chats:', error);
    return () => {};
  }
}

export async function saveChatMessage(
  chatId: string,
  userId: string,
  message: ChatMessage
): Promise<void> {
  const path = `chats/${chatId}/messages`;
  try {
    const msgRef = doc(db, 'chats', chatId, 'messages', message.id);
    await setDoc(msgRef, {
      id: message.id,
      chatId,
      userId,
      sender: message.role === 'user' ? 'user' : 'assistant',
      text: message.content,
      mode: message.mode || 'socratic',
      timestamp: serverTimestamp(),
    });

    const sessionRef = doc(db, 'chats', chatId);
    await setDoc(
      sessionRef,
      {
        updatedAt: serverTimestamp(),
        title: message.role === 'user' ? message.content.slice(0, 45) : 'New Chat',
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getChatMessages(chatId: string, userId: string): Promise<ChatMessage[]> {
  const path = `chats/${chatId}/messages`;
  try {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        role: data.sender === 'user' ? 'user' : 'assistant',
        content: data.text || '',
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : Date.now(),
        mode: data.mode || 'socratic',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToChatMessages(
  chatId: string,
  userId: string,
  onMessagesUpdate: (messages: ChatMessage[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(
      q,
      (snap) => {
        const messages = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            role: data.sender === 'user' ? ('user' as const) : ('assistant' as const),
            content: data.text || '',
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : Date.now(),
            mode: data.mode || 'socratic',
          };
        });
        onMessagesUpdate(messages);
      },
      (error) => {
        console.warn('Realtime messages subscription error:', error);
      }
    );
  } catch (error) {
    console.warn('Failed to subscribe to chat messages:', error);
    return () => {};
  }
}

export async function deleteChatSession(chatId: string): Promise<void> {
  const path = `chats/${chatId}`;
  try {
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveNotebookNote(userId: string, note: SavedNote): Promise<void> {
  const path = 'notebooks';
  try {
    const noteRef = doc(db, 'notebooks', note.id);
    await setDoc(noteRef, {
      id: note.id,
      userId,
      title: note.title,
      content: note.snippet,
      subject: note.subject || 'general',
      status: 'mastered',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserNotebookNotes(userId: string): Promise<SavedNote[]> {
  const path = 'notebooks';
  try {
    const q = query(
      collection(db, 'notebooks'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || 'Untitled Note',
        snippet: data.content || '',
        timestamp: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Date.now(),
        subject: data.subject || 'general',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function deleteNotebookNote(noteId: string): Promise<void> {
  const path = `notebooks/${noteId}`;
  try {
    await deleteDoc(doc(db, 'notebooks', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function renameChatSession(chatId: string, newTitle: string): Promise<void> {
  const path = `chats/${chatId}`;
  try {
    await setDoc(doc(db, 'chats', chatId), { title: newTitle, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function togglePinChatSession(chatId: string, isPinned: boolean): Promise<void> {
  const path = `chats/${chatId}`;
  try {
    await setDoc(doc(db, 'chats', chatId), { isPinned, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
