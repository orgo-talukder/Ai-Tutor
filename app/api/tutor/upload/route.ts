import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/ai/gemini';
import { getAttachmentType } from '@/lib/constants/attachments';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'জেমিনি এপিআই কী সেট করা নেই। দয়া করে Settings > Secrets এ কী যুক্ত করুন।' },
        { status: 400 }
      );
    }

    const type = getAttachmentType(file);
    if (!type) {
      return NextResponse.json({ error: `Unsupported file type for ${file.name}` }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';

    // Upload to Gemini Files API directly using standard parsed File object to prevent Blob class mismatch
    const uploadResult = await ai.files.upload({
      file: file,
      config: {
        mimeType: mimeType,
        displayName: file.name,
      },
    });

    if (!uploadResult || !uploadResult.uri || !uploadResult.name) {
      throw new Error('Gemini Files API did not return a valid file URI');
    }

    // If it's a video or large audio, wait briefly if state is PROCESSING
    let currentFile = uploadResult;
    let attempts = 0;
    while (currentFile.state === 'PROCESSING' && attempts < 10) {
      await new Promise((res) => setTimeout(res, 1500));
      currentFile = await ai.files.get({ name: uploadResult.name! });
      attempts++;
    }

    if (currentFile.state === 'FAILED') {
      return NextResponse.json({ error: 'File processing failed on Gemini server.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      fileUri: currentFile.uri,
      fileName: currentFile.name,
      displayName: currentFile.displayName || file.name,
      mimeType: currentFile.mimeType || mimeType,
      type,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: `File upload failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
