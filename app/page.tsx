'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AttachmentFile,
  ChatMessage,
  GeminiModelId,
  SavedNote,
  TeachingMode,
  ThinkingLevelId,
  UploadedFileRef,
} from '../lib/types';
import { MentionDefinition } from '../lib/mentions/definitions';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  useSettings,
} from '../lib/settings';
import { useAuth } from '../lib/firebase/authContext';
import {
  DbChatSession,
  createChatSession,
  getUserChatSessions,
  subscribeToUserChats,
  saveChatMessage,
  getChatMessages,
  subscribeToChatMessages,
  deleteChatSession,
  renameChatSession,
  togglePinChatSession,
  saveNotebookNote,
  getUserNotebookNotes,
  deleteNotebookNote,
} from '../lib/firebase/chatService';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppTopBar } from '../components/layout/AppTopBar';
import { EmptyState } from '../components/chat/EmptyState';
import { MessageItem } from '../components/chat/MessageItem';
import { Composer } from '../components/chat/Composer';
import { LearningDrawerPanel } from '../components/learning/LearningDrawerPanel';
import { AboutModal } from '../components/ui/AboutModal';
import { SettingsCenterModal } from '../components/settings/SettingsCenterModal';
import { AuthModal } from '../components/auth/AuthModal';
import { UserProfileModal } from '../components/auth/UserProfileModal';
import { ChatMessagesSkeleton } from '@/components/skeletons';

