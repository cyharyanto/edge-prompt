import type { ValidationRule, ValidationResult } from '../types/index.js';
import { LMStudioService } from './LMStudioService.js';

export class ValidationService {
  private lmStudio: LMStudioService;

  constructor(lmStudio: LMStudioService) {
    this.lmStudio = lmStudio;
  }

  async validateResponse(
    question: string, 
    answer: string, 
    promptTemplate: any
  ): Promise<ValidationResult> {
    // Use the prompt template to format the validation request
    const promptContent = typeof promptTemplate.content === 'string' 
      ? promptTemplate.content 
      : JSON.stringify(promptTemplate.content);
    
    const prompt = `
You are an educational assessment evaluator. Please evaluate the following answer to a question.

QUESTION:
${question}

ANSWER:
${answer}

PROMPT TEMPLATE:
${promptContent}

Evaluate the answer on relevance, accuracy, and completeness. 
Provide a score from 0-100 and constructive feedback.

Return your evaluation as JSON with these keys:
{
  "isValid": boolean,
  "score": number,
  "feedback": string
}
`;

    try {
      const response = await this.lmStudio.complete(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        return {
          isValid: false,
          score: 0,
          feedback: 'Failed to parse validation result'
        };
      }
      
      const result = JSON.parse(jsonMatch[0]);
      return {
        isValid: result.isValid,
        score: result.score,
        feedback: result.feedback
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        score: 0,
        feedback: 'Error validating response: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  }
} 