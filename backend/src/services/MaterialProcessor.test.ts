import { MaterialProcessor } from './MaterialProcessor.js';
import { DatabaseService } from './DatabaseService.js';
import { StorageService } from './StorageService.js';
import { LMStudioService } from './LMStudioService.js';
import { expect } from 'chai';
import { join } from 'path';
import { writeFile, mkdir, rm, readFile } from 'fs/promises';

describe('MaterialProcessor', () => {
  let processor: MaterialProcessor;
  let db: DatabaseService;
  let storage: StorageService;
  let lmStudio: LMStudioService;
  let projectId: string;
  let testRoot: string;

  beforeEach(async () => {
    testRoot = join(__dirname, '../../test-uploads');
    
    // Initialize services
    db = new DatabaseService();
    storage = new StorageService({ rootDir: testRoot });
    lmStudio = new LMStudioService();
    processor = new MaterialProcessor(lmStudio, db, storage);

    // Initialize storage
    await storage.initialize();

    // Create test project
    projectId = await db.createProject({
      name: 'Test Project',
      description: 'Test project for materials',
      modelName: 'test-model',
      promptTemplateId: 'test-template',
      configuration: { language: 'en', gradeLevel: '5', subject: 'test' }
    });
  });

  afterEach(async () => {
    await rm(testRoot, { recursive: true, force: true });
  });

  describe('material processing', () => {
    it('should process text content', async () => {
      const material = await processor.processMaterial({
        type: 'text',
        content: 'Test content',
        metadata: {
          title: 'Test Material',
          focusArea: 'Testing'
        }
      }, projectId);

      expect(material.title).to.equal('Test Material');
      expect(material.content).to.equal('Test content');
      expect(material.status).to.equal('completed');
    });

    it('should process file content', async () => {
      // Create test file
      const tempDir = join(testRoot, 'temp');
      await mkdir(tempDir, { recursive: true });
      const testFile = join(tempDir, 'test.txt');
      await writeFile(testFile, 'File content');

      const material = await processor.processMaterial({
        type: 'txt',
        content: testFile,
        metadata: {
          title: 'File Material',
          focusArea: 'Testing'
        }
      }, projectId);

      // Check material properties
      expect(material.title).to.equal('File Material');
      expect(material.content).to.equal('File content');
      expect(material.status).to.equal('completed');
      expect(material.filePath).to.be.a('string');
      expect(material.fileType).to.equal('.txt');

      // Verify original file exists and has correct content
      const originalContent = await readFile(material.filePath!, 'utf8');
      expect(originalContent).to.equal('File content');
    });

    it('should handle processing errors', async () => {
      try {
        await processor.processMaterial({
          type: 'invalid',
          content: 'content',
          metadata: {
            title: 'Invalid Material',
            focusArea: 'Testing'
          }
        }, projectId);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Unsupported material type');
      }
    });
  });
}); 