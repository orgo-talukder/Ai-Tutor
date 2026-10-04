import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai/gemini';
import { AppLanguage, SubjectArea, QuizQuestion } from '@/lib/types';
import { Type } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { topic, subject = 'general', language = 'bn' }: { topic: string; subject?: SubjectArea; language?: AppLanguage } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required to generate quiz.' }, { status: 400 });
    }

    const languageInstruction = language === 'bn'
      ? 'The questions, options, and explanations must be in natural, accurate Bengali (বাংলা). Standard scientific/academic English terms may be kept in parentheses for clarity.'
      : 'The questions, options, and explanations must be in clear, standard English.';

    const prompt = `Generate a high-yield 3-question diagnostic quiz to test a student's conceptual understanding of: "${topic}".
Subject area: ${subject}.
${languageInstruction}

Ensure each question focuses on a common misconception or key reasoning step.
For each question:
- Exactly 4 options.
- Exactly 1 correctIndex (0 to 3).
- A clear explanation explaining why the correct answer is right and why distractors are wrong.
- A short "misconceptionAlert" explaining the typical mental trap students fall into.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              misconceptionAlert: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
          },
        },
        temperature: 0.5,
      },
    });

    const text = response.text?.trim() || '[]';
    const questions: QuizQuestion[] = JSON.parse(text);

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    console.error('Quiz Generation Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate quiz';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
