import React, { useState } from 'react';
import { Project, ProjectConfiguration } from '../../types';
import { useProject } from '../../contexts/ProjectContext';
import { ProjectForm } from './ProjectForm';
import { ProjectView } from './ProjectView';

export const ProjectPanel: React.FC = () => {
  const { projects, activeProject, setActiveProject, loading, error, refreshProjects } = useProject();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showProjectSelection, setShowProjectSelection] = useState(false);

  const getConfiguration = (project: Project): ProjectConfiguration => {
    return typeof project.configuration === 'string'
      ? JSON.parse(project.configuration)
      : project.configuration;
  };

  const handleBackToProjects = () => {
    setActiveProject(null);
    setShowProjectSelection(true);
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setShowProjectSelection(false);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">Error</h5>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger" 
          onClick={() => refreshProjects()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isCreatingProject) {
    return (
      <ProjectForm 
        onSuccess={() => {
          setIsCreatingProject(false);
          refreshProjects();
        }}
        onClose={() => setIsCreatingProject(false)}
      />
    );
  }

  if (activeProject && !showProjectSelection) {
    return (
      <div>
        <ProjectView 
          project={activeProject} 
          onUpdate={refreshProjects} 
        />
        <div className="mt-3">
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={handleBackToProjects}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Projects</h5>
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => setIsCreatingProject(true)}
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card-body text-center py-5">
          <p className="text-muted mb-3">No projects found.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreatingProject(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="list-group list-group-flush">
          {projects.map(project => (
            <button
              key={project.id}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelectProject(project)}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{project.name}</h5>
                <small className="text-muted">{project.modelName}</small>
              </div>
              <p className="mb-1 text-truncate">{project.description}</p>
              <small className="text-muted">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </small>
            </button>
          ))}
        </div>
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