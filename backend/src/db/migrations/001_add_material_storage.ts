import { DatabaseService } from '../../services/DatabaseService.js';
import { StorageService } from '../../services/StorageService.js';

export async function up() {
  const db = new DatabaseService();
  const storage = new StorageService();

  // Initialize storage
  await storage.initialize();

  // Add new columns
  await db.exec(`
    ALTER TABLE materials ADD COLUMN file_path TEXT;
    ALTER TABLE materials ADD COLUMN file_type TEXT;
    ALTER TABLE materials ADD COLUMN file_size INTEGER;
    ALTER TABLE materials ADD COLUMN processed_path TEXT;
    ALTER TABLE materials ADD COLUMN status TEXT DEFAULT 'pending' 
      CHECK (status IN ('pending', 'processing', 'completed', 'error'));

    CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
  `);
}

export async function down() {
  const db = new DatabaseService();

  // Remove new columns
  await db.exec(`
    DROP INDEX IF EXISTS idx_materials_status;
    ALTER TABLE materials DROP COLUMN file_path;
    ALTER TABLE materials DROP COLUMN file_type;
    ALTER TABLE materials DROP COLUMN file_size;
    ALTER TABLE materials DROP COLUMN processed_path;
    ALTER TABLE materials DROP COLUMN status;
  `);
} 