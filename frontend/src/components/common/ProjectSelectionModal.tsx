import React from 'react';
import { useProject } from '../../contexts/ProjectContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSelectionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { projects, setActiveProject } = useProject();

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Project Selection Required
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Please select a project before uploading materials.</p>
            
            {projects.length > 0 ? (
              <div className="form-group">
                <label htmlFor="projectSelect" className="form-label">Choose a project:</label>
                <select 
                  id="projectSelect"
                  className="form-select" 
                  onChange={(e) => {
                    const selectedProject = projects.find(p => p.id === e.target.value);
                    if (selectedProject) {
                      setActiveProject(selectedProject);
                      onClose();
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="alert alert-info mb-0">
                <p className="mb-0">You don't have any projects yet. Please create a project first.</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {projects.length === 0 && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  // Navigate to project creation or open project creation modal
                  onClose();
                  // Add project creation logic here
                }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Create Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 