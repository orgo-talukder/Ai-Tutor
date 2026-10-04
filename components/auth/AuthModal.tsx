'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/firebase/authContext';
import { X, Mail, Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'bn';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang = 'bn' }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please enter your name');
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('auth/invalid-credential') || errMsg.includes('auth/wrong-password')) {
        setError(lang === 'bn' ? 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।' : 'Invalid email or password.');
      } else if (errMsg.includes('auth/email-already-in-use')) {
        setError(lang === 'bn' ? 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।' : 'Email is already registered.');
      } else if (errMsg.includes('auth/weak-password')) {
        setError(lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password should be at least 6 characters.');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isSignUp
              ? lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'
              : lang === 'bn' ? 'সাইন-ইন করুন' : 'Welcome Back'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {lang === 'bn'
              ? 'আপনার লার্নিং সেশন এবং নোটবুক নিরাপদ রাখতে লগইন করুন'
              : 'Save your learning sessions and notes securely in Firebase'}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 py-2.5 px-4 text-sm font-medium text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
          <span>
            {lang === 'bn' ? 'Google দিয়ে সাইন-ইন করুন' : 'Continue with Google'}
          </span>
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {lang === 'bn' ? 'অথবা ইমেইল ব্যবহার করুন' : 'or with email'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: রাফসান আহমেদ' : 'e.g. John Doe'}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {lang === 'bn' ? 'অপেক্ষা করুন...' : 'Processing...'}
              </span>
            ) : isSignUp ? (
              lang === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Create Account'
            ) : (
              lang === 'bn' ? 'লগইন করুন' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              {lang === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className="font-semibold text-cyan-400 hover:underline ml-1"
              >
                {lang === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
            </p>
          ) : (
            <p>
              {lang === 'bn' ? 'নতুন ব্যবহারকারী?' : 'New user?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className="font-semibold text-cyan-400 hover:underline ml-1"
              >
                {lang === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create an Account'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
