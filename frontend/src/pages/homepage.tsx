import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <i className="bi bi-braces me-3"></i>
          EdgePrompt
        </h1>
        <p className="lead mb-4">
          Secure Framework for AI-Enhanced Education in K-12 Settings
        </p>
        <p className="text-muted">
          Implement pragmatic guardrails for Large Language Models in
          educational environments
        </p>
      </div>

      <div
        className="card shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Welcome to EdgePrompt</h2>

          <div className="d-grid gap-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/login")}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Sign In
            </button>

            <button
              className="btn btn-outline-primary btn-lg"
              onClick={() => navigate("/signup")}
            >
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-muted small">
              By continuing, you agree to EdgePrompt's Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-muted small">
          © {new Date().getFullYear()} EdgePrompt. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;