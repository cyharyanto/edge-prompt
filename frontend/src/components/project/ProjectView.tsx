import React, { useState } from 'react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { ProjectEditForm } from './ProjectEditForm';
import { useProject } from '../../contexts/ProjectContext';

interface Props {
  project: Project;
  onUpdate: () => void;
}

export const ProjectView: React.FC<Props> = ({ project, onUpdate }) => {
  const { promptTemplates } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the current template
  const currentTemplate = project.promptTemplateId ? 
    promptTemplates.find(t => t.id === project.promptTemplateId) : 
    null;

  const configuration = typeof project.configuration === 'string' 
    ? JSON.parse(project.configuration) 
    : project.configuration;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteProject(project.id);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{project.name}</h5>
            <small className="text-muted">{project.description}</small>
          </div>
          <div>
            <button 
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="list-group list-group-flush">
        <div className="list-group-item">
          <div className="row">
            <div className="col-md-4">
              <small className="text-muted d-block">Model</small>
              <strong>{project.modelName}</strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Language</small>
              <strong>{configuration.language}</strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Subject</small>
              <strong>{configuration.subject}</strong>
            </div>
          </div>
        </div>

        <div className="list-group-item">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted d-block">Grade Level</small>
              <strong>{configuration.gradeLevel}</strong>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Prompt Template</small>
              {currentTemplate ? (
                <div>
                  <strong>{currentTemplate.name}</strong>
                  <small className="text-muted ms-2">v{currentTemplate.version}</small>
                </div>
              ) : (
                <div className="text-danger">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Template not found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card-footer">
          <div className="alert alert-danger mb-0">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      )}

      {isEditing && (
        <ProjectEditForm
          project={project}
          onClose={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}; 