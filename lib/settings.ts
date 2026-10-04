'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { AcademicLevel, AppLanguage, SubjectArea, TeachingMode, GeminiModelId, ThinkingLevelId } from './types';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResponseLanguagePreference = 'auto' | 'bn' | 'en';
export type ExplanationDetailPreference = 'concise' | 'standard' | 'detailed';

export interface AppSettings {
  // Appearance
  theme: ThemePreference;

  // Language
  interfaceLanguage: AppLanguage;

  // Tutor Preferences
  responseLanguage: ResponseLanguagePreference;
  defaultTutorMode: TeachingMode;
  explanationDetail: ExplanationDetailPreference;
  useRealWorldExamples: boolean;
  askUnderstandingChecks: boolean;
  showCommonMistakes: boolean;

  // Learning Preferences
  academicLevel: AcademicLevel;
  defaultSubject: SubjectArea;
  learningGoal: 'understanding' | 'exam' | 'practice' | 'revision' | 'homework';

  // Chat & Composer
  enterToSend: boolean;
  showWelcomeSuggestions: boolean;
  showTimestamps: boolean;

  // Files & Media
  enableImages: boolean;
  enableDocuments: boolean;
  enableAudio: boolean;
  enableVideo: boolean;

  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;

  // General
  confirmBeforeClearSession: boolean;

  // Persistent Model Preferences
  selectedModel: GeminiModelId;
  fastThinkingLevel: ThinkingLevelId;
  proThinkingLevel: ThinkingLevelId;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  interfaceLanguage: 'bn',
  responseLanguage: 'auto',
  defaultTutorMode: 'socratic',
  explanationDetail: 'standard',
  useRealWorldExamples: true,
  askUnderstandingChecks: true,
  showCommonMistakes: true,
  academicLevel: 'school',
  defaultSubject: 'general',
  learningGoal: 'understanding',
  enterToSend: true,
  showWelcomeSuggestions: true,
  showTimestamps: false,
  enableImages: true,
  enableDocuments: true,
  enableAudio: true,
  enableVideo: true,
  reduceMotion: false,
  highContrast: false,
  confirmBeforeClearSession: true,
  selectedModel: 'gemini-2.5-flash',
  fastThinkingLevel: 'medium',
  proThinkingLevel: 'medium',
};

const SETTINGS_STORAGE_KEY = 'ai_tutor_app_settings_v1';
let memoryCachedSettings: AppSettings = DEFAULT_SETTINGS;
let cachedRawString: string | null = null;

export function loadStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    if (raw === cachedRawString) return memoryCachedSettings;
    cachedRawString = raw;
    const parsed = JSON.parse(raw);
    memoryCachedSettings = { ...DEFAULT_SETTINGS, ...parsed };
    return memoryCachedSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
    cachedRawString = serialized;
    memoryCachedSettings = settings;
    window.dispatchEvent(new Event('ai_tutor_settings_changed'));
  } catch {
    // Ignore storage quota errors
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('ai_tutor_settings_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ai_tutor_settings_changed', callback);
  };
}

function getSnapshot(): AppSettings {
  return loadStoredSettings();
}

function getServerSnapshot(): AppSettings {
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const current = loadStoredSettings();
    const updated = { ...current, ...newSettings };
    saveStoredSettings(updated);
  }, []);

  const resetSettings = useCallback(() => {
    saveStoredSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
