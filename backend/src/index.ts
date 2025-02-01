import express from 'express';
import cors from 'cors';
import { ValidationService } from './services/ValidationService.js';
import { LMStudioService } from './services/LMStudioService.js';
import { MaterialProcessor } from './services/MaterialProcessor.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import { MaterialSource } from './types/index.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = join(dirname(__dirname), 'uploads');
mkdirSync(uploadsDir, { recursive: true });

const lmStudio = new LMStudioService();
const validator = new ValidationService(lmStudio);
const materialProcessor = new MaterialProcessor(lmStudio);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.post('/api/validate', async (req, res): Promise<void> => {
  try {
    const { question, answer, rubric } = req.body;
    
    if (!question || !answer || !rubric) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          question: !question,
          answer: !answer,
          rubric: !rubric
        }
      });
      return;
    }

    const result = await validator.validateResponse(question, answer, rubric);
    res.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/generate', async (req, res): Promise<void> => {
  try {
    const { template, rules, context } = req.body;
    
    if (!template || !rules || !context) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          template: !template,
          rules: !rules,
          context: !context
        }
      });
      return;
    }

    // Generate question using the template and context
    const question = await materialProcessor.generateQuestion(
      template, 
      context,
      req.body.useSourceLanguage
    );
    
    res.json({ 
      question,
      template,
      rules
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/health', async (_req, res): Promise<void> => {
  try {
    const isLMStudioAvailable = await lmStudio.isAvailable();
    res.json({ 
      status: 'ok',
      lmStudio: isLMStudioAvailable 
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/materials/process', async (req, res): Promise<void> => {
  const { material } = req.body;
  
  try {
    const content = await materialProcessor.extractContent(material);
    const objectives = await materialProcessor.extractLearningObjectives(content, material.metadata.focusArea);
    const templates = await materialProcessor.suggestQuestionTemplates(content, objectives, material.metadata.focusArea);
    
    res.json({
      objectives,
      templates,
      wordCount: content.split(/\s+/).length,
      status: 'success'
    });
  } catch (error) {
    console.error('Material processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process material',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add file upload endpoint
app.post('/api/materials/upload', upload.single('file'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Get file extension without the dot
    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
    
    if (!['txt', 'pdf', 'doc', 'docx', 'md'].includes(fileType)) {
      res.status(400).json({ 
        error: 'Unsupported file type', 
        details: `File type ${fileType} is not supported. Supported types: txt, pdf, doc, docx, md` 
      });
      return;
    }

    const metadata = JSON.parse(req.body.metadata || '{}');
    const material: MaterialSource = {
      type: fileType,
      content: req.file.path,
      metadata
    };

    // Process file only once
    const content = await materialProcessor.extractContent(material);
    
    // Clean up the uploaded file after processing
    await fs.unlink(req.file.path).catch(err => {
      console.warn('Failed to delete uploaded file:', err);
    });

    // Get objectives and templates using focusArea
    const objectives = await materialProcessor.extractLearningObjectives(
      content, 
      metadata.focusArea,
      metadata.useSourceLanguage
    );
    const templates = await materialProcessor.suggestQuestionTemplates(
      content, 
      objectives, 
      metadata.focusArea,
      metadata.useSourceLanguage
    );
    
    res.json({
      content,
      objectives,
      templates,
      wordCount: content.split(/\s+/).length,
      status: 'success'
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    console.error('Material upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process uploaded material',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 