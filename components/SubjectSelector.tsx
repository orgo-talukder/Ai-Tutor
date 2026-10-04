'use client';

import React from 'react';
import { AcademicLevel, AppLanguage, SubjectArea, TeachingMode } from '@/lib/types';
import { Compass, Lightbulb, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';

interface SubjectSelectorProps {
  language: AppLanguage;
  selectedSubject: SubjectArea;
  onSubjectChange: (sub: SubjectArea) => void;
  selectedLevel: AcademicLevel;
  onLevelChange: (lvl: AcademicLevel) => void;
  currentMode: TeachingMode;
  onModeChange: (mode: TeachingMode) => void;
}

export function SubjectSelector({
  language,
  selectedSubject,
  onSubjectChange,
  selectedLevel,
  onLevelChange,
  currentMode,
  onModeChange,
}: SubjectSelectorProps) {
  const isBn = language === 'bn';

  const subjects: { id: SubjectArea; labelEn: string; labelBn: string }[] = [
    { id: 'general', labelEn: 'All Topics', labelBn: 'সকল বিষয়' },
    { id: 'mathematics', labelEn: 'Mathematics', labelBn: 'গণিত' },
    { id: 'physics', labelEn: 'Physics', labelBn: 'পদার্থবিজ্ঞান' },
    { id: 'chemistry', labelEn: 'Chemistry', labelBn: 'রসায়ন' },
    { id: 'biology', labelEn: 'Biology', labelBn: 'জীববিজ্ঞান' },
    { id: 'computer_science', labelEn: 'Computer Science', labelBn: 'কম্পিউটার সায়েন্স' },
    { id: 'language', labelEn: 'Grammar & Lang', labelBn: 'ভাষা ও ব্যাকরণ' },
  ];

  const levels: { id: AcademicLevel; labelEn: string; labelBn: string }[] = [
    { id: 'school', labelEn: 'School (Class 6-10)', labelBn: 'স্কুল (৬ষ্ঠ-১০ম শ্রেণি)' },
    { id: 'college', labelEn: 'College (HSC / 11-12)', labelBn: 'কলেজ (একাদশ-দ্বাদশ)' },
    { id: 'university', labelEn: 'University', labelBn: 'বিশ্ববিদ্যালয়' },
    { id: 'self_learner', labelEn: 'Self-Learner', labelBn: 'মুক্ত শিক্ষার্থী' },
  ];

  const modes: { id: TeachingMode; icon: React.ReactNode; labelEn: string; labelBn: string; descEn: string; descBn: string }[] = [
    {
      id: 'socratic',
      icon: <Compass className="w-4 h-4 text-sky-500" />,
      labelEn: 'Socratic Intuition',
      labelBn: 'সক্রেটিক অন্তর্দৃষ্টি',
      descEn: 'Build understanding through guiding questions and intuition',
      descBn: 'প্রশ্ন ও ধারণার মাধ্যমে নিজে ভাবতে শেখা',
    },
    {
      id: 'worked_solution',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      labelEn: 'Worked Derivation',
      labelBn: 'ধাপে ধাপে সমাধান',
      descEn: 'Formal step-by-step mathematical reasoning and verification',
      descBn: 'স্পষ্ট গাণিতিক ধাপ এবং যাচাইকরণ',
    },
    {
      id: 'check_answer',
      icon: <GraduationCap className="w-4 h-4 text-indigo-500" />,
      labelEn: 'Check My Answer',
      labelBn: 'আমার সমাধান যাচাই',
      descEn: 'Diagnose misconceptions, sign mistakes, and formula choice',
      descBn: 'ভুল ও বিভ্রান্তি শনাক্ত করে সঠিক পদ্ধতি শেখা',
    },
    {
      id: 'simplify',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      labelEn: 'Explain Like I’m 12',
      labelBn: 'একদম সহজ উপমা',
      descEn: 'Vivid real-life analogies without intimidating jargon',
      descBn: 'বাস্তব জীবনের উদাহরণের সাহায্যে সহজবোধ্য ব্যাখ্যা',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Mode Selector Deck */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isActive
                  ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm ring-1 ring-sky-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {m.icon}
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isBn ? m.labelBn : m.labelEn}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {isBn ? m.descBn : m.descEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Subject and Level Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {/* Subject Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 mr-1">
            {isBn ? 'বিষয়:' : 'Subject:'}
          </span>
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSubjectChange(sub.id)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isBn ? sub.labelBn : sub.labelEn}
              </button>
            );
          })}
        </div>

        {/* Academic Level Selector */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <label htmlFor="academic-level-select" className="text-slate-400 dark:text-slate-500 font-medium">
            {isBn ? 'শ্রেণি / স্তর:' : 'Level:'}
          </label>
          <select
            id="academic-level-select"
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value as AcademicLevel)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {isBn ? lvl.labelBn : lvl.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
