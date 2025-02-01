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