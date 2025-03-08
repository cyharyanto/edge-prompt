export * from '@edge-prompt/common/types/index.js';

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

export interface EvaluationState {
  questionId: string;
  studentId: string;
  response: string;
  validationStages: ValidationResult[];
  finalScore?: number;
  status: 'pending' | 'completed' | 'review';
}

export interface MaterialSource {
  id?: string;
  type: string;
  content: string;
  metadata: {
    title?: string;
    subject?: string;
    grade?: string;
    chapter?: string;
    focusArea: string;
    useSourceLanguage?: boolean;
    learningObjectives?: string[];
    templates?: ContentTemplate[];
    [key: string]: any;
  };
}

export interface ContentTemplate {
  pattern: string;
  constraints: string[];
  source: MaterialSource;
  targetGrade: string;
  subject: string;
  learningObjectives: string[];
}

export interface AnswerSpace {
  type: 'essay' | 'short-answer' | 'explanation';
  minLength?: number;
  maxLength?: number;
  requiredConcepts?: string[];
  prohibitedContent?: string[];
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

export type MaterialStatus = 'pending' | 'processing' | 'completed' | 'error';

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
  status: MaterialStatus;
  metadata?: any;
  createdAt: string;
} 