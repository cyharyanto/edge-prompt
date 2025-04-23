import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Class = {
  id: string;
  name: string;
};

const placeholderClasses: Class[] = [
  { id: "1", name: "English Literature" },
  { id: "2", name: "Advanced Mathematics" },
  { id: "3", name: "Chemistry" }
];

const TeacherDashboard: React.FC = () => {
  const [teacherName, setTeacherName] = useState("Teacher");
  const [classes, setClasses] = useState<Class[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTeacherName("Ms. Harriet");
    setClasses(placeholderClasses);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateClass = () => {
    navigate("/dashboard/teacher/create-class");
  };

  return (
    <div className="container-fluid px-0">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-easel2"></i> Teacher Dashboard
          </h1>
          <div className="ms-auto d-flex align-items-center gap-3">
            <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/")}>
              Home
            </button>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <h2 className="mb-4">Welcome, {teacherName}!</h2>

        <div className="row">
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Your Classes</h4>
              <button className="btn btn-primary btn-sm" onClick={handleCreateClass}>
                <i className="bi bi-plus-lg me-1"></i> Create Class
              </button>
            </div>
            <div className="row g-3">
              {classes.map((cls) => (
                <div className="col-md-6 col-lg-4" key={cls.id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body text-center">
                      <h5 className="card-title">{cls.name}</h5>
                      <button className="btn btn-outline-primary btn-sm">Manage</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0"><i className="bi bi-megaphone me-1"></i> Class Management</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">This section will include announcements and tools in future.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
