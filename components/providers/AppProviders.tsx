'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { AuthProvider } from '../../lib/firebase/authContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
