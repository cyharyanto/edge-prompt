import type { ValidationRule, ValidationResult } from '../types';
import { LMStudioService } from './LMStudioService';

export class ValidationService {
  private lmStudio: LMStudioService;

  constructor(lmStudio: LMStudioService) {
    this.lmStudio = lmStudio;
  }

  async validateResponse(
    question: string,
    answer: string,
    rubric: ValidationRule
  ): Promise<ValidationResult> {
    try {
      // Single-stage validation for now to debug
      const result = await this.validateContent(question, answer, rubric);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        score: 0,
        feedback: 'Validation failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  }

  private async validateContent(
    question: string,
    answer: string,
    rubric: ValidationRule
  ): Promise<ValidationResult> {
    const prompt = `
You are an educational assessment AI. Please evaluate the following student response:

Question: ${question}
Student Answer: ${answer}
Evaluation Criteria: ${rubric.criteria}

Provide your evaluation in the following JSON format:
{
  "isValid": boolean,
  "score": number (between ${rubric.parameters.boundaries.min} and ${rubric.parameters.boundaries.max}),
  "feedback": string (detailed feedback explaining the score)
}

Remember to:
1. Check if the answer is valid and relevant
2. Assign a score based on the criteria
3. Provide constructive feedback
4. Return ONLY valid JSON
`;

    try {
      const response = await this.lmStudio.complete(prompt);
      console.log('Raw LLM response:', response);
      
      try {
        const parsed = JSON.parse(response.trim());
        return {
          isValid: Boolean(parsed.isValid),
          score: Number(parsed.score),
          feedback: String(parsed.feedback)
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Invalid JSON response:', response);
        throw new Error('Failed to parse LLM response as JSON');
      }
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }
} 