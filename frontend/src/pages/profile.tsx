import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (storedUser.firstname) {
      setFormData(storedUser);
      setOriginalData(storedUser);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = () => {
    if (!hasChanges()) return;
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setOriginalData(formData);
    setMessage("Profile updated successfully!");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("userProfile");
      setMessage("Account deleted.");
      navigate("/signup");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    navigate("/signin");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">
          <i className="bi bi-person-circle"></i> My Profile
        </h2>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>

        <div className="d-grid gap-2 mt-3">
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={!hasChanges()}
          >
            <i className="bi bi-save me-2"></i> Save Changes
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <i className="bi bi-trash3-fill me-2"></i> Delete Account
          </button>
        </div>

        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
