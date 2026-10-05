'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AppLanguage,
  AttachmentFile,
  GeminiModelId,
  TeachingMode,
  ThinkingLevelId,
} from '@/lib/types';
import {
  ArrowUp,
  Square,
  ChevronDown,
  Compass,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Plus,
  Paperclip,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';
import { AttachmentPreviewChips } from './AttachmentPreviewChips';
import { FileQuickActions } from './FileQuickActions';
import { ComposerAttachmentMenu } from './popovers/ComposerAttachmentMenu';
import { ModelPickerPopover } from './popovers/ModelPickerPopover';
import {
  MAX_FILES_PER_MESSAGE,
  validateFile,
} from '@/lib/constants/attachments';

// @Mention System imports
import { MentionDefinition, MENTION_DEFINITIONS } from '@/lib/mentions/definitions';
import { MentionMenu } from './MentionMenu';
import { MentionChip } from './MentionChip';
import { AnimatedComposerPlaceholder } from './AnimatedComposerPlaceholder';

interface SpeechRecognitionEventInstance {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventInstance) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface ComposerProps {
  language: AppLanguage;
  currentMode: TeachingMode;
  onModeChange: (mode: TeachingMode) => void;
  selectedModel: GeminiModelId;
  onModelChange: (model: GeminiModelId) => void;
  selectedThinkingLevel: ThinkingLevelId;
  onThinkingLevelChange: (level: ThinkingLevelId) => void;
  isStreaming: boolean;
  onSendMessage: (text: string, attachments?: AttachmentFile[], mentions?: MentionDefinition[]) => void;
  onStopStreaming: () => void;
}

type ActivePopoverType = 'attachments' | 'model' | null;

export function Composer({
  language,
  currentMode,
  onModeChange,
  selectedModel,
  onModelChange,
  selectedThinkingLevel,
  onThinkingLevelChange,
  isStreaming,
  onSendMessage,
  onStopStreaming,
}: ComposerProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [activePopover, setActivePopover] = useState<ActivePopoverType>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // @Mention state
  const [selectedMentions, setSelectedMentions] = useState<MentionDefinition[]>([]);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // 4 Separate Hidden Native File Inputs
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';
  const hasContentToSend = input.trim().length > 0 || attachments.length > 0 || selectedMentions.length > 0;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  // Handle @Mention trigger detection on input change
  const checkMentionTrigger = (text: string, selectionStart: number) => {
    const textBeforeCursor = text.slice(0, selectionStart);
    const lastAtIdx = textBeforeCursor.lastIndexOf('@');

    if (lastAtIdx !== -1) {
      // Ensure there is whitespace or start-of-line before '@' to avoid emails or random triggers
      const charBeforeAt = lastAtIdx > 0 ? textBeforeCursor[lastAtIdx - 1] : ' ';
      if (charBeforeAt === ' ' || charBeforeAt === '\n') {
        const query = textBeforeCursor.slice(lastAtIdx + 1);
        if (!query.includes(' ')) {
          setSearchQuery(query);
          setIsMentionMenuOpen(true);
          return;
        }
      }
    }

    setIsMentionMenuOpen(false);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    checkMentionTrigger(value, e.target.selectionStart || 0);
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    checkMentionTrigger(textarea.value, textarea.selectionStart || 0);
  };

  // Select mention and convert into a chip
  const handleSelectMention = (mention: MentionDefinition) => {
    if (!selectedMentions.some((m) => m.id === mention.id)) {
      setSelectedMentions((prev) => [...prev, mention]);
    }

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const selectionStart = textarea.selectionStart;
      const textBeforeCursor = input.slice(0, selectionStart);
      const textAfterCursor = input.slice(selectionStart);
      const lastAtIdx = textBeforeCursor.lastIndexOf('@');

      if (lastAtIdx !== -1) {
        const newInput = textBeforeCursor.slice(0, lastAtIdx) + textAfterCursor;
        setInput(newInput);

        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = lastAtIdx;
          textarea.selectionEnd = lastAtIdx;
        }, 10);
      }
    }

    setIsMentionMenuOpen(false);
    setSearchQuery('');
    setHighlightedIndex(0);
  };

  const handleRemoveMention = (mentionId: string) => {
    setSelectedMentions((prev) => prev.filter((m) => m.id !== mentionId));
  };

  // Filter mentions list based on active autocomplete query
  const filteredMentions = MENTION_DEFINITIONS.filter((m) =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync highlighted index limit dynamically
  const safeHighlightedIndex = highlightedIndex >= filteredMentions.length ? 0 : highlightedIndex;

  // Voice Speech Recognition Handler (Web Speech API)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert(
        isBn
          ? 'আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে টাইপ করুন।'
          : 'Voice input is not supported in this browser. Please type your message.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isBn ? 'bn-BD' : 'en-US';

      recognition.onresult = (event: SpeechRecognitionEventInstance) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => {
          const updated = prev ? `${prev} ${transcript}` : transcript;
          checkMentionTrigger(updated, updated.length);
          return updated;
        });
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  // Upload individual file to Gemini Files API
  const uploadSingleFile = useCallback(async (attItem: AttachmentFile) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === attItem.id ? { ...a, state: 'uploading', progress: 30 } : a))
    );

    try {
      const formData = new FormData();
      formData.append('file', attItem.file);

      setAttachments((prev) =>
        prev.map((a) => (a.id === attItem.id ? { ...a, state: 'processing', progress: 70 } : a))
      );

      const res = await fetch('/api/tutor/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errMsg = isBn 
          ? `ফাইল আপলোড ব্যর্থ হয়েছে (স্ট্যাটাস কোড: ${res.status})।` 
          : `Upload failed (Status ${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson?.error) errMsg = errJson.error;
        } catch {
          try {
            const errText = await res.text();
            if (errText && errText.length < 150) {
              errMsg = errText;
            }
          } catch {}
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      setAttachments((prev) =>
        prev.map((a) =>
          a.id === attItem.id
            ? {
                ...a,
                state: 'ready',
                progress: 100,
                geminiFileUri: data.fileUri,
                geminiFileName: data.fileName,
              }
            : a
        )
      );
    } catch (err: unknown) {
      console.error('File upload error:', err);
      const errMsg = err instanceof Error ? err.message : 'Upload failed';
      setAttachments((prev) =>
        prev.map((a) =>
          a.id === attItem.id
            ? {
                ...a,
                state: 'error',
                errorMessage: errMsg,
              }
            : a
        )
      );
    }
  }, [isBn]);

  // Add files to attachments
  const handleAddFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (attachments.length + fileArray.length > MAX_FILES_PER_MESSAGE) {
        alert(
          isBn
            ? `একবারে সর্বোচ্চ ${MAX_FILES_PER_MESSAGE}টি ফাইল সংযুক্ত করা যাবে।`
            : `You can attach up to ${MAX_FILES_PER_MESSAGE} files per message.`
        );
        return;
      }

      const newItems: AttachmentFile[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file, isBn);
        if (!validation.valid || !validation.type) {
          alert(validation.error || 'Invalid file');
          continue;
        }

        const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        let previewUrl: string | undefined = undefined;
        if (validation.type === 'image') {
          previewUrl = URL.createObjectURL(file);
        }

        const attItem: AttachmentFile = {
          id,
          file,
          type: validation.type,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          previewUrl,
          state: 'selected',
          progress: 0,
        };

        newItems.push(attItem);
      }

      if (newItems.length > 0) {
        setAttachments((prev) => [...prev, ...newItems]);
        for (const item of newItems) {
          uploadSingleFile(item);
        }
      }
    },
    [attachments.length, isBn, uploadSingleFile]
  );

  // Remove individual attachment
  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  // Clipboard Image Paste Handler (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const pastedFiles = Array.from(e.clipboardData.files);
      const imageFiles = pastedFiles.filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        e.preventDefault();
        handleAddFiles(imageFiles);
      }
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    const trimmed = input.trim();
    const hasUploading = attachments.some((a) => a.state === 'uploading' || a.state === 'processing');
    if (hasUploading) {
      alert(
        isBn
          ? 'ফাইল আপলোড শেষ হওয়া পর্যন্ত অপেক্ষা করুন।'
          : 'Please wait for files to finish uploading.'
      );
      return;
    }

    if (!trimmed && attachments.length === 0 && selectedMentions.length === 0) return;

    const readyAttachments = attachments.filter((a) => a.state === 'ready');
    onSendMessage(trimmed, readyAttachments.length > 0 ? readyAttachments : undefined, selectedMentions);

    setInput('');
    setAttachments([]);
    setSelectedMentions([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMentionMenuOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredMentions.length));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredMentions.length) % Math.max(1, filteredMentions.length));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredMentions[safeHighlightedIndex]) {
          handleSelectMention(filteredMentions[safeHighlightedIndex]);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMentionMenuOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) {
        return; // Ignore Enter during IME composition for Bengali typing
      }
      e.preventDefault();
      handleSubmit();
    }
  };

  const modeLabels: Record<TeachingMode, { en: string; bn: string; icon: React.ReactNode }> = {
    socratic: {
      en: 'Socratic Tutor',
      bn: 'সক্রেটিক টিউটর',
      icon: <Compass className="w-3.5 h-3.5 text-[#7C8CFF]" />,
    },
    worked_solution: {
      en: 'Step-by-Step',
      bn: 'ধাপে সমাধান',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    },
    check_answer: {
      en: 'Check Answer',
      bn: 'সমাধান যাচাই',
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />,
    },
    simplify: {
      en: 'Simplify',
      bn: 'সহজ উপমা',
      icon: <Lightbulb className="w-3.5 h-3.5 text-amber-500" />,
    },
    quiz: {
      en: 'Quiz',
      bn: 'কুইজ',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
    },
    teach_back: {
      en: 'Teach-Back',
      bn: 'টিচ-ব্যাক',
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-500" />,
    },
  };

  const modelShortLabels: Record<GeminiModelId, string> = {
    'gemini-2.5-flash': 'ThinkWise Fast',
    'gemini-3.7-flash': 'ThinkWise Pro',
  };

  const effortLabels: Record<ThinkingLevelId, { en: string; bn: string }> = {
    low: { en: 'Low', bn: 'কম' },
    medium: { en: 'Medium', bn: 'মাঝারি' },
    high: { en: 'High', bn: 'বেশি' },
  };

  const showPlaceholder = input.length === 0 && selectedMentions.length === 0;

  return (
    <div className="w-full max-w-[760px] mx-auto px-2.5 sm:px-4 pb-2.5 sm:pb-5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      {/* 4 Separate Hidden Native File Inputs */}
      <input
        type="file"
        ref={docInputRef}
        className="hidden"
        multiple
        accept=".pdf,.docx,.txt,.md,.csv,.json,.xlsx,.pptx,application/pdf,text/plain"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={imgInputRef}
        className="hidden"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={audioInputRef}
        className="hidden"
        multiple
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac,.webm"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        multiple
        accept="video/*,.mp4,.mov,.webm,.avi,.mpeg"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Main Composer Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-white dark:bg-[#121215] border rounded-2xl sm:rounded-3xl shadow-lg transition-all p-2.5 sm:p-3 ${
          isDragging
            ? 'border-[#7C8CFF] ring-2 ring-[#7C8CFF]/20'
            : 'border-zinc-200/90 dark:border-white/[0.08] focus-within:border-zinc-400 dark:focus-within:border-white/[0.18]'
        }`}
      >
        {/* Drag and drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl z-40 border-2 border-dashed border-[#7C8CFF] flex flex-col items-center justify-center p-3 text-center pointer-events-none">
            <Paperclip className="w-6 h-6 text-[#7C8CFF] mb-1 animate-bounce" />
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              {isBn ? 'ফাইল এখানে ছেড়ে দিন' : 'Drop files here'}
            </p>
          </div>
        )}

        {/* Autocomplete @Mention suggestions menu */}
        <MentionMenu
          isOpen={isMentionMenuOpen}
          onClose={() => setIsMentionMenuOpen(false)}
          onSelectMention={handleSelectMention}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          highlightedIndex={safeHighlightedIndex}
          onHighlightedIndexChange={setHighlightedIndex}
          filteredMentions={filteredMentions}
          isBn={isBn}
        />

        {/* Attachment Previews */}
        <AttachmentPreviewChips
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          isBn={isBn}
        />

        {/* Mention Chips layout */}
        {selectedMentions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1 pb-1.5 border-b border-zinc-100 dark:border-white/[0.04] mb-1.5">
            {selectedMentions.map((mention) => (
              <MentionChip
                key={mention.id}
                mention={mention}
                onRemove={() => handleRemoveMention(mention.id)}
              />
            ))}
          </div>
        )}

        {/* File Quick Actions */}
        <FileQuickActions
          attachments={attachments}
          onSelectAction={(promptText) => {
            setInput((prev) => (prev ? `${prev}\n${promptText}` : promptText));
            textareaRef.current?.focus();
          }}
          isBn={isBn}
        />

        {/* Text Input Row with Animated Placeholder */}
        <div className="flex items-start relative min-h-[44px]">
          <AnimatedComposerPlaceholder
            isBn={isBn}
            isVisible={showPlaceholder}
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onClick={handleTextareaClick}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            rows={1}
            className="w-full resize-none bg-transparent text-sm sm:text-[15px] text-zinc-900 dark:text-[#F5F5F5] focus:outline-none pt-[12px] pb-[12px] pl-[10px] pr-[10px] min-h-[44px] max-h-36 leading-relaxed z-10"
          />
        </div>

        {/* Bottom Controls Row: [+] | [Socratic ▾] | [Gemini 3.8 Flash · Medium ▾] | [🎙 / ↑] */}
        <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-zinc-100 dark:border-white/[0.05] gap-1 sm:gap-3 overflow-visible">
          {/* Left: Flex controls container with overflow-visible to prevent clipping popovers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 py-0.5 pr-2 overflow-visible z-30">
            {/* 1. [+] Attachment Button & Popover */}
            <div className="relative inline-flex items-center shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={activePopover === 'attachments'}
                aria-label={isBn ? 'ফাইল সংযুক্ত করুন' : 'Attach files'}
                title={isBn ? 'ফাইল যুক্ত করুন' : 'Attach file'}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopover((prev) => (prev === 'attachments' ? null : 'attachments'));
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                  activePopover === 'attachments'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                    : attachments.length > 0
                    ? 'bg-[#7C8CFF]/15 border-[#7C8CFF]/40 text-[#7C8CFF]'
                    : 'bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.09] border-zinc-200/80 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <ComposerAttachmentMenu
                isOpen={activePopover === 'attachments'}
                onClose={() => setActivePopover(null)}
                language={language}
                onPickDocuments={() => docInputRef.current?.click()}
                onPickImages={() => imgInputRef.current?.click()}
                onPickAudio={() => audioInputRef.current?.click()}
                onPickVideo={() => videoInputRef.current?.click()}
              />
            </div>

            {/* 2. Socratic vs Quick Answer Mode Pill per §10.5 & §11.3 */}
            <div className="inline-flex items-center p-0.5 bg-zinc-100 dark:bg-white/[0.05] rounded-full border border-zinc-200/80 dark:border-white/[0.08] text-[11px] shrink-0">
              <button
                type="button"
                onClick={() => onModeChange('socratic')}
                className={`px-2 sm:px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  currentMode === 'socratic'
                    ? 'bg-white dark:bg-[#1E1E24] text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={isBn ? 'সক্রেটিক টিউটর মোড: ধাপে ধাপে নির্দেশনা' : 'Socratic Tutor Mode: Guides step-by-step'}
              >
                {isBn ? 'টিউটর' : 'Tutor'}
              </button>
              <button
                type="button"
                onClick={() => onModeChange('worked_solution')}
                className={`px-2 sm:px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  currentMode === 'worked_solution'
                    ? 'bg-white dark:bg-[#1E1E24] text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={isBn ? 'সরাসরি উত্তর: পূর্ণাঙ্গ সমাধান' : 'Quick Answer: Direct worked solution'}
              >
                {isBn ? 'দ্রুত উত্তর' : 'Quick'}
              </button>
            </div>

            {/* 3. Control 2: [ThinkWise Fast · Medium ▾] ModelPickerPopover */}
            <div className="relative inline-flex items-center shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={activePopover === 'model'}
                aria-label={isBn ? 'মডেল ও চিন্তন গভীরতা' : 'Select Model & Effort'}
                title={isBn ? 'মডেল ও চিন্তন গভীরতা' : 'Select Model & Effort'}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopover((prev) => (prev === 'model' ? null : 'model'));
                }}
                className={`h-8 px-2 sm:px-3 rounded-full border text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                  activePopover === 'model'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                    : 'bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.09] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className="font-mono font-semibold truncate max-w-[110px] sm:max-w-none">
                  {modelShortLabels[selectedModel] || 'ThinkWise Fast'}
                </span>
                <span className="opacity-70 font-normal hidden sm:inline truncate max-w-[50px] sm:max-w-none">
                  {isBn ? effortLabels[selectedThinkingLevel]?.bn : effortLabels[selectedThinkingLevel]?.en}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              <ModelPickerPopover
                isOpen={activePopover === 'model'}
                onClose={() => setActivePopover(null)}
                language={language}
                selectedModel={selectedModel}
                onSelectModel={onModelChange}
                selectedThinkingLevel={selectedThinkingLevel}
                onSelectThinkingLevel={onThinkingLevelChange}
              />
            </div>
          </div>

          {/* Right: Dynamic Mic / Send Button with clean separator line */}
          <div className="shrink-0 flex items-center pl-2 sm:pl-3 border-l border-zinc-200/60 dark:border-white/[0.08]">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/[0.12] hover:bg-zinc-300 dark:hover:bg-white/[0.2] text-zinc-900 dark:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                title={isBn ? 'থামান' : 'Stop generating'}
                aria-label="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current text-zinc-900 dark:text-white" />
              </button>
            ) : hasContentToSend ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-[var(--accent)] hover:bg-[var(--brand-600)] text-white shadow-xs cursor-pointer shrink-0 animate-fadeIn"
                aria-label={isBn ? 'মেসেজ পাঠান' : 'Send message'}
                title={isBn ? 'মেসেজ পাঠান' : 'Send message'}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleListening}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 animate-fadeIn ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.09] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300'
                }`}
                title={isListening ? (isBn ? 'রেকর্ডিং বন্ধ করুন' : 'Stop listening') : (isBn ? 'মুখে বলে প্রম্পট দিন' : 'Voice prompt')}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer per §11.7 */}
      <p className="text-[10px] sm:text-[11px] text-[var(--text-tertiary)] text-center mt-1.5 select-none">
        {isBn
          ? 'ThinkWise AI ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।'
          : 'ThinkWise AI can make mistakes. Verify important information.'}
      </p>
    </div>
  );
}
