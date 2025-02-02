import { DatabaseService } from '../services/DatabaseService.js';
import { StorageService } from '../services/StorageService.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  console.log('Starting database migration...');
  
  try {
    const db = new DatabaseService();
    const storage = new StorageService();
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    
    // Initialize storage
    await storage.initialize();

    // Run migrations in a transaction
    await db.transaction(async () => {
      // Create tables if they don't exist
      await db.exec(schema);
      console.log('Schema initialized');

      // Add default prompt template if none exists
      const templates = await db.getPromptTemplates();
      if (templates.length === 0) {
        await db.createPromptTemplate({
          name: 'Basic Question Generator',
          version: '1.0',
          type: 'question_generation',
          content: `Given the following context and focus area, generate a question that:
1. Tests understanding of the key concepts
2. Encourages critical thinking
3. Is relevant to the focus area

Context: {context}
Focus Area: {focusArea}

Generate a single question that meets these criteria.`,
          description: 'Default template for generating basic comprehension questions'
        });
        console.log('Created default prompt template');
      }
    });
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 