export default function RedesignedTutorApp() {
  const { user } = useAuth();

  // Global Application Settings Hook with safe SSR hydration match
  const { settings, updateSettings, resetSettings } = useSettings();

  // Active Context derived dynamically from persistent settings
  const [currentMode, setCurrentMode] = useState<TeachingMode>(DEFAULT_SETTINGS.defaultTutorMode);
  
  const activeModel: GeminiModelId = settings.selectedModel || 'gemini-2.5-flash';
  const activeThinkingLevel: ThinkingLevelId = (activeModel === 'gemini-2.5-flash' ? settings.fastThinkingLevel : settings.proThinkingLevel) || 'medium';

  // Load and sync Firestore settings for authenticated user
  useEffect(() => {
    if (!user) return;
    const syncProfileSettings = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/config');
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const fbSettings = userSnap.data()?.settings;
          if (fbSettings) {
            updateSettings(fbSettings);
          }
        }
      } catch (err) {
        console.warn('Failed to sync Firestore settings:', err);
      }
    };
    syncProfileSettings();
  }, [user, updateSettings]);

  const handleSelectModel = useCallback(async (modelId: GeminiModelId) => {
    updateSettings({ selectedModel: modelId });
    if (user) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/config');
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { settings: { selectedModel: modelId } }, { merge: true });
      } catch (err) {
        console.warn('Failed to persist model choice in Firestore:', err);
      }
    }
  }, [user, updateSettings]);

  const handleSelectThinkingLevel = useCallback(async (levelId: ThinkingLevelId) => {
    const isFast = activeModel === 'gemini-2.5-flash';
    const updatedPayload = isFast ? { fastThinkingLevel: levelId } : { proThinkingLevel: levelId };
    
    updateSettings(updatedPayload);
    if (user) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/config');
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { settings: updatedPayload }, { merge: true });
      } catch (err) {
        console.warn('Failed to persist thinking level in Firestore:', err);
      }
    }
  }, [user, activeModel, updateSettings]);

  // Firestore Multi-Chat State
  const [savedChats, setSavedChats] = useState<DbChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  // Layout panels & modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'quiz' | 'teach_back' | 'scratchpad' | 'canvas'>('canvas');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active Tool Context
  const [quizTopic, setQuizTopic] = useState<string>('Photosynthesis and Light Reactions');
  const [teachBackTopic, setTeachBackTopic] = useState<string>('Newton’s Third Law of Motion');
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [canvasContent, setCanvasContent] = useState<string>('');
  const [isCanvasLoading, setIsCanvasLoading] = useState<boolean>(false);

  // Conversation State & Active Multimodal Session File References
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionFileRefs, setSessionFileRefs] = useState<UploadedFileRef[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBn = settings.interfaceLanguage === 'bn';

  // Apply Theme ('dark' | 'light' | 'system')
  useEffect(() => {
    let effectiveTheme: 'dark' | 'light' = 'dark';

    if (settings.theme === 'system') {
      const isSystemDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = isSystemDark ? 'dark' : 'light';
    } else {
      effectiveTheme = settings.theme;
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [settings.theme]);

  // Handle settings update
  const handleUpdateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      updateSettings(newSettings);
    },
    [updateSettings]
  );

  // Subscribe to user's saved chats in Firestore in real-time
  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = subscribeToUserChats(user.uid, (loadedChats) => {
      setSavedChats(loadedChats);
      setIsLoadingChats(false);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  // Subscribe to active chat messages in Firestore in real-time
  useEffect(() => {
    if (!user || !activeChatId) {
      return;
    }
    const unsubscribe = subscribeToChatMessages(activeChatId, user.uid, (loadedMsgs) => {
      if (!isStreaming) {
        setMessages(loadedMsgs);
      }
      setIsLoadingMessages(false);
    });
    return () => {
      unsubscribe();
    };
  }, [user, activeChatId, isStreaming]);

  const handleResetSettings = () => {
    resetSettings();
    setCurrentMode(DEFAULT_SETTINGS.defaultTutorMode);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // New Chat session
  const handleNewChat = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setActiveChatId(null);
    setIsLoadingMessages(false);
    setMessages([]);
    setSessionFileRefs([]);
  };

  const handleClearSession = () => {
    handleNewChat();
    setSavedNotes([]);
  };

  // Select a past chat from sidebar
  const handleSelectChat = (chatId: string) => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setActiveChatId(chatId);
    setIsLoadingMessages(true);
    setMessages([]);
    setSessionFileRefs([]);
  };

  // Delete chat
  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;
    try {
      await deleteChatSession(chatId);
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await renameChatSession(chatId, newTitle);
    } catch (err) {
      console.error('Failed to rename chat:', err);
    }
  };

  const handlePinChat = async (chatId: string, isPinned: boolean) => {
    try {
      await togglePinChatSession(chatId, isPinned);
    } catch (err) {
      console.error('Failed to pin/unpin chat:', err);
    }
  };

  // Streaming message sender supporting multimodal attachments & user settings
  const handleSendMessage = async (
    userText: string,
    overrideMode?: TeachingMode,
    newAttachments?: AttachmentFile[],
    mentions?: MentionDefinition[]
  ) => {
    const trimmedText = userText.trim();
    if (!trimmedText && (!newAttachments || newAttachments.length === 0) && (!mentions || mentions.length === 0)) return;

    const modeToUse = overrideMode || currentMode;

    const isCanvas = mentions?.some((m) => m.id === 'canvas');
    if (isCanvas) {
      setIsRightPanelOpen(true);
      setActiveRightTab('canvas');
      setIsCanvasLoading(true);
      setCanvasContent('');
    } else if (mentions?.some((m) => m.id === 'quiz')) {
      setIsRightPanelOpen(true);
      setActiveRightTab('quiz');
    } else if (mentions?.some((m) => m.id === 'notes')) {
      setIsRightPanelOpen(true);
      setActiveRightTab('scratchpad');
    }

    const newRefs: UploadedFileRef[] = (newAttachments || [])
      .filter((a) => a.geminiFileUri)
      .map((a) => ({
        uri: a.geminiFileUri!,
        name: a.geminiFileName || a.name,
        mimeType: a.mimeType,
        type: a.type,
      }));

    const combinedFileRefs = [...sessionFileRefs, ...newRefs];
    setSessionFileRefs(combinedFileRefs);

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: trimmedText,
      timestamp: Date.now(),
      mode: modeToUse,
      subject: settings.defaultSubject,
      attachments: newAttachments && newAttachments.length > 0 ? newAttachments : undefined,
    };

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      mode: modeToUse,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    // If logged in, ensure a Firestore chat document exists and save user message
    let currentChatId = activeChatId;
    if (user) {
      if (!currentChatId) {
        try {
          const newTitle = trimmedText.slice(0, 36) || (isBn ? 'নতুন কথোপকথন' : 'New Conversation');
          const newSession = await createChatSession(user.uid, newTitle, settings.defaultSubject, modeToUse, settings.interfaceLanguage);
          currentChatId = newSession.id;
          setActiveChatId(currentChatId);
        } catch (err) {
          console.warn('Firestore create chat error:', err);
        }
      }

      if (currentChatId) {
        saveChatMessage(currentChatId, user.uid, userMessage).catch((e) =>
          console.warn('Failed to save user message:', e)
        );
      }
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Determine prompt response language based on tutor preference
      const effectiveLang =
        settings.responseLanguage === 'auto'
          ? settings.interfaceLanguage
          : settings.responseLanguage;

      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedText,
          history: historyPayload,
          mode: modeToUse,
          level: settings.academicLevel,
          subject: settings.defaultSubject,
          language: effectiveLang,
          model: activeModel,
          thinkingLevel: activeThinkingLevel,
          fileRefs: combinedFileRefs,
          explanationDetail: settings.explanationDetail,
          useRealWorldExamples: settings.useRealWorldExamples,
          askUnderstandingChecks: settings.askUnderstandingChecks,
          showCommonMistakes: settings.showCommonMistakes,
          mentions: mentions?.map((m) => ({ id: m.id, type: m.type, label: m.label })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errText = errJson?.error || `Server responded with status ${response.status}`;
        throw new Error(errText);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available.');

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                if (isCanvas) {
                  setCanvasContent(accumulatedText);
                }
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
              if (parsed.error) {
                accumulatedText += `\n\n*Error:* ${parsed.error}`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
            } catch {
              accumulatedText += dataStr;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholderId
                    ? { ...msg, content: accumulatedText }
                    : msg
                )
              );
            }
          }
        }
      }

      // Mark final assistant message complete and persist in Firestore
      const finalAssistantMsg: ChatMessage = {
        id: assistantPlaceholderId,
        role: 'assistant',
        content: accumulatedText,
        timestamp: Date.now(),
        modelId: activeModel,
        mode: modeToUse,
        isStreaming: false,
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? finalAssistantMsg
            : msg
        )
      );

      if (user && currentChatId && accumulatedText) {
        saveChatMessage(currentChatId, user.uid, finalAssistantMsg).catch((e) =>
          console.warn('Failed to save assistant message:', e)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? { ...msg, isStreaming: false, content: msg.content + (isBn ? '\n\n*(সেশন থামানো হয়েছে)*' : '\n\n*(Generation stopped)*') }
              : msg
          )
        );
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  isStreaming: false,
                  content: isBn
                    ? `❌ **উত্তর তৈরিতে সমস্যা হয়েছে:** ${errorMsg}\n\nঅনুগ্রহ করে আবার চেষ্টা করুন বা প্রশ্নটি সংক্ষেপ করুন।`
                    : `❌ **Failed to generate response:** ${errorMsg}\n\nPlease try again or rephrase your question.`,
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      setIsCanvasLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleActionClick = (
    action: 'simplify' | 'worked' | 'quiz' | 'teach_back',
    contextText: string
  ) => {
    const snippet = contextText.slice(0, 300);
    switch (action) {
      case 'simplify':
        handleSendMessage(
          isBn
            ? `এই অংশটি আরও সহজ দৈনন্দিন উপমা দিয়ে বুঝিয়ে বলো:\n"${snippet}"`
            : `Please explain this concept even more simply with an analogy:\n"${snippet}"`,
          'simplify'
        );
        break;
      case 'worked':
        handleSendMessage(
          isBn
            ? `এই বিষয়ের ওপর বিস্তারিত ও ধাপে ধাপে গাণিতিক সমাধান দেখাও:\n"${snippet}"`
            : `Show a full step-by-step worked derivation for:\n"${snippet}"`,
          'worked_solution'
        );
        break;
      case 'quiz':
        setQuizTopic(snippet);
        setActiveRightTab('quiz');
        setIsRightPanelOpen(true);
        break;
      case 'teach_back':
        setTeachBackTopic(snippet);
        setActiveRightTab('teach_back');
        setIsRightPanelOpen(true);
        break;
    }
  };

  // Learning Tools Handlers
  const handleOpenTool = (tool: 'quiz' | 'teach_back' | 'scratchpad' | 'canvas') => {
    setActiveRightTab(tool);
    setIsRightPanelOpen(true);
  };

  const handleSaveNote = async (titleOrSnippet: string, optionalSnippet?: string) => {
    const title = optionalSnippet ? titleOrSnippet : titleOrSnippet.slice(0, 40);
    const snippet = optionalSnippet || titleOrSnippet;
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title,
      snippet,
      timestamp: Date.now(),
      subject: settings.defaultSubject,
    };
    setSavedNotes((prev) => [newNote, ...prev]);
    if (user) {
      await saveNotebookNote(user.uid, newNote);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
    if (user) {
      await deleteNotebookNote(id);
    }
  };

  const handleGenerateRecap = () => {
    if (savedNotes.length === 0) return;
    const combinedNotes = savedNotes.map((n) => `- ${n.title}: ${n.snippet.slice(0, 100)}...`).join('\n');
    handleSendMessage(
      isBn
        ? `আমার সংরক্ষিত নোটগুলোর ওপর ভিত্তি করে একটি সম্পূর্ণ লার্নিং সামারি ও রিভিশন শিট তৈরি করো:\n${combinedNotes}`
        : `Generate a comprehensive learning recap and revision sheet based on my saved scratchpad notes:\n${combinedNotes}`,
      'socratic'
    );
    setIsRightPanelOpen(false);
  };

  const handleTriggerCanvasAction = (action: 'simpler' | 'examples' | 'exam' | 'practice') => {
    let query = '';
    if (action === 'simpler') {
      query = isBn
        ? `বর্তমানে তৈরি হওয়া এই ক্যানভাস কন্টেন্টটি আরও সহজ দৈনন্দিন উপমা ব্যবহার করে নতুন করে ব্যাখ্যা করো:\n\n${canvasContent}`
        : `Please rewrite the current canvas content into much simpler language using clear, everyday analogies:\n\n${canvasContent}`;
    } else if (action === 'examples') {
      query = isBn
        ? `বর্তমানে তৈরি হওয়া এই ক্যানভাস কন্টেন্টে ২-৩টি আকর্ষণীয় বাস্তব উদাহরণ যুক্ত করে আপডেট করো:\n\n${canvasContent}`
        : `Please add 2-3 vivid real-world examples to explain the concepts in this canvas content:\n\n${canvasContent}`;
    } else if (action === 'exam') {
      query = isBn
        ? `এই ক্যানভাস কন্টেন্টটিকে পরীক্ষার প্রস্তুতির জন্য পয়েন্ট-ভিত্তিক সংক্ষেপ ও পরীক্ষার নোটে রূপান্তর করো:\n\n${canvasContent}`
        : `Convert this canvas content into highly structured, exam-ready revision notes optimized for maximum grade performance:\n\n${canvasContent}`;
    } else if (action === 'practice') {
      query = isBn
        ? `এই ক্যানভাস কন্টেন্টের বিষয়ের ওপর ভিত্তি করে নিচে ৩টি চমৎকার অনুশীলন প্রশ্ন এবং ছোট ইঙ্গিত যোগ করো:\n\n${canvasContent}`
        : `Please append 3 challenging conceptual practice exercises with brief hints below the current canvas content:\n\n${canvasContent}`;
    }

    if (query) {
      handleSendMessage(query, undefined, undefined, [{ id: 'canvas', label: 'Canvas', description: '', category: 'create', type: 'capability', icon: 'LayoutTemplate' }]);
    }
  };

  const activeChat = savedChats.find((c) => c.id === activeChatId);

  return (
    <div className="flex h-screen h-[100dvh] max-h-[100dvh] w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--selection-bg)]">
      {/* 1. App Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        language={settings.interfaceLanguage}
        onNewChat={handleNewChat}
        onClearSession={handleClearSession}
        onOpenTool={handleOpenTool}
        activeTool={isRightPanelOpen ? activeRightTab : null}
        savedNotesCount={savedNotes.length}
        messageCount={messages.filter((m) => m.role === 'user').length}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        chats={savedChats}
        isLoadingChats={isLoadingChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
      />

      {/* 2. Main Chat Viewport */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[280px] relative h-full max-h-full overflow-hidden">
        {/* Top Bar */}
        <AppTopBar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          language={settings.interfaceLanguage}
          onNewChat={handleNewChat}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          chatTitle={activeChat?.title}
        />

        {/* Chat Stream Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-2 sm:py-4 flex flex-col justify-between">
          <div className="w-full max-w-[760px] mx-auto flex-1 flex flex-col justify-start space-y-4">
            {isLoadingMessages && messages.length === 0 ? (
              <ChatMessagesSkeleton isBn={isBn} />
            ) : messages.length === 0 ? (
              <EmptyState
                language={settings.interfaceLanguage}
                onSelectSuggestion={(promptText) => {
                  handleSendMessage(promptText);
                }}
              />
            ) : (
              <div className="space-y-4 content-enter">
                {messages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    language={settings.interfaceLanguage}
                    onActionClick={handleActionClick}
                    onSaveNote={handleSaveNote}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Unified Bottom Composer */}
        <div className="w-full shrink-0">
          <Composer
            language={settings.interfaceLanguage}
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            selectedModel={activeModel}
            onModelChange={handleSelectModel}
            selectedThinkingLevel={activeThinkingLevel}
            onThinkingLevelChange={handleSelectThinkingLevel}
            isStreaming={isStreaming}
            onSendMessage={(text, atts, ments) => handleSendMessage(text, undefined, atts, ments)}
            onStopStreaming={handleStopStreaming}
          />
        </div>
      </div>

      {/* 3. Right Learning Drawer Panel */}
      <LearningDrawerPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        language={settings.interfaceLanguage}
        activeTab={activeRightTab}
        onTabChange={setActiveRightTab}
        quizTopic={quizTopic}
        onQuizTopicChange={setQuizTopic}
        subject={settings.defaultSubject}
        teachBackTopic={teachBackTopic}
        onTeachBackTopicChange={setTeachBackTopic}
        savedNotes={savedNotes}
        onDeleteNote={handleDeleteNote}
        onClearNotes={() => setSavedNotes([])}
        onSaveNote={handleSaveNote}
        onGenerateRecap={handleGenerateRecap}
        canvasContent={canvasContent}
        onCanvasContentChange={setCanvasContent}
        onTriggerCanvasAction={handleTriggerCanvasAction}
        isCanvasLoading={isCanvasLoading}
      />

      {/* 4. Settings Center Modal */}
      <SettingsCenterModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        onClearSession={handleClearSession}
      />

      {/* 5. About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        language={settings.interfaceLanguage}
      />

      {/* 6. Auth Modal for Google & Email/Password Sign-In */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={settings.interfaceLanguage}
      />

      {/* 7. User Profile Management Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={settings.interfaceLanguage}
      />
    </div>
  );
}
