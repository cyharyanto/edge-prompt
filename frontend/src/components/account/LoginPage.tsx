import React from "react";

export const LoginPage: React.FC = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">
            <i className="bi bi-braces me-2"></i>
            EdgePrompt Login
          </h4>
        </div>
        <div className="card-body">
          <form></form>
        </div>
        <div className="card-footer text-center">
          <small className="text-muted">
            Don't have an account? <a href="/signup">Sign up</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
