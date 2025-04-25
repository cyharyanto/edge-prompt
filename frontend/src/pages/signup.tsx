import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import DOMPurify from "dompurify";

type Errors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  dob?: string;
  roleName?: string;
};

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    dob: "",
    roleName: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form validation
  const validateForm = () => {
    const newErrors: Errors = {};

    //Error in firstname
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    } else if (formData.firstname.trim().length < 2) {
      newErrors.firstname = "First name must be at least 2 characters";
    }

    //Error in lastname
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters";
    }

    //Error in email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    //Error in password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase character";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain a lowercase character";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a number";
    }

    //Error in DOB
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (new Date(formData.dob) >= new Date()) {
      newErrors.dob = "Date of birth must be in the past";
    }

    //Error in role
    if (!formData.roleName) {
      newErrors.roleName = "Please select a role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - connected to api.ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const signupData = {
        firstname: DOMPurify.sanitize(formData.firstname),
        lastname: DOMPurify.sanitize(formData.lastname),
        email: DOMPurify.sanitize(formData.email),
        password: DOMPurify.sanitize(formData.password),
        dob: DOMPurify.sanitize(formData.dob),
        roleName: formData.roleName,
      };

      const response = await api.signup(signupData);
      setMessage("Account created successfully!");
      // Clear input fields after successful signup
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        dob: "",
        roleName: "",
      });
      setErrors({});
      navigate("/login");

    } catch (error: any) {
      setMessage(
        `Signup failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">
          <i className="bi bi-person-plus"></i> Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{errors.firstname}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{errors.lastname}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="passwordhash" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <div className="invalid-feedback d-block">{errors.password}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{errors.dob}</div>
          </div>

          {/* New Role Selection Section */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className={`form-control ${errors.roleName ? "is-invalid" : ""}`}
              id="role"
              name="roleName"
              value={formData.roleName}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <div className="invalid-feedback">{errors.roleName}</div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
          Already have an account? <a href="/login">Sign in</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
