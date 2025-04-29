import { fileTypeFromFile } from 'file-type';
import { unlink } from 'fs/promises';

const EXT_WHITELIST = new Set(['txt', 'pdf', 'doc', 'docx', 'md']);
const MIME_WHITELIST = new Set([  
    'text/plain',
    'text/markdown',
    'application/pdf',
    'application/msword',
    'application/x-cfb',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

  let mime = detected?.mime ?? (ext === 'md' ? 'text/markdown' : undefined);
  /* ---------- OOXML (docx) special-case -------------------------- */
    if (ext === 'docx' && mime === 'application/zip') {
        // A real docx is a ZIP container – treat it as docx for our whitelist
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // ── Legacy .doc special-case (OLE/CFB) ────────────
    if (ext === 'doc' && mime === 'application/x-cfb') {
        mime = 'application/msword';
    }

  if (!mime) {
    await unlink(filePath);
    throw new Error('Unable to determine file type');
  }

  if (!MIME_WHITELIST.has(mime)) {
    await unlink(filePath);
    throw new Error(`Detected MIME "${mime}" is not allowed`);
  }

  /* ---------- 3) success  ------------------------------ */
  console.info(
    `[UPLOAD] user:${userId ?? 'anon'} → ${originalName} accepted as ${mime}`
  );
  return mime;
}
