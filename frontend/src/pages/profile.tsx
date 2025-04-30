import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "src/services/api";

// Represents the user's profile data stored
type FormDataType = {
  firstname: string;
  lastname: string;
  email: string;
  dob: string;
  password: string;
};

// Tracks which profile fields are currently in edit mode (true = editable)
type EditDataType = {
  firstname: boolean;
  lastname: boolean;
  email: boolean;
  dob: boolean;
  password: boolean;
};

// Props required by the reusable EditDataField component for rendering and editing a single profile field
type EditFieldProps = {
  label: string;
  name: keyof FormDataType;
  type?: string;
  formData: FormDataType;
  editData: EditDataType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  restoreField: (name: keyof FormDataType) => void;
  setEditData: React.Dispatch<React.SetStateAction<EditDataType>>;
};

// Reusable field component (outside ProfilePage)
const EditDataField: React.FC<EditFieldProps> = ({
  label,
  name,
  type = "text",
  formData,
  editData,
  handleInputChange,
  restoreField,
  setEditData,
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

// Main Component
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
  });

  const [editData, setEditData] = useState<EditDataType>({
    firstname: false,
    lastname: false,
    email: false,
    dob: false,
    password: false,
  });

  const [originalData, setOriginalData] = useState<FormDataType>(formData);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch user profile data from API
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await api.getProfile();
        
        setFormData({
          ...profile,
          password: "********", // Mask the password
        });
        
        setOriginalData({
          ...profile,
          password: "********",
        });
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data. Please try again.");
        
        // If unauthorized, redirect to login
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataType]: value,
    }));
  };

  const hasChanges = () => {
    // Don't consider password in the comparison since it's masked
    const { password: p1, ...formDataWithoutPassword } = formData;
    const { password: p2, ...originalDataWithoutPassword } = originalData;
    
    return JSON.stringify(formDataWithoutPassword) !== 
           JSON.stringify(originalDataWithoutPassword);
  };

  const handleSave = async () => {
    if (!hasChanges()) return;
    
    try {
      setLoading(true);
      
      // We're not sending the password field as it's not editable directly
      const { password, ...profileData } = formData;
      
      await api.updateProfile(profileData);
      
      setOriginalData(formData);
      setMessage("Profile updated successfully!");
      setEditData({
        firstname: false,
        lastname: false,
        email: false,
        dob: false,
        password: false,
      });
      
      setError(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Reset error state
    setPasswordError("");
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    
    try {
      setLoading(true);
      
      // Call API to update password
      await api.updatePassword(currentPassword, newPassword);
      
      // Success handling
      setMessage("Password updated successfully!");
      setShowPasswordModal(false);
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (err) {
      console.error("Failed to update password:", err);
      if (err instanceof Error) {
        setPasswordError(err.message || "Failed to update password. Please try again.");
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const restoreField = (name: keyof FormDataType) => {
    setFormData((prev) => ({ ...prev, [name]: originalData[name] }));
    setEditData((prev) => ({ ...prev, [name]: false }));
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        await api.deleteAccount();
        setMessage("Account deleted.");
        
        // Clear token and navigate to signup
        localStorage.removeItem("token");
        navigate("/signup");
      } catch (err) {
        console.error("Failed to delete account:", err);
        setError("Failed to delete account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.signout();
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if the API call fails, clear the token and redirect
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  if (loading && !formData.firstname) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">
          <i className="bi bi-person-circle"></i> My Profile
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <EditDataField
          label="First Name"
          name="firstname"
          formData={formData}
          editData={editData}
          handleInputChange={handleInputChange}
          restoreField={restoreField}
          setEditData={setEditData}
        />
        <EditDataField
          label="Last Name"
          name="lastname"
          formData={formData}
          editData={editData}
          handleInputChange={handleInputChange}
          restoreField={restoreField}
          setEditData={setEditData}
        />
        <EditDataField
          label="Email"
          name="email"
          type="email"
          formData={formData}
          editData={editData}
          handleInputChange={handleInputChange}
          restoreField={restoreField}
          setEditData={setEditData}
        />
        <EditDataField
          label="Date of Birth"
          name="dob"
          type="date"
          formData={formData}
          editData={editData}
          handleInputChange={handleInputChange}
          restoreField={restoreField}
          setEditData={setEditData}
        />
        
        {/* Password field is special - clicking Edit opens a modal */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div style={{ width: "100%" }}>
            <label className="form-label">Password</label>
            <div className="form-control-plaintext">••••••••</div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => setShowPasswordModal(true)}
          >
            Change
          </button>
        </div>

        <div className="d-grid gap-2 mt-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSave}
            disabled={!hasChanges() || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i> Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLogout}
            disabled={loading}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            <i className="bi bi-trash3-fill me-2"></i> Delete Account
          </button>
        </div>

        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {passwordError && (
                  <div className="alert alert-danger">{passwordError}</div>
                )}
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <div className="input-group">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;