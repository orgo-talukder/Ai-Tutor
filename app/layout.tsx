import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AppProviders } from '../components/providers/AppProviders';

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
    <html lang="en" className="dark h-full scroll-smooth">
      <body
        className="min-h-full flex flex-col font-sans antialiased bg-[#0A0A0B] text-[#F5F5F5] selection:bg-[#7C8CFF]/20 selection:text-[#7C8CFF]"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
