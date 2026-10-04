import { NextRequest } from 'next/server';
import { streamWithFallback } from '@/lib/ai/gemini';
import { BASE_TUTOR_SYSTEM_INSTRUCTION, buildTutorPrompt } from '@/lib/ai/prompts';
import { AcademicLevel, AppLanguage, GeminiModelId, SubjectArea, TeachingMode, ThinkingLevelId, UploadedFileRef } from '@/lib/types';

export const runtime = 'nodejs';

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode?: TeachingMode;
  level?: AcademicLevel;
  subject?: SubjectArea;
  language?: AppLanguage;
  model?: GeminiModelId;
  thinkingLevel?: ThinkingLevelId;
  fileRefs?: UploadedFileRef[];
  explanationDetail?: 'concise' | 'standard' | 'detailed';
  useRealWorldExamples?: boolean;
  askUnderstandingChecks?: boolean;
  showCommonMistakes?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const {
      message = '',
      history = [],
      mode = 'socratic',
      level = 'school',
      subject = 'general',
      language = 'bn',
      model = 'gemini-3.8-flash',
      thinkingLevel = 'medium',
      fileRefs = [],
      explanationDetail = 'standard',
      useRealWorldExamples = true,
      askUnderstandingChecks = true,
      showCommonMistakes = true,
    } = body;

    const trimmedMsg = typeof message === 'string' ? message.trim() : '';

    if (!trimmedMsg && fileRefs.length === 0) {
      return new Response(JSON.stringify({ error: 'Message or file attachment is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Assemble conversational contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; fileData?: { fileUri: string; mimeType: string } }> }> = [];

    // Keep up to 6 recent historical turns for context
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    }

    // Format current turn with contextual pedagogical scaffolding & personalization
    const fullUserPrompt = buildTutorPrompt({
      mode,
      level,
      subject,
      language,
      userMessage: trimmedMsg,
      fileRefs,
      explanationDetail,
      useRealWorldExamples,
      askUnderstandingChecks,
      showCommonMistakes,
    });

    const currentTurnParts: Array<{ text?: string; fileData?: { fileUri: string; mimeType: string } }> = [];

    // Add multimodal file references to current user turn
    for (const ref of fileRefs) {
      if (ref.uri) {
        currentTurnParts.push({
          fileData: {
            fileUri: ref.uri,
            mimeType: ref.mimeType,
          },
        });
      }
    }

    // Add prompt instructions
    currentTurnParts.push({ text: fullUserPrompt });

    contents.push({
      role: 'user',
      parts: currentTurnParts,
    });

    // Create streaming response
    const stream = await streamWithFallback({
      requestedModel: model,
      contents,
      config: {
        systemInstruction: BASE_TUTOR_SYSTEM_INSTRUCTION,
      },
      thinkingLevel,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'Streaming error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    console.error('Chat endpoint error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
