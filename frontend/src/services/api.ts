import { Project, PromptTemplate, Material } from '../types';
import { MaterialSource, ContentTemplate, ValidationResult } from '../../../backend/src/types';

const API_BASE = 'http://localhost:3001/api';

export interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Project endpoints
  async getProjects() {
    return this.request<Project[]>('/projects');
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt'>) {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Omit<Project, 'id' | 'createdAt'>) {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Prompt template endpoints
  async getPromptTemplates() {
    return this.request<PromptTemplate[]>('/prompt-templates');
  }

  async createPromptTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt'>) {
    return this.request<PromptTemplate>('/prompt-templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updatePromptTemplate(id: string, template: Omit<PromptTemplate, 'id' | 'createdAt'>) {
    return this.request<PromptTemplate>(`/prompt-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deletePromptTemplate(id: string) {
    return this.request(`/prompt-templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Material endpoints
  async getMaterials(projectId: string) {
    return this.request<Material[]>(`/materials?projectId=${projectId}`);
  }

  async getMaterial(id: string) {
    return this.request<Material>(`/materials/${id}`);
  }

  async uploadMaterial(formData: FormData) {
    const response = await fetch(`${API_BASE}/materials/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  async deleteMaterial(id: string) {
    return this.request(`/materials/${id}`, {
      method: 'DELETE',
    });
  }

  // Question endpoints
  async generateQuestion(template: any, rules: any, context: string, useSourceLanguage: boolean = false) {
    return this.request<any>('/generate', {
      method: 'POST',
      body: JSON.stringify({
        template,
        rules,
        context,
        useSourceLanguage
      }),
    });
  }

  async getQuestions(materialId: string) {
    return this.request<any[]>(`/questions?materialId=${materialId}`);
  }

  async saveQuestion(question: any) {
    return this.request<any>('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  // Response validation endpoints
  async validateResponse(question: string, answer: string, rubric: any) {
    return this.request<ValidationResult>('/validate', {
      method: 'POST',
      body: JSON.stringify({
        question,
        answer,
        rubric
      }),
    });
  }

  async getResponses(questionId: string) {
    return this.request<any[]>(`/responses?questionId=${questionId}`);
  }

  async saveResponse(response: any) {
    return this.request<any>('/responses', {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  // Content processing
  async processMaterial(material: MaterialSource) {
    return this.request<any>('/materials/process', {
      method: 'POST',
      body: JSON.stringify({ material }),
    });
  }
}

export const api = new ApiClient(); 