import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import { Project, ProjectConfiguration } from '../types/index.js';
import { StorageService } from './StorageService.js';
import { Material, MaterialStatus } from '../types/index.js';
import { rm } from 'fs/promises';

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  model_name: string;
  prompt_template_id: string;
  configuration: string;
  created_at: string;
}

interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export class DatabaseService {
  private db: Database.Database;
  private storage: StorageService;

  constructor() {
    this.db = new Database('research.db');
    this.db.pragma('journal_mode = WAL'); // Better concurrency
    this.db.pragma('foreign_keys = ON');  // Enforce foreign key constraints
    this.storage = new StorageService();
  }

  // Add method to get a prepared statement
  private prepareStatement(sql: string): Database.Statement {
    return this.db.prepare(sql);
  }

  // Update material with file info
  async updateMaterialFile(
    materialId: string,
    content: string,
    filePath: string | null,
    fileType: string | null,
    fileSize: number | null,
    status: MaterialStatus
  ): Promise<void> {
    const stmt = this.prepareStatement(`
      UPDATE materials 
      SET content = ?, file_path = ?, file_type = ?, file_size = ?, status = ?
      WHERE id = ?
    `);

    stmt.run(
      content,
      filePath,
      fileType,
      fileSize,
      status,
      materialId
    );
  }

  // Add transaction support
  transaction<T>(fn: () => T): T {
    try {
      this.db.prepare('BEGIN').run();
      const result = fn();
      this.db.prepare('COMMIT').run();
      return result;
    } catch (error) {
      this.db.prepare('ROLLBACK').run();
      throw error;
    }
  }

  exec(sql: string) {
    return this.db.exec(sql);
  }

  // Project methods
  getProjects(): Project[] {
    const stmt = this.db.prepare('SELECT * FROM projects ORDER BY created_at DESC');
    const projects = stmt.all() as ProjectRow[];
    
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description || '',
      modelName: project.model_name,
      promptTemplateId: project.prompt_template_id,
      configuration: JSON.parse(project.configuration) as ProjectConfiguration,
      createdAt: project.created_at
    }));
  }

  getProject(id: string): Project {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = stmt.get(id) as ProjectRow | undefined;
    
    if (!project) {
      throw new Error(`Project not found: ${id}`);
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      modelName: project.model_name,
      promptTemplateId: project.prompt_template_id,
      configuration: JSON.parse(project.configuration) as ProjectConfiguration,
      createdAt: project.created_at
    };
  }

  async createProject(params: {
    name: string;
    description?: string;
    modelName: string;
    promptTemplateId: string;
    configuration: any;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO projects (id, name, description, model_name, prompt_template_id, configuration)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const id = uuid();
    stmt.run(
      id,
      params.name,
      params.description || null,
      params.modelName,
      params.promptTemplateId,
      JSON.stringify(params.configuration)
    );
    return id;
  }

  async updateProject(id: string, params: {
    name: string;
    description?: string;
    modelName: string;
    promptTemplateId: string;
    configuration: any;
  }) {
    const stmt = this.db.prepare(`
      UPDATE projects 
      SET name = ?, description = ?, model_name = ?, 
          prompt_template_id = ?, configuration = ?
      WHERE id = ?
    `);

    stmt.run(
      params.name,
      params.description || null,
      params.modelName,
      params.promptTemplateId,
      JSON.stringify(params.configuration),
      id
    );
  }

  async deleteProject(id: string) {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
  }

  // Prompt template methods
  async getPromptTemplates() {
    return this.db.prepare('SELECT * FROM prompt_templates ORDER BY name, version').all();
  }

  async getPromptTemplate(id: string) {
    return this.db.prepare('SELECT * FROM prompt_templates WHERE id = ?').get(id);
  }

  async createPromptTemplate(params: {
    name: string;
    version: string;
    type: string;
    content: string;
    description?: string;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO prompt_templates (id, name, version, type, content, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const id = uuid();
    stmt.run(
      id,
      params.name,
      params.version,
      params.type,
      params.content,
      params.description || null
    );
    return id;
  }

  // Material management methods
  async createMaterial(params: {
    projectId: string;
    title: string;
    content: string;
    focusArea: string;
    filePath?: string;
    fileType?: string;
    fileSize?: number;
    metadata?: any;
  }): Promise<string> {
    const stmt = this.db.prepare(`
      INSERT INTO materials (
        id, project_id, title, content, focus_area, 
        file_path, file_type, file_size, metadata, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = uuid();
    stmt.run(
      id,
      params.projectId,
      params.title,
      params.content,
      params.focusArea,
      params.filePath || null,
      params.fileType || null,
      params.fileSize || null,
      params.metadata ? JSON.stringify(params.metadata) : null,
      'pending' as MaterialStatus
    );

    return id;
  }

  async getMaterial(id: string): Promise<Material> {
    const stmt = this.db.prepare(`
      SELECT m.*, p.name as project_name 
      FROM materials m
      JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `);
    
    const material = stmt.get(id) as any;
    if (!material) {
      throw new Error(`Material not found: ${id}`);
    }

    return {
      id: material.id,
      projectId: material.project_id,
      projectName: material.project_name,
      title: material.title,
      content: material.content,
      focusArea: material.focus_area,
      filePath: material.file_path,
      fileType: material.file_type,
      fileSize: material.file_size,
      status: material.status as MaterialStatus,
      metadata: material.metadata ? JSON.parse(material.metadata) : null,
      createdAt: material.created_at
    };
  }

  async getProjectMaterials(projectId: string): Promise<Material[]> {
    const stmt = this.db.prepare(`
      SELECT m.*, p.name as project_name 
      FROM materials m
      JOIN projects p ON m.project_id = p.id
      WHERE m.project_id = ?
      ORDER BY m.created_at DESC
    `);
    
    const materials = stmt.all(projectId) as any[];
    return materials.map(material => ({
      id: material.id,
      projectId: material.project_id,
      projectName: material.project_name,
      title: material.title,
      content: material.content,
      focusArea: material.focus_area,
      filePath: material.file_path,
      fileType: material.file_type,
      fileSize: material.file_size,
      status: material.status as MaterialStatus,
      metadata: material.metadata ? JSON.parse(material.metadata) : null,
      createdAt: material.created_at
    }));
  }

  async updateMaterialStatus(id: string, status: MaterialStatus): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE materials 
      SET status = ?
      WHERE id = ?
    `);

    stmt.run(status, id);
  }

  async deleteMaterial(id: string): Promise<void> {
    const material = await this.getMaterial(id);
    
    // Delete original file if it exists
    if (material.filePath) {
      await rm(material.filePath, { force: true });
    }

    const stmt = this.db.prepare('DELETE FROM materials WHERE id = ?');
    stmt.run(id);
  }

  getTableInfo(tableName: string): ColumnInfo[] {
    const stmt = this.db.prepare(`PRAGMA table_info(${tableName})`);
    return stmt.all() as ColumnInfo[];
  }
} 