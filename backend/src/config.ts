import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

export const storageConfig = {
  rootDir: process.env.STORAGE_ROOT || join(dirname(__dirname), 'uploads'),
  allowedTypes: ['.pdf', '.docx', '.doc', '.txt', '.md'],
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
};

export const dbConfig = {
  path: process.env.DB_PATH || join(dirname(__dirname), 'research.db'),
}; 