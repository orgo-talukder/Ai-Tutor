export type TeachingMode = 
  | 'socratic' 
  | 'worked_solution' 
  | 'check_answer' 
  | 'quiz' 
  | 'teach_back' 
  | 'simplify';

export type AcademicLevel = 'school' | 'college' | 'university' | 'self_learner';

export type SubjectArea = 
  | 'general'
  | 'mathematics' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'computer_science' 
  | 'language';

export type AppLanguage = 'bn' | 'en';

// The exact 6 models requested by the user
export type GeminiModelId = 
  | 'gemini-3.8-flash'
  | 'gemini-3.7-flash'
  | 'gemini-3.6-flash'
  | 'gemini-3.5-flash-lite'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-preview'
  | 'gemini-2.5-flash';

export type ThinkingLevelId = 'low' | 'medium' | 'high' | 'off';

export interface ModelDefinition {
  id: GeminiModelId;
  name: string;
  badge?: string;
  isDefault?: boolean;
  descEn: string;
  descBn: string;
  supportedThinkingLevels: ThinkingLevelId[];
  defaultThinkingLevel: ThinkingLevelId;
  color: string;
}

// Multimodal Attachment Types
export type AttachmentType = 'document' | 'image' | 'audio' | 'video';

export type AttachmentUploadState = 'selected' | 'validating' | 'uploading' | 'processing' | 'ready' | 'error';

export interface AttachmentFile {
  id: string;
  file: File;
  type: AttachmentType;
  name: string;
  size: number;
  mimeType: string;
  previewUrl?: string;
  state: AttachmentUploadState;
  progress: number; // 0 to 100
  errorMessage?: string;
  // Uploaded backend reference from Gemini Files API
  geminiFileUri?: string;
  geminiFileName?: string;
}

export interface UploadedFileRef {
  uri: string;
  mimeType: string;
  name: string;
  type: AttachmentType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: TeachingMode;
  modelId?: GeminiModelId;
  thinkingLevel?: ThinkingLevelId;
  subject?: SubjectArea;
  isStreaming?: boolean;
  attachments?: AttachmentFile[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionAlert?: string;
}

export interface TeachBackAssessment {
  score: number; // 1 to 10
  status: 'excellent' | 'good' | 'needs_improvement';
  summary: string;
  whatYouGotRight: string[];
  missingConcepts: string[];
  misconceptionsFound: string[];
  encouragingGuidance: string;
}

export interface SavedNote {
  id: string;
  title: string;
  snippet: string;
  timestamp: number;
  subject?: SubjectArea;
}

export interface StudentProfile {
  level: AcademicLevel;
  language: AppLanguage;
  subject: SubjectArea;
  mode: TeachingMode;
  modelId?: GeminiModelId;
  thinkingLevel?: ThinkingLevelId;
}
