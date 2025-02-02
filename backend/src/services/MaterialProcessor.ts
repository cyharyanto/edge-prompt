import { MaterialSource, ContentTemplate, Template } from '../types/index.js';
import { LMStudioService } from './LMStudioService.js';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import { default as pdfjsLib } from 'pdfjs-dist/legacy/build/pdf.js';
import { DatabaseService } from './DatabaseService.js';
import { StorageService } from './StorageService.js';
import { Material, MaterialStatus } from '../types/index.js';
import { stat } from 'fs/promises';
import { extname } from 'path';

export class MaterialProcessor {
  private lmStudio: LMStudioService;
  private db: DatabaseService;
  private storage: StorageService;
  private MAX_TOKENS = 16000; // Conservative limit for context

  constructor(
    lmStudio: LMStudioService,
    db?: DatabaseService,
    storage?: StorageService
  ) {
    this.lmStudio = lmStudio;
    this.db = db || new DatabaseService();
    this.storage = storage || new StorageService();
  }

  async processMaterial(
    source: MaterialSource,
    projectId: string
  ): Promise<Material> {
    let materialId: string | undefined;
    
    try {
      // Create material record in pending state
      materialId = await this.db.createMaterial({
        projectId,
        title: source.metadata.title || 'Untitled Material',
        content: '',  // Will be updated after processing
        focusArea: source.metadata.focusArea || '',
        metadata: source.metadata
      });

      // Update status to processing
      await this.db.updateMaterialStatus(materialId, 'processing');

      // Handle file-based sources
      let filePath: string | undefined;
      let fileSize: number | undefined;
      let fileType: string | undefined;

      if (typeof source.content === 'string' && source.content.startsWith('/')) {
        // Content is a file path
        const stats = await stat(source.content);
        fileSize = stats.size;
        fileType = extname(source.content);

        // Validate file
        if (!this.storage.validateFileSize(fileSize)) {
          throw new Error('File size exceeds limit');
        }
        if (!this.storage.validateFileType(source.content)) {
          throw new Error('File type not supported');
        }

        // Save original file
        filePath = await this.storage.saveMaterialFile(
          source.content,
          projectId,
          materialId
        );
      }

      // Extract content
      const content = await this.extractContent({
        ...source,
        content: filePath || source.content
      });

      // Update material with content and file info
      await this.db.updateMaterialFile(
        materialId,
        content,
        filePath || null,
        fileType || null,
        fileSize || null,
        'completed'
      );

      return await this.db.getMaterial(materialId);
    } catch (error) {
      // Update status to error if material was created
      if (materialId) {
        await this.db.updateMaterialStatus(materialId, 'error');
      }
      throw error;
    }
  }

  async extractContent(source: MaterialSource): Promise<string> {
    try {
      // Normalize file extension
      const type = source.type.toLowerCase().replace('.', '');
      
      switch (type) {
        case 'txt':
        case 'text':
          // If content is a file path, read the file
          if (typeof source.content === 'string' && source.content.startsWith('/')) {
            return await fs.readFile(source.content, 'utf8');
          }
          return source.content as string;
        case 'pdf':
          return await this.processPDF(source.content as string);
        case 'doc':
        case 'docx':
          return await this.processWord(source.content as string);
        case 'md':
        case 'markdown':
          return await this.processMarkdown(source.content as string);
        case 'url':
          return await this.fetchURL(source.content as string);
        default:
          throw new Error(`Unsupported material type: ${type}`);
      }
    } catch (error) {
      console.error('Content extraction error:', error);
      throw error; // Preserve original error
    }
  }

  async processPDF(filePath: string): Promise<string> {
    try {
      if (!filePath) {
        throw new Error('No file path provided');
      }

      const fileBuffer = await fs.readFile(filePath);
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('Empty or invalid file');
      }

      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Create loading task - pass Uint8Array directly
      const loadingTask = pdfjsLib.getDocument(uint8Array);

      // Get the PDF document
      const pdf = await loadingTask.promise;
      let text = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items
          .map((item: any) => item.str)
          .join(' ') + '\n';
      }
      
      if (!text.trim()) {
        throw new Error('No text content extracted from PDF');
      }
      
      return text;
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  async processWord(filePath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    } catch (error) {
      console.error('Word processing error:', error);
      throw new Error('Failed to process Word file');
    }
  }

  async processMarkdown(content: string): Promise<string> {
    return content;
  }

  async fetchURL(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
  }

  private truncateContent(content: string): string {
    // Rough estimation: 1 token ≈ 4 characters
    const maxChars = this.MAX_TOKENS * 4;
    if (content.length > maxChars) {
      // Take first third and last third of allowed content to maintain context
      const thirdLength = Math.floor(maxChars / 3);
      const firstPart = content.slice(0, thirdLength);
      const lastPart = content.slice(-thirdLength);
      return `${firstPart}\n...[content truncated]...\n${lastPart}`;
    }
    return content;
  }

  async extractLearningObjectives(content: string, focusArea: string, useSourceLanguage: boolean = false): Promise<string[]> {
    const truncatedContent = this.truncateContent(content);
    
    const prompt = `
Based on the following content and focus area, identify key learning objectives.
${useSourceLanguage ? 'Respond in the same language as the content.' : 'Respond in English.'}
Return ONLY a JSON array of learning objectives.

Content:
${truncatedContent}

Focus Area:
${focusArea}

Return format: ["objective1", "objective2", ...]
`;

    try {
      const response = await this.lmStudio.complete(prompt);
      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found in response');
      }

      const objectives = JSON.parse(response.slice(jsonStart, jsonEnd));
      return objectives;
    } catch (error) {
      console.error('Failed to extract objectives:', error);
      return [];
    }
  }

  async suggestQuestionTemplates(
    content: string, 
    objectives: string[],
    focusArea: string,
    useSourceLanguage: boolean = false
  ): Promise<ContentTemplate[]> {
    const truncatedContent = this.truncateContent(content);
    
    const prompt = `
Based on the following content, learning objectives, and focus area, suggest question templates.
${useSourceLanguage ? 'Respond in the same language as the content.' : 'Respond in English.'}
Return ONLY a JSON array of question templates.

Content:
${truncatedContent}

Learning Objectives:
${objectives.join('\n')}

Focus Area:
${focusArea}

Return in this format:
[{
  "pattern": "Question pattern with {placeholders}",
  "constraints": ["constraint1", "constraint2"],
  "targetGrade": "grade level",
  "subject": "subject area",
  "learningObjectives": ["specific objective1", "specific objective2"]
}]
`;

    try {
      const response = await this.lmStudio.complete(prompt);
      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found in response');
      }

      const templates = JSON.parse(response.slice(jsonStart, jsonEnd));
      return templates;
    } catch (error) {
      console.error('Failed to suggest templates:', error);
      return [];
    }
  }

  async generateQuestion(template: Template, context: string, useSourceLanguage: boolean = false): Promise<string> {
    const truncatedContext = this.truncateContent(context);
    
    const prompt = `
You are an educational content generator. Generate a question based on this template and context.
${useSourceLanguage ? 'Generate the question in the same language as the context.' : 'Generate the question in English.'}

TEMPLATE:
${template.pattern}

CONSTRAINTS:
${template.constraints.join('\n')}

CONTEXT:
${truncatedContext}

IMPORTANT: Generate a single question that follows the template and constraints, and is relevant to the context.
Return ONLY the question text, with no additional formatting or explanation.
`;

    const response = await this.lmStudio.complete(prompt);
    return response.replace(/^["']|["']$/g, '').trim();
  }
} 