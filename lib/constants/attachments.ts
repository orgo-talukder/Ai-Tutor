import { AttachmentType } from '@/lib/types';

// Configurable file size limits (in bytes)
export const MAX_FILES_PER_MESSAGE = 5;

export const MAX_DOCUMENT_SIZE = 30 * 1024 * 1024; // 30 MB
export const MAX_IMAGE_SIZE = 15 * 1024 * 1024;    // 15 MB
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024;    // 25 MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;    // 50 MB

export const SUPPORTED_DOCUMENTS = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/xml',
  'text/html',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',         // xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
];

export const SUPPORTED_IMAGES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
];

export const SUPPORTED_AUDIO = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/x-m4a',
  'audio/m4a',
  'audio/webm',
];

export const SUPPORTED_VIDEO = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime', // mov
  'video/webm',
  'video/x-msvideo', // avi
  'video/3gpp',
];

export function getAttachmentType(file: File): AttachmentType | null {
  const mime = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (SUPPORTED_DOCUMENTS.includes(mime) || ['pdf', 'txt', 'md', 'csv', 'json', 'xml', 'html', 'docx', 'xlsx', 'pptx'].includes(ext)) {
    return 'document';
  }
  if (SUPPORTED_IMAGES.includes(mime) || ['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'gif'].includes(ext)) {
    return 'image';
  }
  if (SUPPORTED_AUDIO.includes(mime) || ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'webm'].includes(ext)) {
    return 'audio';
  }
  if (SUPPORTED_VIDEO.includes(mime) || ['mp4', 'mov', 'webm', 'avi', 'mpeg', '3gp'].includes(ext)) {
    return 'video';
  }
  return null;
}

export function validateFile(file: File, isBn = false): { valid: boolean; error?: string; type?: AttachmentType } {
  const type = getAttachmentType(file);
  if (!type) {
    return {
      valid: false,
      error: isBn 
        ? `"${file.name}" ফাইল ফরম্যাটটি সমর্থিত নয়। PDF, ইমেজ, অডিও বা ভিডিও নির্বাচন করুন।` 
        : `File format "${file.name}" is not supported. Please choose PDF, Image, Audio, or Video.`,
    };
  }

  let limit = MAX_DOCUMENT_SIZE;
  let limitName = '30 MB';

  if (type === 'image') {
    limit = MAX_IMAGE_SIZE;
    limitName = '15 MB';
  } else if (type === 'audio') {
    limit = MAX_AUDIO_SIZE;
    limitName = '25 MB';
  } else if (type === 'video') {
    limit = MAX_VIDEO_SIZE;
    limitName = '50 MB';
  }

  if (file.size > limit) {
    return {
      valid: false,
      error: isBn
        ? `"${file.name}" ফাইলের আকার নির্ধারিত সীমা (${limitName})-এর চেয়ে বড়।`
        : `File "${file.name}" exceeds the maximum size limit (${limitName}).`,
    };
  }

  return { valid: true, type };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
