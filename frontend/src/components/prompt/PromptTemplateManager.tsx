import React, { useState } from 'react';
import { PromptTemplate } from '../../types';
import { api } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';
import { PromptTemplateForm } from './PromptTemplateForm';
import { PromptTemplatePreview } from './PromptTemplatePreview';

export const PromptTemplateManager: React.FC = () => {
  const { promptTemplates, refreshTemplates } = useProject();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (template: PromptTemplate) => {
    if (!window.confirm(`Are you sure you want to delete template "${template.name}"?`)) {
      return;
    }

    try {
      await api.deletePromptTemplate(template.id);
      await refreshTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  if (isCreating || editingTemplate) {
    return (
      <PromptTemplateForm
        template={editingTemplate || undefined}
        onClose={() => {
          setIsCreating(false);
          setEditingTemplate(null);
        }}
        onSuccess={() => {
          setIsCreating(false);
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-text me-2"></i>
            Prompt Templates
          </h5>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            New Template
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger m-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="list-group list-group-flush">
        {promptTemplates.map(template => (
          <div key={template.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="mb-1">{template.name}</h6>
                <small className="text-muted">Version {template.version}</small>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setEditingTemplate(template)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(template)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <PromptTemplatePreview template={template} />
          </div>
        ))}

        {promptTemplates.length === 0 && !isCreating && (
          <div className="text-center text-muted py-4">
            <i className="bi bi-file-earmark-plus display-4"></i>
            <p className="mt-2">No templates yet. Create your first template!</p>
          </div>
        )}
      </div>
    </div>
  );
}; 