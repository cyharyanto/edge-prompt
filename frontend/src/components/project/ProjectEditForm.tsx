import React, { useState } from 'react';
import { Project, ProjectConfiguration } from '../../types';
import { api } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';
import { PromptTemplatePreview } from '../prompt/PromptTemplatePreview';
import DOMPurify from 'dompurify';

interface Props {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectEditForm: React.FC<Props> = ({ project, onClose, onSuccess }) => {
  const { promptTemplates } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const initialConfig = typeof project.configuration === 'string' 
    ? JSON.parse(project.configuration) as ProjectConfiguration
    : project.configuration;
  
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    modelName: project.modelName,
    promptTemplateId: project.promptTemplateId,
    configuration: {
      language: initialConfig.language,
      gradeLevel: initialConfig.gradeLevel,
      subject: initialConfig.subject
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.updateProject(project.id, formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Edit Project</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={2}
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Model</label>
                <select 
                  className="form-select"
                  value={formData.modelName}
                  onChange={e => setFormData({...formData, modelName: e.target.value})}
                  required
                >
                  <option value="Llama 3.2 3B">Llama 3.2 3B</option>
                  <option value="Llama 3.2 7B">Llama 3.2 7B</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={formData.configuration.language}
                  onChange={e => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      language: e.target.value
                    }
                  })}
                  required
                >
                  <option value="English">English</option>
                  <option value="Indonesian">Indonesian</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.configuration.subject}
                  onChange={e => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      subject: e.target.value
                    }
                  })}
                  placeholder="e.g., English"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Grade Level</label>
            <input
              type="text"
              className="form-control"
              value={formData.configuration.gradeLevel}
              onChange={e => setFormData({
                ...formData,
                configuration: {
                  ...formData.configuration,
                  gradeLevel: e.target.value
                }
              })}
              placeholder="e.g., 5th Grade"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Prompt Template</label>
            {promptTemplates.length > 0 ? (
              <>
                <select 
                  className="form-select"
                  value={formData.promptTemplateId}
                  onChange={e => setFormData({...formData, promptTemplateId: e.target.value})}
                  required
                >
                  <option value="">Select template...</option>
                  {promptTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} (v{template.version}) - {template.type}
                    </option>
                  ))}
                </select>
                {formData.promptTemplateId && (
                  <div className="mt-3">
                    <PromptTemplatePreview 
                      template={promptTemplates.find(t => t.id === formData.promptTemplateId)!} 
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                No prompt templates available. Please create one first.
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-light"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 