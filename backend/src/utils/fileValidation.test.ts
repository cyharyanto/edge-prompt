import { expect } from 'chai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { validateUploadedFile } from './fileValidation.js';

describe('fileValidation', () => {
  const tmp = join(__dirname, '__tmp');

  it('accepts a valid PDF', async () => {
    const p = `${tmp}.pdf`;
    /* a  minimal PDF header is enough for file-type to spot */
    await writeFile(p, Buffer.from('%PDF-1.4\n%âãÏÓ\n'));
    const mime = await validateUploadedFile(p, 'sample.pdf');
    expect(mime).to.equal('application/pdf');
    await unlink(p);
  });

  it('rejects disguised executable', async () => {
    const p = `${tmp}.txt`;
    await writeFile(p, Buffer.from('\x7fELF binary header'));
    try {
      await validateUploadedFile(p, 'evil.txt');
      throw new Error('should have failed');
    } catch (e:any) {
      expect(e.message).to.match(/not allowed|Unable/);
    } finally {
      await unlink(p).catch(() => {});
    }
  });
});
