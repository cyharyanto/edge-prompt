import { Project, PromptTemplate } from '../types';

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
}

export const api = new ApiClient(); 