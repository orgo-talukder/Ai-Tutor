import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai/gemini';
import { AppLanguage, TeachBackAssessment } from '@/lib/types';
import { Type } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const {
      topic,
      studentExplanation,
      language = 'bn',
    }: {
      topic: string;
      studentExplanation: string;
      language?: AppLanguage;
    } = await req.json();

    if (!topic || !studentExplanation) {
      return NextResponse.json(
        { error: 'Topic and studentExplanation are required.' },
        { status: 400 }
      );
    }

    const langDirective = language === 'bn'
      ? 'Output all evaluation points in supportive, clear Bengali (বাংলা). English technical terms can be placed in parentheses.'
      : 'Output all evaluation points in encouraging, clear English.';

    const prompt = `You are an expert pedagogical evaluator assessing a student's "Teach-Back" response.
Concept being evaluated: "${topic}"
Student's own explanation:
"""
${studentExplanation}
"""

Evaluate the student's explanation against canonical scientific/academic standards.
Guidelines:
1. Provide a score from 1 to 10 on conceptual depth and accuracy.
2. Status: "excellent" (8-10), "good" (5-7), or "needs_improvement" (1-4).
3. Identify 2-3 specific points they got right (praise their accurate intuition).
4. Identify 1-2 critical missing concepts or nuances they skipped.
5. Identify any misconceptions or errors in reasoning (if none, leave empty array).
6. Provide an encouraging 1-2 sentence guidance on what step to take next.
${langDirective}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            status: { type: Type.STRING },
            summary: { type: Type.STRING },
            whatYouGotRight: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            misconceptionsFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            encouragingGuidance: { type: Type.STRING },
          },
          required: [
            'score',
            'status',
            'summary',
            'whatYouGotRight',
            'missingConcepts',
            'misconceptionsFound',
            'encouragingGuidance',
          ],
        },
        temperature: 0.3,
      },
    });

    const text = response.text?.trim() || '{}';
    const assessment: TeachBackAssessment = JSON.parse(text);

    return NextResponse.json({ assessment });
  } catch (error: unknown) {
    console.error('Teach-Back Evaluation Error:', error);
    const message = error instanceof Error ? error.message : 'Evaluation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
