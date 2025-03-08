import React, { useState, useEffect } from 'react';
import { Template, ValidationRule, MaterialSource, ContentTemplate } from '../../../../backend/src/types';
import { MaterialUploader } from './MaterialUploader';
import { api } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';
import { ProjectSelectionModal } from '../common/ProjectSelectionModal';
import { SimplifiedMaterialUploader } from './SimplifiedMaterialUploader';

interface Props {
  onGenerate: (template: Template, rules: ValidationRule) => void;
  projectId?: string;
}

export const ContentGenerator: React.FC<Props> = ({ onGenerate, projectId }) => {
  const { activeProject, promptTemplates } = useProject();
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [template, setTemplate] = useState<Template>({
    pattern: '',
    constraints: []
  });
  const [uploadedContent, setUploadedContent] = useState<{
    id?: string;
    content: string;
    objectives: string[];
    templates: ContentTemplate[];
    wordCount: number;
    useSourceLanguage?: boolean;
  } | null>(null);
  const [generatedQuestionId, setGeneratedQuestionId] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    id?: string;
    score?: number;
    feedback?: string;
    error?: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProjectWarning, setShowProjectWarning] = useState(!projectId && !activeProject);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    setShowProjectWarning(!projectId && !activeProject);
  }, [projectId, activeProject]);

  const handleMaterialLoad = (material: MaterialSource) => {
    if (!material.id) {
      console.warn('Material loaded without an ID');
    }
    
    setUploadedContent({
      id: material.id,
      content: material.content,
      objectives: material.metadata.learningObjectives || [],
      templates: material.metadata.templates || [],
      wordCount: material.content.split(/\s+/).length,
      useSourceLanguage: material.metadata.useSourceLanguage || false
    });

    if (material.metadata.templates?.length) {
      const firstTemplate = material.metadata.templates[0];
      setTemplate({
        pattern: firstTemplate.pattern,
        constraints: firstTemplate.constraints
      });
    }
  };

  const handleAnswerSubmit = async () => {
    if (!studentAnswer.trim() || !generatedQuestionId) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const validationResult = await api.validateResponse(
        generatedQuestionId,
        studentAnswer
      );

      const responseData = await api.saveResponse({
        questionId: generatedQuestionId,
        response: studentAnswer,
        score: validationResult.score,
        feedback: validationResult.feedback,
        metadata: {
          isValid: validationResult.isValid
        }
      });

      setFeedback({
        id: responseData.id,
        ...validationResult
      });
    } catch (error) {
      setFeedback({
        error: error instanceof Error ? error.message : 'Failed to validate answer'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template.pattern || !uploadedContent) {
      alert('Please select or enter a question template and upload material');
      return;
    }

    if (!uploadedContent.id) {
      alert('Material ID is missing. Please re-upload the material.');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate question - backend will save it directly
      const generatedQuestion = await api.generateQuestion(
        uploadedContent.id,
        activeProject?.promptTemplateId || promptTemplates[0]?.id,
        0,  // First template
        { useSourceLanguage: uploadedContent.useSourceLanguage }
      );
      
      // Store the question ID for validation purposes
      setGeneratedQuestionId(generatedQuestion.id);
      
      // Update the UI with the generated question
      setTemplate({
        ...template,
        pattern: generatedQuestion.question
      });

      setActiveTab('student');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate question. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadClick = () => {
    if (!projectId && !activeProject) {
      setShowProjectModal(true);
    }
  };

  return (
    <div>
      {showProjectWarning && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>No project selected.</strong> Please select a project from the dropdown in the navigation bar before uploading materials.
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
            style={{ 
              backgroundColor: activeTab === 'teacher' ? '#0d6efd' : 'transparent',
              color: activeTab === 'teacher' ? 'white' : '#0d6efd'
            }}
          >
            <i className="bi bi-person-workspace"></i> Teacher Interface
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
            style={{ 
              backgroundColor: activeTab === 'student' ? '#198754' : 'transparent',
              color: activeTab === 'student' ? 'white' : '#198754'
            }}
            disabled={!uploadedContent}
          >
            <i className="bi bi-person-video3"></i> Student Interface
          </button>
        </li>
      </ul>

      {activeTab === 'teacher' && (
        <>
          <SimplifiedMaterialUploader 
            onMaterialLoad={handleMaterialLoad} 
            projectId={projectId || (activeProject ? activeProject.id : undefined)}
          />
          
          {uploadedContent && (
            <>
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-file-text"></i> Content Analysis
                  </h5>
                  <span className="badge bg-secondary">
                    {uploadedContent.wordCount} words
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <h6><i className="bi bi-file-text"></i> Content Preview</h6>
                        <div className="border rounded p-3 bg-light" 
                             style={{ height: '300px', overflow: 'auto' }}>
                          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
                            {uploadedContent.content}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <h6><i className="bi bi-bullseye"></i> Learning Objectives</h6>
                        <div className="list-group mb-3" style={{ maxHeight: '120px', overflow: 'auto' }}>
                          {uploadedContent.objectives.map((objective, index) => (
                            <div key={index} className="list-group-item py-2">
                              {objective}
                            </div>
                          ))}
                        </div>

                        <h6><i className="bi bi-list-check"></i> Question Templates</h6>
                        <div className="list-group" style={{ maxHeight: '150px', overflow: 'auto' }}>
                          {uploadedContent.templates.map((tmpl, index) => (
                            <button
                              key={index}
                              className={`list-group-item list-group-item-action ${
                                template.pattern === tmpl.pattern ? 'active' : ''
                              }`}
                              onClick={() => setTemplate({
                                pattern: tmpl.pattern,
                                constraints: tmpl.constraints
                              })}
                            >
                              <div className="mb-1 fw-bold">{tmpl.pattern}</div>
                              <small className="d-block text-muted">
                                {tmpl.targetGrade} · {tmpl.subject}
                              </small>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-gear"></i> Question Generation
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleGenerateQuestion}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-pencil-square"></i> Selected Template
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={template.pattern}
                            onChange={(e) => setTemplate({...template, pattern: e.target.value})}
                            placeholder="Select a template from above or write your own..."
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-list-check"></i> Constraints
                          </label>
                          <div className="list-group">
                            {template.constraints.map((constraint, index) => (
                              <div key={index} className="list-group-item">
                                {constraint}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isGenerating || !template.pattern}
                      >
                        {isGenerating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lightning-charge"></i> Generate Question
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'student' && (
        <div className="card">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-pencil"></i> Answer Question
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="mb-4">
              <label className="form-label fw-bold">Question:</label>
              <div className="p-4 bg-light rounded border">
                {template.pattern || 'No question selected'}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Your Answer:</label>
              <textarea
                className="form-control"
                rows={6}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
            </div>

            <div className="d-flex justify-content-between align-items-start gap-3">
              <button 
                className="btn btn-success btn-lg"
                onClick={handleAnswerSubmit}
                disabled={isSubmitting || !studentAnswer.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i> Submit Answer
                  </>
                )}
              </button>

              {feedback && (
                <div className={`alert ${feedback.error ? 'alert-danger' : 'alert-success'} flex-grow-1 mb-0 p-3`}>
                  {feedback.error ? (
                    <><i className="bi bi-exclamation-circle me-2"></i> {feedback.error}</>
                  ) : (
                    <>
                      <h6 className="mb-2"><strong>Score: {feedback.score}%</strong></h6>
                      <p className="mb-0">{feedback.feedback}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ProjectSelectionModal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)} 
      />
    </div>
  );
}; 