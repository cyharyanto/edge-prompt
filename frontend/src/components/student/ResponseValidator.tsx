import React, { useState } from 'react';
import { ValidationResult } from '../../types/edgeprompt';
import { api } from '../../services/api';

interface Props {
  question: string;
  questionId: string;
  rubric: any;
}

export const ResponseValidator: React.FC<Props> = ({ question, questionId, rubric }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSubmit = async () => {
    if (!answer.trim() || !questionId) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Send only question ID and answer
      const validationResult = await api.validateResponse(
        questionId,
        answer
      );

      const responseData = await api.saveResponse({
        questionId,
        response: answer,
        score: validationResult.score,
        feedback: validationResult.feedback,
        metadata: {
          isValid: validationResult.isValid
        }
      });

      // Now setting the ID correctly as part of the ValidationResult
      setFeedback({
        ...validationResult,
        id: responseData.id
      });
    } catch (error) {
      // Now error is a valid property of ValidationResult
      setFeedback({
        isValid: false,
        score: 0,
        feedback: '',
        error: error instanceof Error ? error.message : 'Failed to validate answer'
      });
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

      <form onSubmit={(e) => {
        e.preventDefault();
        handleAnswerSubmit();
      }}>
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

      {feedback && (
        <div className={`alert mt-4 ${feedback.error ? 'alert-danger' : 'alert-success'}`}>
          <h5>Feedback:</h5>
          {feedback.error ? (
            <p className="text-danger">{feedback.error}</p>
          ) : (
            <>
              <p>Score: {feedback.score}</p>
              <p>{feedback.feedback}</p>
            </>
          )}
          {feedback.id && (
            <p className="text-muted small">Response ID: {feedback.id}</p>
          )}
        </div>
      )}
    </div>
  );
}; 