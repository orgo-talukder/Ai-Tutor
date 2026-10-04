import { NextRequest, NextResponse } from 'next/server';
import { streamWithFallback } from '@/lib/ai/gemini';
import { BASE_TUTOR_SYSTEM_INSTRUCTION, buildTutorPrompt } from '@/lib/ai/prompts';
import { ALLOWED_MENTIONS_ALLOWLIST } from '@/lib/mentions/definitions';
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
  mentions?: Array<{ id: string; type: string; label: string }>;
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
      model = 'gemini-2.5-flash',
      thinkingLevel = 'medium',
      fileRefs = [],
      explanationDetail = 'standard',
      useRealWorldExamples = true,
      askUnderstandingChecks = true,
      showCommonMistakes = true,
      mentions = [],
    } = body;

    const trimmedMsg = typeof message === 'string' ? message.trim() : '';

    if (!trimmedMsg && fileRefs.length === 0 && mentions.length === 0) {
      return NextResponse.json({ error: 'Message, file attachment, or @Mention is required.' }, { status: 400 });
    }

    // --- CRITICAL SECURITY: SERVER-SIDE ALLOWLIST VALIDATION ---
    const invalidMentions = mentions.filter((m) => !ALLOWED_MENTIONS_ALLOWLIST.includes(m.id));
    if (invalidMentions.length > 0) {
      return NextResponse.json(
        {
          error: `Security Violation: Unauthorized or malicious @Mentions detected (${invalidMentions
            .map((m) => m.id)
            .join(', ')}).`,
        },
        { status: 403 }
      );
    }

    // --- CRITICAL SECURITY: SERVER-SIDE MODEL & THINKING LEVEL ALLOWLIST VALIDATION ---
    const allowedModels = ['gemini-2.5-flash', 'gemini-3.7-flash'];
    const allowedThinkingLevels = ['low', 'medium', 'high'];

    if (!allowedModels.includes(model)) {
       return NextResponse.json(
         { error: 'Security Violation: Invalid or unauthorized model selection.' },
         { status: 400 }
       );
    }

    if (!allowedThinkingLevels.includes(thinkingLevel)) {
       return NextResponse.json(
         { error: 'Security Violation: Invalid or unauthorized thinking level.' },
         { status: 400 }
       );
    }

    // Build specialized instruction injection based on selected capabilities and context references
    let mentionInjections = '';
    const activeCapabilities = mentions.filter((m) => m.type === 'capability');
    const activeContexts = mentions.filter((m) => m.type === 'context');

    if (activeCapabilities.length > 0) {
      mentionInjections += `\n\n[ACTIVE CAPABILITIES & SPECIAL REQUESTS]`;
      for (const cap of activeCapabilities) {
        if (cap.id === 'canvas') {
          mentionInjections += `\n- CAPABILITY: @Canvas. The user has routed this request to an interactive workspace. 
          If you are providing a study guide, use rich Markdown. 
          If you are providing code (HTML/JS), use a code block. 
          The canvas has three tabs: Markdown, Code, and Preview. 
          Structure your output clearly. If it's a website or game, provide the full standalone HTML/CSS/JS within a single code block for the 'Preview' tab to work.`;
        } else if (cap.id === 'notes') {
          mentionInjections += `\n- CAPABILITY: @Notes. Structure your response as a highly detailed, clean, exam-ready revision note or study guide with distinct bullet points, terminology, and mnemonics.`;
        } else if (cap.id === 'diagram') {
          mentionInjections += `\n- CAPABILITY: @Diagram. Provide a clear text-based ASCII diagram, flowchart, or structured visual hierarchy within a preformatted markdown block (\`\`\`text ... \`\`\`) to illustrate the concept visually.`;
        } else if (cap.id === 'mindmap') {
          mentionInjections += `\n- CAPABILITY: @MindMap. Synthesize a clean hierarchical text tree or bullet-based map reflecting the mental structure and connections between the concepts.`;
        } else if (cap.id === 'table') {
          mentionInjections += `\n- CAPABILITY: @Table. Present the comparison, factors, or parameters clearly inside a clean, formatted Markdown table with headers.`;
        } else if (cap.id === 'explain') {
          mentionInjections += `\n- CAPABILITY: @Explain. Focus on providing the most intuitive, conceptually clear explanation of the topic with zero unnecessary fluff.`;
        } else if (cap.id === 'step-by-step') {
          mentionInjections += `\n- CAPABILITY: @StepByStep. Force a highly detailed mathematical or logic-based derivation. Number every step explicitly.`;
        } else if (cap.id === 'quiz') {
          mentionInjections += `\n- CAPABILITY: @Quiz. Create 3 highly diagnostic, conceptual multiple-choice questions matching this topic, with correct answers and misconceptions highlighted at the end.`;
        } else if (cap.id === 'flashcards') {
          mentionInjections += `\n- CAPABILITY: @Flashcards. Create a set of 5 Q&A style flashcards. Format them clearly (e.g. Card 1 - Front: ..., Back: ...).`;
        } else if (cap.id === 'summarize') {
          mentionInjections += `\n- CAPABILITY: @Summarize. Provide a high-yield, extremely concise executive summary of the requested material.`;
        } else if (cap.id === 'study-plan') {
          mentionInjections += `\n- CAPABILITY: @StudyPlan. Create an organized day-by-day or week-by-day learning roadmap to master this specific topic.`;
        } else if (cap.id === 'solve') {
          mentionInjections += `\n- CAPABILITY: @Solve. Act as a diagnostic solver. Focus heavily on identifying what is given, what formula applies, solving the equation step-by-step, and confirming units.`;
        } else if (cap.id === 'exam') {
          mentionInjections += `\n- CAPABILITY: @Exam. Synthesize standard exam-style questions for this level, and show the exact criteria a student needs to write to get full marks.`;
        } else if (cap.id === 'code') {
          mentionInjections += `\n- CAPABILITY: @Code. Act as a software engineer. Provide extremely clean, commented, and efficient code snippets. Explain the complexity and line-by-line logic.`;
        }
      }
    }

    if (activeContexts.length > 0) {
      mentionInjections += `\n\n[REFERENCED CONTEXTS]`;
      for (const ctx of activeContexts) {
        if (ctx.id === 'current-chat') {
          mentionInjections += `\n- CONTEXT: @CurrentChat. Ground your response deeply on the preceding conversation thread. Maintain conversational continuity and reference previous milestones.`;
        } else if (ctx.id === 'this-message') {
          mentionInjections += `\n- CONTEXT: @ThisMessage. Pay extreme attention to the immediate requirements outlined in the user's latest query text.`;
        } else if (ctx.id === 'last-answer') {
          mentionInjections += `\n- CONTEXT: @LastAnswer. Meticulously analyze the last response from the assistant. Refine, correct, or expand upon it as requested.`;
        } else if (ctx.id === 'file') {
          mentionInjections += `\n- CONTEXT: @File. Prioritize extracting and analyzing definitions, chapters, and data from the attached PDF/text documents.`;
        } else if (ctx.id === 'image') {
          mentionInjections += `\n- CONTEXT: @Image. Analyze the visual, graph, geometric, or handwriting details from the attached image meticulousy.`;
        }
      }
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

    // Format current turn with contextual pedagogical scaffolding, personalization & @Mention injections
    const fullUserPrompt = buildTutorPrompt({
      mode,
      level,
      subject,
      language,
      userMessage: trimmedMsg + mentionInjections,
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
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
