import React, { useState } from 'react';
import { ContentGenerator } from './components/teacher/ContentGenerator';
import { ProjectPanel } from './components/project/ProjectPanel';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PromptTemplateManager } from './components/prompt/PromptTemplateManager';
import PromptEngineeringTool from './components/tools/PromptEngineeringTool';

// Main content wrapper that uses the project context
const MainContent: React.FC = () => {
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'promptTools'>('generator');

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt
          </h1>
          {activeProject && (
            <div className="badge bg-light text-primary">
              {activeProject.name} ({activeProject.modelName})
            </div>
          )}
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          {/* Project Panel */}
          <div className="col-xxl-3 mb-4">
            <ProjectPanel />
          </div>

          {/* Main Content */}
          <div className="col-xxl-9">
            {activeProject ? (
              <div>
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'generator' ? 'active' : ''}`}
                      onClick={() => setActiveTab('generator')}
                    >
                      <i className="bi bi-file-text me-1"></i>
                      Content Generator
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
                      onClick={() => setActiveTab('templates')}
                    >
                      <i className="bi bi-file-earmark-text me-1"></i>
                      Prompt Templates
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'promptTools' ? 'active' : ''}`}
                      onClick={() => setActiveTab('promptTools')}
                    >
                      <i className="bi bi-tools me-1"></i>
                      Prompt Engineering Tools
                    </button>
                  </li>
                </ul>

                {activeTab === 'generator' && (
                  <ContentGenerator 
                    onGenerate={(template, rules) => {
                      console.log('Generated:', { template, rules });
                    }}
                  />
                )}
                {activeTab === 'templates' && (
                  <PromptTemplateManager />
                )}
                {activeTab === 'promptTools' && (
                  <PromptEngineeringTool />
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Please select or create a project to begin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the app with ProjectProvider
function App() {
  return (
    <ErrorBoundary>
      <ProjectProvider>
        <MainContent />
      </ProjectProvider>
    </ErrorBoundary>
  );
}

export default App; 