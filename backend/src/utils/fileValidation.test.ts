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

  it('accepts a docx', async () => {
    const p = `${tmp}.docx`;
    // OOXML files all start with PKZIP header; a 4-byte stub is enough
    await writeFile(p, Buffer.from('PK\x03\x04'));
    const mime = await validateUploadedFile(p, 'sample.docx');
    expect(mime).to.equal(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    await unlink(p);
    });

    it('accepts a legacy .doc', async () => {
        const p = `${tmp}.doc`;
        /* Minimal Compound File Binary header for .doc: D0 CF 11 E0 ... */
        await writeFile(p, Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]));
        const mime = await validateUploadedFile(p, 'sample.doc');
        expect(mime).to.equal('application/msword');
        await unlink(p);
    });

    it('accepts markdown (.md)', async () => {
        const p = `${tmp}.md`;
        await writeFile(p, Buffer.from('# Hello\n'));
        const mime = await validateUploadedFile(p, 'sample.md');
        expect(mime).to.equal('text/markdown');
        await unlink(p);
    });
});
