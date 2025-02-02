export interface Template {
  pattern: string;
  constraints: string[];
}

export interface ValidationRule {
  criteria: string;
  parameters: ValidationParameters;
}

export interface ValidationParameters {
  threshold: number;
  boundaries: {
    min: number;
    max: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string;
}

export interface MaterialSource {
  type: string;
  content: string;
  metadata: {
    title?: string;
    subject?: string;
    grade?: string;
    chapter?: string;
    [key: string]: any;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  modelName: string;
  promptTemplateId: string;
  configuration: string | ProjectConfiguration;
  createdAt?: string;
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
  description?: string;
  createdAt?: string;
} 