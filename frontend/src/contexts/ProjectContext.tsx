import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, PromptTemplate } from '../types';
import { api } from '../services/api';

interface ProjectContextType {
  projects: Project[];
  promptTemplates: PromptTemplate[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  refreshTemplates: () => Promise<PromptTemplate[]>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await api.getProjects();
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const refreshTemplates = async () => {
    try {
      const templates = await api.getPromptTemplates();
      setPromptTemplates(templates);
      return templates;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
      return [];
    }
  };

  useEffect(() => {
    Promise.all([refreshProjects(), refreshTemplates()]);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        promptTemplates,
        activeProject,
        setActiveProject,
        loading,
        error,
        refreshProjects,
        refreshTemplates,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 