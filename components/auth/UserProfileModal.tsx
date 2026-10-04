'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/firebase/authContext';
import { AppLanguage } from '@/lib/types';
import {
  X,
  User as UserIcon,
  Mail,
  CheckCircle2,
  Edit2,
  LogOut,
  ShieldCheck,
  Calendar,
  Key,
  Check,
} from 'lucide-react';
import Image from 'next/image';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export function UserProfileModal({
  isOpen,
  onClose,
  language,
}: UserProfileModalProps) {
  const { user, updateUserProfileName, logout } = useAuth();
  const isBn = language === 'bn';

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await updateUserProfileName(displayName.trim());
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update display name:', err);
      setError(isBn ? 'নাম পরিবর্তন করা যায়নি।' : 'Failed to update name.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const providerId = user.providerData[0]?.providerId || 'password';
  const isGoogle = providerId.includes('google');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/[0.1] shadow-2xl overflow-hidden p-6 text-zinc-900 dark:text-[#F5F5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Avatar Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4 border-b border-zinc-100 dark:border-white/[0.06]">
          <div className="relative group">
            {user.photoURL ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#7C8CFF] shadow-lg">
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                  fill
                  className="object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 text-white flex items-center justify-center text-2xl font-bold border-2 border-indigo-400 shadow-lg">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            {isGoogle && (
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white dark:bg-[#18181C] border border-zinc-200 dark:border-white/20 flex items-center justify-center shadow-xs"
                title="Signed in with Google Account"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="min-w-0 max-w-full px-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate">
              {user.displayName || (isBn ? 'ব্যবহারকারী' : 'Learner')}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center justify-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Editable Display Name Form */}
        <div className="py-4 border-b border-zinc-100 dark:border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span>{isBn ? 'প্রোফাইল নাম (Display Name)' : 'Display Name'}</span>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[#7C8CFF] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-xs focus:outline-none focus:border-[#7C8CFF]"
                placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 rounded-xl bg-[#7C8CFF] hover:bg-[#6878EF] text-white text-xs font-medium cursor-pointer transition-colors shrink-0 disabled:opacity-50"
              >
                {saving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplayName(user.displayName || '');
                  setIsEditing(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-xs font-medium cursor-pointer transition-colors shrink-0"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </form>
          ) : (
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-white/[0.03] px-3 py-2 rounded-xl border border-zinc-200/60 dark:border-white/[0.05] flex items-center justify-between">
              <span>{user.displayName || (isBn ? 'নাম সেট করা নেই' : 'No name set')}</span>
              {saveSuccess && (
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {isBn ? 'সংরক্ষিত হয়েছে!' : 'Updated!'}
                </span>
              )}
            </p>
          )}

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        </div>

        {/* Account Metadata Details */}
        <div className="py-3 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              {isBn ? 'লগইন মাধ্যম' : 'Auth Provider'}
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
              {isGoogle ? 'Google Account' : 'Email & Password'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              {isBn ? 'ইউজার আইডি' : 'Account UID'}
            </span>
            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
              {user.uid}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isBn ? 'সাইন আউট করুন' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
