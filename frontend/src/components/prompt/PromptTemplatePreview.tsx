import React from 'react';
import { PromptTemplate } from '../../types';

interface Props {
  template: PromptTemplate;
}

export const PromptTemplatePreview: React.FC<Props> = ({ template }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">
          {template.name}
          <small className="text-muted ms-2">v{template.version}</small>
          <span className={`badge bg-${getTypeColor(template.type)} float-end`}>
            {template.type}
          </span>
        </h6>
      </div>
      <div className="card-body">
        <p className="text-muted small mb-2">{template.description}</p>
        <pre className="border rounded p-2 bg-light">
          <code>{template.content}</code>
        </pre>
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