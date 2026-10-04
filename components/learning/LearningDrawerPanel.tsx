'use client';

import React, { useState } from 'react';
import { AppLanguage, QuizQuestion, SavedNote, SubjectArea, TeachBackAssessment } from '@/lib/types';
import {
  X,
  Compass,
  Award,
  Bookmark,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  Trash2,
  Loader2,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

interface LearningDrawerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  activeTab: 'quiz' | 'teach_back' | 'scratchpad';
  onTabChange: (tab: 'quiz' | 'teach_back' | 'scratchpad') => void;
  // Quiz Props
  quizTopic: string;
  onQuizTopicChange: (topic: string) => void;
  subject: SubjectArea;
  // Teach-Back Props
  teachBackTopic: string;
  onTeachBackTopicChange: (topic: string) => void;
  // Notes Props
  savedNotes: SavedNote[];
  onDeleteNote: (id: string) => void;
  onClearNotes: () => void;
  onSaveNote: (snippet: string) => void;
  onGenerateRecap: () => void;
}

export function LearningDrawerPanel({
  isOpen,
  onClose,
  language,
  activeTab,
  onTabChange,
  quizTopic,
  onQuizTopicChange,
  subject,
  teachBackTopic,
  onTeachBackTopicChange,
  savedNotes,
  onDeleteNote,
  onClearNotes,
  onGenerateRecap,
}: LearningDrawerPanelProps) {
  const isBn = language === 'bn';

  // --- QUIZ INTERNAL STATE ---
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // --- TEACH-BACK INTERNAL STATE ---
  const [studentExplanation, setStudentExplanation] = useState('');
  const [teachBackLoading, setTeachBackLoading] = useState(false);
  const [teachBackAssessment, setTeachBackAssessment] = useState<TeachBackAssessment | null>(null);
  const [teachBackError, setTeachBackError] = useState<string | null>(null);

  // --- SCRATCHPAD STATE ---
  const [copiedAllNotes, setCopiedAllNotes] = useState(false);

  if (!isOpen) return null;

  // Handler: Fetch Quiz
  const fetchQuiz = async (topic: string) => {
    if (!topic.trim()) return;
    setQuizLoading(true);
    setQuizError(null);
    setQuizQuestions([]);
    setQuizIndex(0);
    setSelectedAnswers({});
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const res = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, language }),
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuizQuestions(data.questions);
      } else {
        throw new Error('Invalid quiz response structure');
      }
    } catch (err: unknown) {
      setQuizError(err instanceof Error ? err.message : 'Quiz generation failed');
    } finally {
      setQuizLoading(false);
    }
  };

  // Handler: Teach-Back Assessment
  const handleTeachBackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachBackTopic.trim() || !studentExplanation.trim()) return;

    setTeachBackLoading(true);
    setTeachBackError(null);
    setTeachBackAssessment(null);

    try {
      const res = await fetch('/api/tutor/teach-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: teachBackTopic,
          explanation: studentExplanation,
          language,
        }),
      });
      if (!res.ok) throw new Error('Assessment evaluation failed');
      const data = await res.json();
      setTeachBackAssessment(data);
    } catch (err: unknown) {
      setTeachBackError(err instanceof Error ? err.message : 'Evaluation failed');
    } finally {
      setTeachBackLoading(false);
    }
  };

  // Export Scratchpad to Markdown file
  const handleExportMarkdown = () => {
    if (savedNotes.length === 0) return;
    const content = savedNotes
      .map(
        (n, i) =>
          `### ${i + 1}. ${n.title}\n*Saved: ${new Date(n.timestamp).toLocaleString()}*\n\n${n.snippet}\n\n---`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AI_Tutor_Study_Notes_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyNotes = () => {
    if (savedNotes.length === 0) return;
    const content = savedNotes.map((n) => `## ${n.title}\n${n.snippet}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(content);
    setCopiedAllNotes(true);
    setTimeout(() => setCopiedAllNotes(false), 2000);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
      />

      {/* Slide-over Right Workspace Panel */}
      <div className="fixed top-0 bottom-0 right-0 z-40 w-full sm:w-[420px] lg:w-[440px] bg-white dark:bg-[#0F0F10] border-l border-zinc-200 dark:border-white/[0.08] shadow-2xl flex flex-col animate-slideLeft transition-all text-zinc-900 dark:text-white">
        {/* Panel Header & Navigation Switcher */}
        <div className="p-3 sm:p-3.5 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between gap-2">
          {/* Segmented Tool Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-xs">
            <button
              onClick={() => onTabChange('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{isBn ? 'কুইজ' : 'Quiz'}</span>
            </button>

            <button
              onClick={() => onTabChange('teach_back')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'teach_back'
                  ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#7C8CFF]" />
              <span>{isBn ? 'টিচ-ব্যাক' : 'Teach-Back'}</span>
            </button>

            <button
              onClick={() => onTabChange('scratchpad')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'scratchpad'
                  ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isBn ? 'নোটস' : 'Notes'}</span>
              {savedNotes.length > 0 && (
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-300 ml-0.5">
                  ({savedNotes.length})
                </span>
              )}
            </button>
          </div>

          {/* Close Panel Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: DIAGNOSTIC QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Topic Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (quizTopic.trim()) fetchQuiz(quizTopic);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => onQuizTopicChange(e.target.value)}
                  placeholder={isBn ? 'কুইজের বিষয়...' : 'Topic for quiz...'}
                  className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#7C8CFF]"
                />
                <button
                  type="submit"
                  disabled={quizLoading || !quizTopic.trim()}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] rounded-xl text-xs font-medium border border-transparent dark:border-white/[0.08] transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {quizLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#7C8CFF]" />
                  )}
                  <span>{isBn ? 'জেনারেট' : 'Generate'}</span>
                </button>
              </form>

              {/* Initial Zero-State */}
              {!quizLoading && quizQuestions.length === 0 && !quizError && (
                <div className="py-12 text-center space-y-2">
                  <Compass className="w-8 h-8 text-emerald-500 dark:text-emerald-400/80 mx-auto" />
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {isBn ? 'ধারণা যাচাইয়ের কুইজ' : 'Diagnostic Mastery Quiz'}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                    {isBn
                      ? 'যেকোনো বিষয় লিখুন অথবা উপরের জেনারেট বাটনে চাপুন—টিউটর ৩টি ধারণামূলক প্রশ্ন প্রস্তুত করবে।'
                      : 'Enter any topic or press Generate to test your intuition with targeted conceptual questions.'}
                  </p>
                </div>
              )}

              {/* Error Notice */}
              {quizError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-300">
                  {quizError}
                </div>
              )}

              {/* Active Quiz Question */}
              {!quizLoading && quizQuestions.length > 0 && !quizFinished && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pb-2 border-b border-zinc-200 dark:border-white/[0.06]">
                    <span>
                      {isBn ? 'প্রশ্ন' : 'Question'} {quizIndex + 1} / {quizQuestions.length}
                    </span>
                    <span>
                      {isBn ? 'স্কোর:' : 'Score:'} {quizScore}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-900 dark:text-white leading-snug">
                    {quizQuestions[quizIndex]?.question}
                  </p>

                  <div className="space-y-2">
                    {quizQuestions[quizIndex]?.options.map((opt, optIdx) => {
                      const answered = selectedAnswers[quizIndex] !== undefined;
                      const isCorrect = optIdx === quizQuestions[quizIndex].correctIndex;
                      const isSelected = selectedAnswers[quizIndex] === optIdx;

                      let style = 'bg-white dark:bg-[#1A1A1D] border-zinc-200 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/[0.16]';
                      if (answered) {
                        if (isCorrect) {
                          style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200';
                        } else if (isSelected) {
                          style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                        } else {
                          style = 'opacity-40 bg-zinc-100 dark:bg-[#1A1A1D] border-zinc-200 dark:border-white/[0.04] text-zinc-400';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={answered}
                          onClick={() => {
                            if (answered) return;
                            setSelectedAnswers((prev) => ({ ...prev, [quizIndex]: optIdx }));
                            if (isCorrect) setQuizScore((prev) => prev + 1);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {selectedAnswers[quizIndex] !== undefined && (
                    <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-white/[0.06] animate-fadeIn text-xs">
                      <div
                        className={`p-3 rounded-xl leading-relaxed ${
                          selectedAnswers[quizIndex] === quizQuestions[quizIndex].correctIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
                        }`}
                      >
                        {quizQuestions[quizIndex].explanation}
                      </div>

                      {quizQuestions[quizIndex].misconceptionAlert && (
                        <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-white/[0.02] border border-amber-200 dark:border-white/[0.06] text-[11px] text-amber-800 dark:text-zinc-400 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{quizQuestions[quizIndex].misconceptionAlert}</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (quizIndex < quizQuestions.length - 1) {
                              setQuizIndex((prev) => prev + 1);
                            } else {
                              setQuizFinished(true);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>
                            {quizIndex < quizQuestions.length - 1
                              ? isBn
                                ? 'পরবর্তী'
                                : 'Next'
                              : isBn
                              ? 'ফলাফল'
                              : 'Finish'}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Scorecard */}
              {quizFinished && (
                <div className="p-6 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.06] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-lg font-bold">
                    {quizScore}/{quizQuestions.length}
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {quizScore === quizQuestions.length
                      ? isBn
                        ? 'চমৎকার! নিখুঁত বোঝাপড়া!'
                        : 'Flawless Intuition!'
                      : isBn
                      ? 'ভালো প্রচেষ্টা! দুর্বল বিষয়গুলো চিহ্নিত হয়েছে।'
                      : 'Good effort! Key nuances identified.'}
                  </h4>
                  <button
                    onClick={() => fetchQuiz(quizTopic)}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] rounded-xl text-xs font-medium border border-transparent dark:border-white/[0.08] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isBn ? 'আবার চেষ্টা' : 'Try Fresh Quiz'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEACH-BACK LAB */}
          {activeTab === 'teach_back' && (
            <div className="space-y-4 animate-fadeIn">
              <form onSubmit={handleTeachBackSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {isBn ? 'টপিকের নাম:' : 'Topic to Explain:'}
                  </label>
                  <input
                    type="text"
                    value={teachBackTopic}
                    onChange={(e) => onTeachBackTopicChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#7C8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {isBn ? 'আপনার নিজের ভাষায় বুঝিয়ে বলুন:' : 'Explain in your own words:'}
                  </label>
                  <textarea
                    rows={4}
                    value={studentExplanation}
                    onChange={(e) => setStudentExplanation(e.target.value)}
                    placeholder={
                      isBn
                        ? 'আমি যেভাবে বুঝি: প্রথমে এটি ঘটে, তারপর...'
                        : 'The way I understand this is: first, this happens, and then...'
                    }
                    className="w-full p-2.5 text-xs bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#7C8CFF] leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={teachBackLoading || !teachBackTopic.trim() || !studentExplanation.trim()}
                  className="w-full py-2.5 bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {teachBackLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Award className="w-3.5 h-3.5" />
                  )}
                  <span>{isBn ? 'টিউটরের মূল্যায়ন নিন' : 'Evaluate My Explanation'}</span>
                </button>
              </form>

              {teachBackError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-300">
                  {teachBackError}
                </div>
              )}

              {/* Assessment Report */}
              {teachBackAssessment && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.06] space-y-3 animate-fadeIn text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/[0.06]">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                        {isBn ? 'বোঝাপড়ার স্কোর' : 'Mastery Score'}
                      </div>
                      <div className="text-xl font-bold text-zinc-900 dark:text-white">
                        {teachBackAssessment.score} <span className="text-xs text-zinc-400 font-normal">/ 10</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-zinc-200 dark:bg-white/[0.08] text-[#7C8CFF]">
                      {teachBackAssessment.status}
                    </span>
                  </div>

                  <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed">{teachBackAssessment.summary}</p>

                  {teachBackAssessment.whatYouGotRight?.length > 0 && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                      <div className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isBn ? 'সঠিক অন্তর্দৃষ্টি:' : 'What You Mastered:'}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-800 dark:text-emerald-200/90 text-[11px]">
                        {teachBackAssessment.whatYouGotRight.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {teachBackAssessment.missingConcepts?.length > 0 && (
                    <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 space-y-1">
                      <div className="text-sky-700 dark:text-sky-300 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                        <span>{isBn ? 'যেসব বিষয় বাদ পড়েছে:' : 'Missing Nuances:'}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-sky-800 dark:text-sky-200/90 text-[11px]">
                        {teachBackAssessment.missingConcepts.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {teachBackAssessment.encouragingGuidance && (
                    <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-white/[0.02] border border-amber-200 dark:border-white/[0.06] text-zinc-700 dark:text-zinc-300 text-[11px] flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{teachBackAssessment.encouragingGuidance}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STUDY SCRATCHPAD & FORMULAS */}
          {activeTab === 'scratchpad' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Quick Actions Strip */}
              <div className="flex items-center justify-between gap-1.5 text-xs">
                <button
                  onClick={onGenerateRecap}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C8CFF]/10 hover:bg-[#7C8CFF]/20 text-[#7C8CFF] border border-[#7C8CFF]/20 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? '৩০ সেকেন্ড রিক্যাপ' : '30s Recap'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyNotes}
                    disabled={savedNotes.length === 0}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.06] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Copy all notes"
                  >
                    {copiedAllNotes ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    disabled={savedNotes.length === 0}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.06] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Export as Markdown (.md)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {savedNotes.length > 0 && (
                    <button
                      onClick={onClearNotes}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.06] transition-colors cursor-pointer"
                      title="Clear all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-2.5">
                {savedNotes.length === 0 ? (
                  <div className="py-12 text-center space-y-2 text-zinc-400 dark:text-zinc-500">
                    <Bookmark className="w-6 h-6 mx-auto opacity-40" />
                    <p className="text-xs leading-relaxed max-w-xs mx-auto">
                      {isBn
                        ? 'কোনো নোট সংরক্ষিত নেই। উত্তরের নিচের বুকমার্কে ক্লিক করে সূত্র ও সারসংক্ষেপ জমা করুন।'
                        : 'No pinned takeaways yet. Click the bookmark icon under any tutor explanation to collect formulas here.'}
                    </p>
                  </div>
                ) : (
                  savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">
                          {note.title}
                        </span>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="text-zinc-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-zinc-100 dark:bg-black/40 p-2 rounded-lg whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {note.snippet}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
