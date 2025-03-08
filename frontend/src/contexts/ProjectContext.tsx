import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export const ProjectProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects and templates
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, templatesData] = await Promise.all([
        api.getProjects(),
        api.getPromptTemplates()
      ]);
      
      setProjects(projectsData);
      setPromptTemplates(templatesData);
      
      // Automatically select the first project if there's only one and no active project
      if (projectsData.length === 1 && !activeProject) {
        setActiveProject(projectsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading project data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add a refreshTemplates function that delegates to loadData
  const refreshTemplates = useCallback(async () => {
    await loadData();
    return promptTemplates;
  }, [loadData, promptTemplates]);

  // Provide context
  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        activeProject, 
        setActiveProject, 
        promptTemplates, 
        loading, 
        error, 
        refreshProjects: loadData,
        refreshTemplates 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 