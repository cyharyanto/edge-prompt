import { DatabaseService, User } from './DatabaseService.js';
import { StorageService } from './StorageService.js';
import { expect } from 'chai';
import { join } from 'path';
import { writeFile, rm } from 'fs/promises';
import { v4 as uuid } from 'uuid';


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

describe('DatabaseService - User Management', () => {
  let db: DatabaseService;

  beforeEach(() => {
    db = new DatabaseService();
  });

  it('should create a user', async () => {
    const userId = uuid();
    const userData : User = {
      id: userId,
      firstname: 'user',
      lastname: 'test',
      email: 'test@example.com',
      passwordhash: 'hashed_password', // In real scenarios, this would be a bcrypt hash
      dob: '2000-01-01',
    };

    await db.registerUser(userData);    
    const retrievedUser = await db.getUserByEmail('test@example.com');

    
    expect(retrievedUser).to.not.be.null;
    expect(retrievedUser?.firstname).to.equal('user');
    expect(retrievedUser?.lastname).to.equal('test');
    expect(retrievedUser?.email).to.equal('test@example.com');
    expect(retrievedUser?.passwordhash).to.equal('hashed_password');
    expect(retrievedUser?.dob).to.equal('2000-01-01');
    expect(retrievedUser?.created_at).to.not.be.null;

    await db.deleteUserByEmail('test@example.com'); // Clean up after test
  });

  it('should get a user by email', async () => {
    const userId = uuid();
    const userData : User = {
      id: userId,
      firstname: 'user',
      lastname: 'test',
      email: 'test@example.com',
      passwordhash: 'hashed_password', // In real scenarios, this would be a bcrypt hash
      dob: '2000-01-01',
    };

    await db.registerUser(userData);
    const retrievedUser = await db.getUserByEmail('test@example.com');

    expect(retrievedUser).to.not.be.null;
    expect(retrievedUser?.firstname).to.equal('user');
    expect(retrievedUser?.lastname).to.equal('test');
    expect(retrievedUser?.email).to.equal('test@example.com');
    expect(retrievedUser?.passwordhash).to.equal('hashed_password');
    expect(retrievedUser?.dob).to.equal('2000-01-01');
    expect(retrievedUser?.createdAt).to.not.be.null;

    await db.deleteUserByEmail('test@example.com'); // Clean up after test  
  });

  it('should return null if user not found', async () => {
    const user = await db.getUserByEmail('nonexistent@example.com');
    expect(user).to.be.null;
  });

  it('should handle duplicate email', async () => {
    const userId1 = uuid();
    const userData1 : User = {
      id: userId1,
      firstname: 'user',
      lastname: 'test',
      email: 'test@example.com',
      passwordhash: 'hashed_password', // In real scenarios, this would be a bcrypt hash
      dob: '2000-01-01',
    };
    await db.registerUser(userData1);

    const userId2 = uuid();
    const userData2 : User = {
      id: userId2,
      firstname: 'user',
      lastname: 'test',
      email: 'test@example.com',
      passwordhash: 'hashed_password', // In real scenarios, this would be a bcrypt hash
      dob: '2000-01-01',
    };

    try {
        await db.registerUser(userData2);
        expect.fail('Expected createUser to throw an error');
    } catch (error: any) {
        expect(error.message).to.include('UNIQUE constraint failed'); // Adjust this to match your DB error message
    }

    await db.deleteUserByEmail('test@example.com'); // Clean up after test  
  });
});