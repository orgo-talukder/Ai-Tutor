'use client';

import React, { useState } from 'react';
import { AppLanguage, TeachBackAssessment } from '@/lib/types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Loader2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface TeachBackRunnerProps {
  language: AppLanguage;
  initialTopic?: string;
  onBackToChat: () => void;
  onSaveNote: (note: string) => void;
}

export function TeachBackRunner({
  language,
  initialTopic = 'Photosynthesis',
  onBackToChat,
  onSaveNote,
}: TeachBackRunnerProps) {
  const isBn = language === 'bn';
  const [topic, setTopic] = useState(initialTopic);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<TeachBackAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !explanation.trim()) return;

    setLoading(true);
    setError(null);
    setAssessment(null);

    try {
      const res = await fetch('/api/tutor/teach-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          studentExplanation: explanation,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate explanation');
      }

      const data = await res.json();
      setAssessment(data.assessment);
    } catch (err: unknown) {
      console.error(err);
      setError(
        isBn
          ? 'মূল্যায়ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Failed to evaluate your explanation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Award className="w-4 h-4" />
              <span>{isBn ? 'টিচ-ব্যাক ল্যাব (Teach-Back Lab)' : 'Teach-Back Assessment Lab'}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'নিজের ভাষায় টিউটরকে বুঝিয়ে বলো' : 'Explain It Back in Your Own Words'}
            </h2>
          </div>

          <button
            onClick={onBackToChat}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline text-left"
          >
            ← {isBn ? 'টিউটর চ্যাটে ফিরে যান' : 'Back to Tutor Chat'}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {isBn
            ? 'গবেষণায় দেখা গেছে, কোনো বিষয় অন্যকে নিজের ভাষায় শেখাতে পারলে সবচেয়ে গভীর বোঝাপড়া তৈরি হয়। নিচের টপিকটি যেভাবে বুঝেছেন তা ব্যাখ্যা করুন—টিউটর আপনার সঠিক ধারণা প্রশংসা করবে এবং কোনো ভুল বা অসম্পূর্ণতা থাকলে বুঝিয়ে দেবে।'
            : 'Evidence shows explaining concepts in your own words cements deep intuition. Write your understanding below—your AI tutor will validate your core strengths, catch missing nuances, and diagnose any misconceptions.'}
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div>
          <label htmlFor="teach-back-topic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {isBn ? 'বিষয় / টপিকের নাম:' : 'Topic / Concept Name:'}
          </label>
          <input
            id="teach-back-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={isBn ? 'যেমন: সালোকসংশ্লেষণ, নিউটনের ৩য় সূত্র, কোয়াড্রাটিক সমীকরণ' : 'e.g. Photosynthesis, Newton’s 3rd Law, Binary Search, Entropy'}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="student-explanation" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {isBn ? 'আপনার নিজের ভাষায় ব্যাখ্যা:' : 'Your Explanation (in your own words):'}
          </label>
          <textarea
            id="student-explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={5}
            placeholder={
              isBn
                ? 'আমি যেভাবে বুঝি: প্রথমে সূর্যের আলো ক্লোরোফিলে পড়ে, তারপর পানি ভেঙে অক্সিজেন বের হয়... (নিজের ভাষায় সহজ করে লিখুন)'
                : 'The way I understand this is: when sunlight hits the chlorophyll, water molecules split into oxygen and protons... (write naturally, no need for textbook jargon)'
            }
            className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {explanation.trim().split(/\s+/).filter(Boolean).length} {isBn ? 'শব্দ' : 'words'}
          </span>

          <button
            type="submit"
            disabled={loading || !topic.trim() || !explanation.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs shadow-indigo-500/20"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isBn ? 'টিউটরের মূল্যায়ন নিন' : 'Evaluate My Explanation'}</span>
          </button>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Assessment Feedback Card */}
      {assessment && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {isBn ? 'বোঝাপড়ার স্কোর' : 'Conceptual Score'}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <span>{assessment.score}</span>
                <span className="text-sm font-normal text-slate-400">/ 10</span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                assessment.status === 'excellent'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : assessment.status === 'good'
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}
            >
              {assessment.status.replace('_', ' ')}
            </span>
          </div>

          {/* High-level Summary */}
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {assessment.summary}
          </p>

          {/* Strengths: What you got right */}
          {assessment.whatYouGotRight?.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs sm:text-sm space-y-2">
              <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'যেসব ধারণা আপনি সঠিকভাবে বুঝেছেন:' : 'What You Mastered Accurately:'}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800 dark:text-emerald-300 text-xs">
                {assessment.whatYouGotRight.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Concepts */}
          {assessment.missingConcepts?.length > 0 && (
            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/40 text-xs sm:text-sm space-y-2">
              <div className="font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>{isBn ? 'যেসব মূল বিষয় যোগ করলে ব্যাখ্যাটি নিখুঁত হতো:' : 'Missing Nuances to Complete Your Model:'}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sky-800 dark:text-sky-300 text-xs">
                {assessment.missingConcepts.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Misconceptions diagnosed */}
          {assessment.misconceptionsFound?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm space-y-2">
              <div className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{isBn ? 'সংশোধনযোগ্য বিভ্রান্তি (Misconceptions):' : 'Identified Conceptual Pitfalls:'}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300 text-xs">
                {assessment.misconceptionsFound.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Encouraging Next Step */}
          {assessment.encouragingGuidance && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {isBn ? 'পরবর্তী অনুশীলনের পরামর্শ:' : 'Next Step Recommendation:'}{' '}
                </strong>
                <span>{assessment.encouragingGuidance}</span>
              </div>
            </div>
          )}

          {/* Save & Return Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() =>
                onSaveNote(
                  `[Teach-Back Evaluation: ${topic}]\nScore: ${assessment.score}/10 (${assessment.status})\nSummary: ${assessment.summary}\nGuidance: ${assessment.encouragingGuidance}`
                )
              }
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
            >
              {isBn ? 'এই মূল্যায়নটি নোটপ্যাডে সংরক্ষণ করুন' : 'Save evaluation summary to scratchpad'}
            </button>

            <button
              onClick={onBackToChat}
              className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>{isBn ? 'টিউটরের সাথে চ্যাট চালিয়ে যান' : 'Continue Tutoring'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
