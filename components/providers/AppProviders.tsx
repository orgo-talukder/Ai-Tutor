'use client';

import React from 'react';
import { AuthProvider } from '../../lib/firebase/authContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
