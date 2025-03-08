export * from '@edge-prompt/common/types/index.js';

// Any frontend-specific types would go here

export interface Project {
  id: string;
  name: string;
  description: string;
  modelName: string;
  promptTemplateId: string;
  configuration: string | ProjectConfiguration;
  createdAt: string;
}

export interface ProjectConfiguration {
  language: string;
  gradeLevel: string;
  subject: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  type: 'question_generation' | 'validation' | 'objective_extraction';
  content: string;
  description: string;
  createdAt: string;
}

export interface Template {
  pattern: string;
  constraints: string[];
}

export interface ValidationRule {
  criteria: string;
  parameters: {
    threshold: number;
    boundaries: {
      min: number;
      max: number;
    };
  };
}

export interface Material {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  content: string;
  focusArea: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  status: string;
  metadata?: any;
  createdAt: string;
} 