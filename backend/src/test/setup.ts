import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from '../services/DatabaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
config({ path: join(__dirname, '../../.env.test') });

// Root hooks
export const mochaHooks = {
  beforeAll: async function(this: Mocha.Context) {
    this.timeout(10000); // 10 seconds
    const db = new DatabaseService();
    
    // Run migrations
    await db.transaction(async () => {
      // Create tables if they don't exist
      await db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          model_name TEXT NOT NULL,
          prompt_template_id TEXT NOT NULL,
          configuration JSON NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS materials (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          title TEXT,
          content TEXT NOT NULL,
          focus_area TEXT NOT NULL,
          metadata JSON,
          file_path TEXT,
          file_type TEXT,
          file_size INTEGER,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(project_id) REFERENCES projects(id)
        );

        CREATE INDEX IF NOT EXISTS idx_materials_project ON materials(project_id);
        CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
      `);
    });
  },

  afterAll: async function(this: Mocha.Context) {
    this.timeout(5000); // 5 seconds
    const db = new DatabaseService();
    await db.transaction(async () => {
      // Only delete test data
      await db.exec(`DELETE FROM materials WHERE project_id IN (SELECT id FROM projects WHERE name = 'Test Project')`);
      await db.exec(`DELETE FROM projects WHERE name = 'Test Project'`);
    });
  }
}; 