import React, { useState } from 'react';
import { Template, ValidationRule } from '../../../../backend/src/types';

interface Props {
  onGenerate: (template: Template, rules: ValidationRule) => void;
}

export const ContentGenerator: React.FC<Props> = ({ onGenerate }) => {
  const [template, setTemplate] = useState<Template>({
    pattern: '',
    constraints: []
  });

  const [rules, setRules] = useState<ValidationRule>({
    criteria: '',
    parameters: {
      threshold: 0.7,
      boundaries: {
        min: 0,
        max: 100
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(template, rules);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-pencil-square"></i> Question Template
        </label>
        <textarea
          className="form-control"
          rows={3}
          value={template.pattern}
          onChange={(e) => setTemplate({...template, pattern: e.target.value})}
          placeholder="Enter question template..."
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-list-ul"></i> Validation Rules
        </label>
        <textarea
          className="form-control"
          rows={3}
          value={rules.criteria}
          onChange={(e) => setRules({...rules, criteria: e.target.value})}
          placeholder="Enter validation criteria..."
        />
      </div>

      <button type="submit" className="btn btn-primary">
        <i className="bi bi-lightning-charge"></i> Generate
      </button>
    </form>
  );
}; 