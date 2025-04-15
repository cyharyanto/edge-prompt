import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLabeledStatement } from "typescript";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
  });

  const [editData, setEditData] = useState({
    firstname: false,
    lastname: false,
    email: false,
    dob: false,
    password: false,
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof typeof formData]: value,
    }));
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = () => {
    if (!hasChanges()) return;
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setOriginalData(formData);
    setMessage("Profile updated successfully!");
    setEditData({
      firstname: false,
      lastname: false,
      email: false,
      dob: false,
      password: false, // 🆕 resets all edits on save
    });
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

  const EditDataField = ({
    label,
    name,
    type = "text",
  }: {
    label: string;
    name: keyof typeof formData;
    type?: string;
  }) => (
    <div className="mb-3 d-flex justify-content-between align-items-center">
      <div style={{ width: "100%" }}>
        <label className="form-label">{label}</label>
        {editData[name] ? (
          <input
            type={type}
            className="form-control"
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
          />
        ) : (
          <div className="form-control-plaintext">{formData[name]}</div>
        )}
      </div>
      {editData[name] ? (
        <button
          type="button"
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={() => restoreField(name)}
        >
          Cancel
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-2"
          onClick={() => setEditData((prev) => ({ ...prev, [name]: true }))}
        >
          Edit
        </button>
      )}
    </div>
  );

  const restoreField = (name: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [name]: originalData[name] }));
    setEditData((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">
          <i className="bi bi-person-circle"></i> My Profile
        </h2>

        <EditDataField label="First Name" name="firstname" />
        <EditDataField label="Last Name" name="lastname" />
        <EditDataField label="Email" name="email" type="email" />
        <EditDataField label="Date of Birth" name="dob" type="date" />
        <EditDataField label="Password" name="password" type="password" />

        <div className="d-grid gap-2 mt-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSave}
            disabled={!hasChanges()}
          >
            <i className="bi bi-save me-2"></i> Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
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
