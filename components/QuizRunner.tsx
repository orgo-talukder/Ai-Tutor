'use client';

import React, { useState, useEffect } from 'react';
import { AppLanguage, QuizQuestion, SubjectArea } from '@/lib/types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface QuizRunnerProps {
  language: AppLanguage;
  initialTopic?: string;
  subject?: SubjectArea;
  onBackToChat: () => void;
  onSaveFormulaNote: (note: string) => void;
}

export function QuizRunner({
  language,
  initialTopic = 'Photosynthesis and Energy Transfer',
  subject = 'biology',
  onBackToChat,
  onSaveFormulaNote,
}: QuizRunnerProps) {
  const isBn = language === 'bn';
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async (quizTopic: string) => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setQuizFinished(false);

    try {
      const res = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          subject,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate diagnostic quiz');
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No quiz questions generated');
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        isBn
          ? 'কুইজ লোড করতে সমস্যা হয়েছে। অন্য বিষয় দিয়ে চেষ্টা করুন।'
          : 'Failed to generate quiz for this topic. Please try another query.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialTopic) return;
    let isCancelled = false;

    // Asynchronously fetch quiz questions on topic or language change
    Promise.resolve().then(async () => {
      if (isCancelled) return;
      setLoading(true);
      setError(null);
      setQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setScore(0);
      setQuizFinished(false);

      try {
        const res = await fetch('/api/tutor/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: initialTopic,
            subject,
            language,
          }),
        });

        if (!res.ok) throw new Error('Failed to generate diagnostic quiz');
        const data = await res.json();
        if (!isCancelled) {
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            throw new Error('No quiz questions generated');
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error(err);
          setError(
            language === 'bn'
              ? 'কুইজ লোড করতে সমস্যা হয়েছে। অন্য বিষয় দিয়ে চেষ্টা করুন।'
              : 'Failed to generate quiz for this topic. Please try another query.'
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [initialTopic, language, subject]);

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered

    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const currentQ = questions[currentIndex];
  const hasAnswered = selectedAnswers[currentIndex] !== undefined;
  const chosenIndex = selectedAnswers[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header and Topic Generator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>{isBn ? 'ডায়াগনস্টিক প্র্যাকটিস কুইজ' : 'Diagnostic Practice Quiz'}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'আপনার ধারণা যাচাই করুন' : 'Test Your Conceptual Mastery'}
            </h2>
          </div>

          <button
            onClick={onBackToChat}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline text-left"
          >
            ← {isBn ? 'টিউটর চ্যাটে ফিরে যান' : 'Back to Tutor Chat'}
          </button>
        </div>

        {/* Change Topic Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (topic.trim()) fetchQuiz(topic);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={isBn ? 'কুইজের বিষয় লিখুন...' : 'Enter any concept or topic...'}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isBn ? 'নতুন কুইজ তৈরি করো' : 'Generate Quiz'}</span>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {isBn
              ? 'ডায়াগনস্টিক প্রশ্ন ও সাধারণ ভুল বিশ্লেষণ প্রস্তুত করা হচ্ছে...'
              : 'Formulating conceptual questions & diagnosing common misconceptions...'}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchQuiz(topic)}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700"
          >
            {isBn ? 'আবার চেষ্টা' : 'Retry'}
          </button>
        </div>
      )}

      {/* Finished Quiz Scorecard */}
      {quizFinished && !loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-2xl font-bold">
            {score}/{questions.length}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {score === questions.length
                ? isBn
                  ? 'অসাধারণ! আপনার ধারণা সম্পূর্ণ স্পষ্ট!'
                  : 'Flawless! Complete Conceptual Mastery!'
                : score >= 1
                ? isBn
                  ? 'ভালো হয়েছে! কিছু সূক্ষ্ম ভুল চিহ্নিত হয়েছে।'
                  : 'Good Effort! Key Misconceptions Identified.'
                : isBn
                ? 'ধারণাটি টিউটরের সাথে আবার রিভিশন করুন।'
                : 'Review the Core Concept with Your Tutor.'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn
                ? 'সঠিক উত্তর ও ভুলের কারণ নিচে পর্যালোচনা করতে পারেন অথবা টিউটর চ্যাটে জিজ্ঞাসা করতে পারেন।'
                : 'Review question explanations below or ask your tutor to clarify weak areas.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => fetchQuiz(topic)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন প্রশ্ন দিয়ে আবার চেষ্টা' : 'Try Fresh Questions'}</span>
            </button>
            <button
              onClick={onBackToChat}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {isBn ? 'টিউটরে ফিরে যান' : 'Return to Chat'}
            </button>
          </div>
        </div>
      )}

      {/* Active Question Card */}
      {!loading && !quizFinished && currentQ && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span>
              {isBn ? 'প্রশ্ন' : 'Question'} {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {isBn ? 'স্কোর:' : 'Score:'} {score}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = chosenIndex === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctIndex;

              let buttonStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200';

              if (hasAnswered) {
                if (isCorrectOpt) {
                  buttonStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  buttonStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                } else {
                  buttonStyle = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${buttonStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>

                  {hasAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Misconception Alert (Revealed after selection) */}
          {hasAnswered && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  chosenIndex === currentQ.correctIndex
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  {chosenIndex === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? 'সঠিক উত্তর!' : 'Correct Reasoning!'}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{isBn ? 'ভুল হয়েছে — সঠিক ব্যাখ্যা দেখুন:' : 'Incorrect — Conceptual Breakdown:'}</span>
                    </>
                  )}
                </div>
                <div>{currentQ.explanation}</div>
              </div>

              {currentQ.misconceptionAlert && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 mb-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {isBn ? 'শিক্ষার্থীদের সাধারণ ভুল (Misconception Trap):' : 'Common Misconception Trap:'}
                  </strong>
                  <span>{currentQ.misconceptionAlert}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() =>
                    onSaveFormulaNote(
                      `[Quiz Note: ${topic}]\nQ: ${currentQ.question}\nAnswer: ${currentQ.options[currentQ.correctIndex]}\nExplanation: ${currentQ.explanation}`
                    )
                  }
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 underline"
                >
                  {isBn ? 'ব্যাখ্যাটি নোটপ্যাডে সংরক্ষণ করুন' : 'Save takeaway to scratchpad'}
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>
                    {currentIndex < questions.length - 1
                      ? isBn
                        ? 'পরবর্তী প্রশ্ন'
                        : 'Next Question'
                      : isBn
                      ? 'ফলাফল দেখুন'
                      : 'View Results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
