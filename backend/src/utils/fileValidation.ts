import { fileTypeFromFile } from 'file-type';
import { unlink } from 'fs/promises';

const EXT_WHITELIST = new Set(['txt', 'pdf']);        // FR-4
const MIME_WHITELIST = new Set([                      // FR-2
  'text/plain',
  'application/pdf'
]);

/**
 * Validates an uploaded file **by content**, not just extension.
 * @throws Error on any violation (caller should catch & respond)
 * @returns detected MIME type if successful
 */
export async function validateUploadedFile(
  filePath: string,
  originalName: string,
  userId?: string | null          // for logging
): Promise<string> {

  /* ---------- 1) quick extension check (FR-4) ---------- */
  const ext = originalName.split('.').pop()?.toLowerCase() ?? '';
  if (!EXT_WHITELIST.has(ext)) {
    await unlink(filePath);
    throw new Error(`File extension ".${ext}" is not allowed`);
  }

  /* ---------- 2) deep-inspect magic bytes (FR-1/2) ----- */
  const detected = await fileTypeFromFile(filePath);

  if (!detected) {
    await unlink(filePath);
    throw new Error('Unable to determine file type');
  }
  if (!MIME_WHITELIST.has(detected.mime)) {
    await unlink(filePath);
    throw new Error(`Detected MIME "${detected.mime}" is not allowed`);
  }

  /* ---------- 3) success  ------------------------------ */
  console.info(
    `[UPLOAD] user:${userId ?? 'anon'} → ${originalName} accepted as ${detected.mime}`
  );
  return detected.mime;
}
