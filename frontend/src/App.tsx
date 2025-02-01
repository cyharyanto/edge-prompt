import React from 'react';
import { ContentGenerator } from './components/teacher/ContentGenerator';
import { Template, ValidationRule } from '../../backend/src/types';

function App() {
  const handleGenerate = (template: Template, rules: ValidationRule) => {
    console.log('Generated:', { template, rules });
  };

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt
          </h1>
          <span className="badge bg-success">Connected</span>
        </div>
      </header>

      <main className="container">
        <ContentGenerator onGenerate={handleGenerate} />
      </main>
    </div>
  );
}

export default App; 