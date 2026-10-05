import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AppProviders } from '../components/providers/AppProviders';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: 'ThinkWise AI — Premium AI Learning Companion',
  description:
    'A focused, conversational AI tutor for STEM and humanities with Socratic intuition, step-by-step derivations, misconception diagnosis, and interactive practice.',
  openGraph: {
    title: 'ThinkWise AI — Premium AI Learning Companion',
    description:
      'A focused, conversational AI tutor for STEM and humanities with Socratic intuition, step-by-step derivations, misconception diagnosis, and interactive practice.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkWise AI — Premium AI Learning Companion',
    description:
      'A focused, conversational AI tutor for STEM and humanities with Socratic intuition, step-by-step derivations, misconception diagnosis, and interactive practice.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth">
      <body
        className="min-h-full flex flex-col font-sans antialiased bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
