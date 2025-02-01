import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import { Project, ProjectConfiguration } from '../types/index.js';

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  model_name: string;
  prompt_template_id: string;
  configuration: string;
  created_at: string;
}

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = new Database('research.db');
    this.db.pragma('journal_mode = WAL'); // Better concurrency
    this.db.pragma('foreign_keys = ON');  // Enforce foreign key constraints
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
} 