import React, { useState } from 'react';
import { PromptTemplate } from '../../types';
import { api } from '../../services/api';

interface Props {
  template: PromptTemplate;
  onUpdate: () => void;
  onClose: () => void;
}

type PromptTemplateType = 'question_generation' | 'validation' | 'objective_extraction';

export const PromptTemplateView: React.FC<Props> = ({ template, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: template.name,
    version: template.version,
    type: template.type as PromptTemplateType,
    content: template.content,
    description: template.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.updatePromptTemplate(template.id, formData);
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{template.name}</h5>
            <small className="text-muted">Version {template.version}</small>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={onClose}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          {template.description && (
            <p className="text-muted mb-3">{template.description}</p>
          )}
          <div className="mb-3">
            <span className={`badge bg-${getTypeColor(template.type)}`}>
              {template.type}
            </span>
          </div>
          <div className="bg-light p-3 rounded">
            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {template.content}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Edit Template</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Version</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.version}
                  onChange={e => setFormData({...formData, version: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as PromptTemplateType})}
                  required
                >
                  <option value="question_generation">Question Generation</option>
                  <option value="validation">Validation</option>
                  <option value="objective_extraction">Objective Extraction</option>
                </select>
              </div>
            </div>
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

          <div className="mb-3">
            <label className="form-label">Template Content</label>
            <textarea
              className="form-control font-monospace"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              rows={10}
              required
            />
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
              onClick={() => setIsEditing(false)}
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

function getTypeColor(type: string): string {
  const colors = {
    'question_generation': 'primary',
    'validation': 'success',
    'objective_extraction': 'info',
    'default': 'secondary'
  };
  
  return colors[type as keyof typeof colors] || colors.default;
} 