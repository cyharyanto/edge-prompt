import { mkdir, rm, cp, writeFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface StorageConfig {
  rootDir: string;
  allowedTypes: string[];
  maxFileSize: number; // in bytes
}

export class StorageService {
  private config: StorageConfig;
  private rootDir: string;
  private tempDir: string;
  private materialsDir: string;

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      rootDir: join(dirname(dirname(__dirname)), 'uploads'),
      allowedTypes: ['.pdf', '.docx', '.doc', '.txt', '.md'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      ...config
    };

    this.rootDir = this.config.rootDir;
    this.tempDir = join(this.rootDir, 'temp');
    this.materialsDir = join(this.rootDir, 'materials');
  }

  getConfig(): StorageConfig {
    return {
      rootDir: this.rootDir
    };
  }

  async initialize(): Promise<void> {
    // Create directory structure
    await mkdir(this.tempDir, { recursive: true });
    await mkdir(this.materialsDir, { recursive: true });
  }

  async createMaterialStorage(projectId: string, materialId: string): Promise<string> {
    const materialDir = join(this.materialsDir, projectId, materialId);
    await mkdir(materialDir, { recursive: true });
    return materialDir;
  }

  async saveMaterialFile(
    tempPath: string, 
    projectId: string, 
    materialId: string
  ): Promise<string> {
    const ext = extname(tempPath);
    if (!this.config.allowedTypes.includes(ext.toLowerCase())) {
      throw new Error(`File type ${ext} not allowed`);
    }

    const materialDir = await this.createMaterialStorage(projectId, materialId);
    const destPath = join(materialDir, `material${ext}`);
    
    await cp(tempPath, destPath);
    await rm(tempPath); // Clean up temp file

    return destPath;
  }

  async cleanupTemp(): Promise<void> {
    try {
      await rm(this.tempDir, { recursive: true });
      await mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to cleanup temp directory:', error);
    }
  }

  validateFileSize(size: number): boolean {
    return size <= this.config.maxFileSize;
  }

  validateFileType(filename: string): boolean {
    const ext = extname(filename).toLowerCase();
    return this.config.allowedTypes.includes(ext);
  }
} 