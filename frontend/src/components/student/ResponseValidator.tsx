import React, { useState } from 'react';
import { ValidationResult } from '../../../../backend/src/types';
import { api } from '../../services/api';

interface Props {
  question: string;
  questionId: string;
  rubric: any;
}

export const ResponseValidator: React.FC<Props> = ({ question, questionId, rubric }) => {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    try {
      const validationResult = await api.validateResponse(question, answer, rubric);
      
      const responseData = await api.saveResponse({
        questionId,
        response: answer,
        score: validationResult.score,
        feedback: validationResult.feedback,
        metadata: {
          isValid: validationResult.isValid
        }
      });
      
      setResponseId(responseData.id);
      setResult(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Question</h5>
        </div>
        <div className="card-body">
          <p>{question}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="answer" className="form-label">Your Answer:</label>
          <textarea
            className="form-control"
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-success"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle"></i> Submit
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`alert mt-4 ${result.isValid ? 'alert-success' : 'alert-warning'}`}>
          <h5>Feedback:</h5>
          <p>Score: {result.score}</p>
          <p>{result.feedback}</p>
          <p className="text-muted small">Response ID: {responseId}</p>
        </div>
      )}
    </div>
  );
}; 