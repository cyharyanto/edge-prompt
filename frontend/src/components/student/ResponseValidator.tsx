import React, { useState } from 'react';
import { ValidationResult } from '../../../../backend/src/types';

interface Props {
  question: string;
  onSubmit: (answer: string) => Promise<ValidationResult>;
}

export const ResponseValidator: React.FC<Props> = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validationResult = await onSubmit(answer);
      setResult(validationResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">
            <i className="bi bi-question-circle"></i> Question:
          </h6>
          <p className="card-text">{question}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-pencil"></i> Your Answer
          </label>
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
          <h6 className="alert-heading">
            <i className={`bi ${result.isValid ? 'bi-emoji-smile' : 'bi-emoji-neutral'}`}></i> Feedback:
          </h6>
          <p>{result.feedback}</p>
          <hr />
          <p className="mb-0">
            <strong>Score: {result.score}</strong>
          </p>
        </div>
      )}
    </div>
  );
}; 