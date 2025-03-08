import React, { useEffect, useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';

export const Navbar: React.FC = () => {
  const { projects, activeProject, setActiveProject } = useProject();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">
          <i className="bi bi-braces me-2"></i>
          EdgePrompt
        </a>
        
        {projects.length > 0 && (
          <div className="ms-auto me-4">
            <select 
              className="form-select form-select-sm" 
              value={activeProject?.id || ''} 
              onChange={(e) => {
                const selectedProject = projects.find(p => p.id === e.target.value);
                if (selectedProject) {
                  setActiveProject(selectedProject);
                }
              }}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="navbar-text text-light">
          {activeProject ? (
            <span>
              <i className="bi bi-folder me-1"></i>
              {activeProject.name}
            </span>
          ) : (
            <span className="text-warning">
              <i className="bi bi-exclamation-triangle me-1"></i>
              No project selected
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}; 