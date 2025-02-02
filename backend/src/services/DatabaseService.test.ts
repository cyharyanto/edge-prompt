import { DatabaseService } from './DatabaseService.js';
import { StorageService } from './StorageService.js';
import { expect } from 'chai';
import { join } from 'path';
import { writeFile, rm } from 'fs/promises';

describe('DatabaseService - Materials', () => {
  let db: DatabaseService;
  let storage: StorageService;
  let projectId: string;

  beforeEach(async () => {
    db = new DatabaseService();
    storage = new StorageService();
    await storage.initialize();

    // Create a test project
    projectId = await db.createProject({
      name: 'Test Project',
      description: 'Test project for materials',
      modelName: 'test-model',
      promptTemplateId: 'test-template',
      configuration: { language: 'en', gradeLevel: '5', subject: 'test' }
    });
  });

  afterEach(async () => {
    // Clean up test files
    await rm(storage.getConfig().rootDir, { recursive: true, force: true });
  });

  describe('material management', () => {
    it('should create and retrieve material', async () => {
      const materialId = await db.createMaterial({
        projectId,
        title: 'Test Material',
        content: 'Test content',
        focusArea: 'Test focus',
        metadata: { key: 'value' }
      });

      const material = await db.getMaterial(materialId);
      expect(material.title).to.equal('Test Material');
      expect(material.content).to.equal('Test content');
      expect(material.status).to.equal('pending');
      expect(material.metadata).to.deep.equal({ key: 'value' });
    });

    it('should list project materials', async () => {
      // Create multiple materials
      await db.createMaterial({
        projectId,
        title: 'Material 1',
        content: 'Content 1',
        focusArea: 'Focus 1'
      });

      await db.createMaterial({
        projectId,
        title: 'Material 2',
        content: 'Content 2',
        focusArea: 'Focus 2'
      });

      const materials = await db.getProjectMaterials(projectId);
      expect(materials).to.have.length(2);
      const titles = materials.map(m => m.title);
      expect(titles).to.include('Material 1');
      expect(titles).to.include('Material 2');
    });

    it('should update material status', async () => {
      const materialId = await db.createMaterial({
        projectId,
        title: 'Test Material',
        content: 'Test content',
        focusArea: 'Test focus'
      });

      await db.updateMaterialStatus(materialId, 'completed');
      
      const material = await db.getMaterial(materialId);
      expect(material.status).to.equal('completed');
    });

    it('should delete material and its files', async () => {
      // Create a test file
      const testFile = join(storage.getConfig().rootDir, 'test.txt');
      await writeFile(testFile, 'test content');

      const materialId = await db.createMaterial({
        projectId,
        title: 'Test Material',
        content: 'Test content',
        focusArea: 'Test focus',
        filePath: testFile
      });

      await db.deleteMaterial(materialId);

      try {
        await db.getMaterial(materialId);
        expect.fail('Material should have been deleted');
      } catch (error) {
        expect(error.message).to.include('not found');
      }
    });
  });
}); 