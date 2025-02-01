import React, { useState, useEffect } from 'react';
import { ContentGenerator } from './components/teacher/ContentGenerator';
import { ResponseValidator } from './components/student/ResponseValidator';
import { Template, ValidationRule, ValidationResult } from '../../backend/src/types';

function App() {
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("Sample question: Explain the water cycle.");
  const [currentRubric, setCurrentRubric] = useState<any>(null);

  useEffect(() => {
    // Check backend health on component mount
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      setIsBackendAvailable(data.lmStudio);
      setError(null);
    } catch (err) {
      setIsBackendAvailable(false);
      setError('Cannot connect to backend server');
    }
  };

  const handleGenerate = async (template: Template, rules: ValidationRule) => {
    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          rules
        }),
      });
      
      const data = await response.json();
      console.log('Generation Response:', data);
      
      if (data.error) {
        setError(data.error);
      } else {
        // Update the student interface with the generated question
        setCurrentQuestion(data.question);
        setCurrentRubric(data.rubric);
      }
    } catch (err) {
      console.error('Generation Error:', err);
      setError('Failed to generate content');
    }
  };

  const handleSubmit = async (answer: string): Promise<ValidationResult> => {
    try {
      const response = await fetch('http://localhost:3001/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer,
          rubric: {
            criteria: currentRubric?.criteria?.join(', ') || "Check understanding of concepts",
            parameters: {
              threshold: 0.7,
              boundaries: {
                min: 0,
                max: currentRubric?.maxScore || 100
              }
            }
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Validation result:', result);
      return result;
    } catch (err) {
      console.error('API Error:', err);
      return {
        isValid: false,
        score: 0,
        feedback: 'Failed to validate answer. Please try again.'
      };
    }
  };

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand">
            <i className="bi bi-braces-asterisk"></i> EdgePrompt
          </span>
          <div className="navbar-text text-light">
            {isBackendAvailable ? (
              <span className="badge bg-success">
                <i className="bi bi-cloud-check"></i> Connected
              </span>
            ) : (
              <span className="badge bg-danger">
                <i className="bi bi-cloud-slash"></i> Disconnected
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-person-workspace"></i> Teacher Interface
                </h5>
              </div>
              <div className="card-body">
                <ContentGenerator onGenerate={handleGenerate} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-person-video3"></i> Student Interface
                </h5>
              </div>
              <div className="card-body">
                <ResponseValidator 
                  question={currentQuestion}
                  onSubmit={handleSubmit}
                />
                
                {currentRubric && (
                  <div className="mt-4">
                    <h6 className="text-muted">
                      <i className="bi bi-list-check"></i> Generated Rubric:
                    </h6>
                    <pre className="bg-light p-3 rounded">
                      {JSON.stringify(currentRubric, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 