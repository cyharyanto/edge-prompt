import React, { useState } from 'react';
import { Project, ProjectConfiguration } from '../../types';
import { useProject } from '../../contexts/ProjectContext';
import { ProjectForm } from './ProjectForm';
import { ProjectView } from './ProjectView';

export const ProjectPanel: React.FC = () => {
  const { projects, activeProject, setActiveProject, loading, error, refreshProjects } = useProject();
  const [isCreating, setIsCreating] = useState(false);

  const getConfiguration = (project: Project): ProjectConfiguration => {
    return typeof project.configuration === 'string'
      ? JSON.parse(project.configuration)
      : project.configuration;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  // If a project is selected, show its details
  if (activeProject) {
    return (
      <>
        <ProjectView 
          project={activeProject} 
          onUpdate={() => {
            refreshProjects();
          }}
        />
        <button 
          className="btn btn-link text-muted mt-2"
          onClick={() => setActiveProject(null)}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Projects
        </button>
      </>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-folder me-2"></i>
            Projects
          </h5>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            New Project
          </button>
        </div>
      </div>

      <div className="list-group list-group-flush">
        {projects.map(project => {
          const config = getConfiguration(project);
          return (
            <button
              key={project.id}
              className="list-group-item list-group-item-action"
              onClick={() => setActiveProject(project)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{project.name}</h6>
                  <small className="text-muted d-block">
                    {project.modelName} · {config.language}
                  </small>
                </div>
                <div className="text-end">
                  <span className={`badge bg-${getSubjectColor(config.subject)}`}>
                    {config.subject}
                  </span>
                  <small className="text-muted d-block mt-1">
                    {config.gradeLevel}
                  </small>
                </div>
              </div>
            </button>
          );
        })}

        {projects.length === 0 && !isCreating && (
          <div className="list-group-item text-center text-muted py-4">
            <i className="bi bi-folder-plus display-4"></i>
            <p className="mt-2">No projects yet. Create your first project!</p>
          </div>
        )}
      </div>

      {isCreating && (
        <ProjectForm 
          onClose={() => setIsCreating(false)}
          onSuccess={() => {
            setIsCreating(false);
            refreshProjects();
          }}
        />
      )}
    </div>
  );
};

// Helper function to get consistent colors for subjects
function getSubjectColor(subject: string): string {
  const colors = {
    'English': 'primary',
    'Mathematics': 'success',
    'Science': 'info',
    'History': 'warning',
    'default': 'secondary'
  };
  
  return colors[subject as keyof typeof colors] || colors.default;
} 