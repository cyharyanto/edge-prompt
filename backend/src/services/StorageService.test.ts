import { StorageService } from './StorageService.js';
import { mkdir, writeFile, readFile, rm, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('StorageService', () => {
  const testRoot = join(__dirname, '../../test-uploads');
  let storage: StorageService;

  beforeEach(async () => {
    // Create fresh storage instance with test config
    storage = new StorageService({
      rootDir: testRoot,
      allowedTypes: ['.txt', '.pdf'],
      maxFileSize: 1024 * 1024 // 1MB
    });
    
    // Initialize storage directories
    await storage.initialize();
  });

  afterEach(async () => {
    // Cleanup test directory after each test
    try {
      await rm(testRoot, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  describe('initialization', () => {
    it('should create required directories', async () => {
      const tempDir = join(testRoot, 'temp');
      const materialsDir = join(testRoot, 'materials');

      // Check if directories exist using stat
      const checkDir = async (dir: string) => {
        try {
          const stats = await stat(dir);
          return stats.isDirectory();
        } catch {
          return false;
        }
      };

      expect(await checkDir(tempDir)).to.be.true;
      expect(await checkDir(materialsDir)).to.be.true;
    });
  });

  describe('material storage', () => {
    const projectId = 'test-project';
    const materialId = 'test-material';

    it('should create material directory structure', async () => {
      const materialDir = await storage.createMaterialStorage(projectId, materialId);
      
      // Check if directory exists using stat
      const checkDir = async (dir: string) => {
        try {
          const stats = await stat(dir);
          return stats.isDirectory();
        } catch {
          return false;
        }
      };

      expect(await checkDir(materialDir)).to.be.true;
    });

    it('should save material file', async () => {
      // Create temp directory first
      await mkdir(join(testRoot, 'temp'), { recursive: true });
      
      // Create temp file
      const tempFile = join(testRoot, 'temp', 'test.txt');
      await writeFile(tempFile, 'test content');

      const savedPath = await storage.saveMaterialFile(tempFile, projectId, materialId);
      
      // Check if file exists and content matches
      const content = await readFile(savedPath, 'utf8');
      expect(content).to.equal('test content');
    });

    it('should reject invalid file types', async () => {
      // Create temp directory first
      await mkdir(join(testRoot, 'temp'), { recursive: true });
      
      const tempFile = join(testRoot, 'temp', 'test.invalid');
      await writeFile(tempFile, 'test content');

      try {
        await storage.saveMaterialFile(tempFile, projectId, materialId);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('not allowed');
      }
    });
  });

  describe('validation', () => {
    it('should validate file size', () => {
      expect(storage.validateFileSize(1024)).to.be.true;
      expect(storage.validateFileSize(2 * 1024 * 1024)).to.be.false;
    });

    it('should validate file type', () => {
      expect(storage.validateFileType('test.txt')).to.be.true;
      expect(storage.validateFileType('test.pdf')).to.be.true;
      expect(storage.validateFileType('test.invalid')).to.be.false;
    });
  });
}); 