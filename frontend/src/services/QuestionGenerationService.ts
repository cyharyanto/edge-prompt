import { api } from './api';

export class QuestionGenerationService {
  /**
   * Generates a question using backend processing
   */
  static async generateQuestion(
    materialId: string,
    promptTemplateId: string,
    templateIndex: number,
    useSourceLanguage: boolean = false
  ): Promise<any> {
    // Only pass IDs and minimal flags to the backend
    return api.generateQuestion(
      materialId,
      promptTemplateId,
      templateIndex,
      { useSourceLanguage }
    );
  }
  
  /**
   * Saves a generated question to the database
   */
  static async saveGeneratedQuestion(question: any): Promise<any> {
    return api.saveQuestion({
      materialId: question.materialId,
      promptTemplateId: question.promptTemplateId,
      question: question.question,
      metadata: question.metadata
    });
  }
} 