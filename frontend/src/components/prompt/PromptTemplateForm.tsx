import React, { useState } from 'react';
import { PromptTemplate } from '../../types';
import { api } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  template?: PromptTemplate; // For editing existing template
}

export const PromptTemplateForm: React.FC<Props> = ({ onClose, onSuccess, template }) => {
  const { refreshTemplates } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: template?.name || '',
    version: template?.version || '1.0',
    type: template?.type || 'question_generation',
    content: template?.content || '',
    description: template?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (template) {
        await api.updatePromptTemplate(template.id, formData);
      } else {
        await api.createPromptTemplate(formData);
      }
      await refreshTemplates();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">{template ? 'Edit Template' : 'Create Template'}</h5>
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
                  onChange={e => setFormData({...formData, type: e.target.value as PromptTemplate['type']})}
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
              rows={8}
              required
            />
            <small className="text-muted">
              Use {'{context}'} and {'{focusArea}'} as placeholders in your template
            </small>
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
                  {template ? 'Save Changes' : 'Create Template'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 