import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Class = {
  id: string;
  name: string;
};

const placeholderClasses: Class[] = [
  { id: "1", name: "English" },
  { id: "2", name: "Science" },
  { id: "3", name: "Mathematics" },
  { id: "4", name: "History" }
];

const StudentDashboard: React.FC = () => {
  const [studentName, setStudentName] = useState("Student");
  const [classes, setClasses] = useState<Class[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setStudentName("John");
      } catch (err) {
        console.error("Failed to fetch student data:", err);
      }
    };

    const fetchClasses = async () => {
      try {
        setClasses(placeholderClasses);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchStudentData();
    fetchClasses();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt
          </h1>
          <nav className="ms-auto d-flex align-items-center gap-3">
            <button className="btn btn-light btn-sm">Home</button>
            <button className="btn btn-light btn-sm">Profile</button>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </nav>
        </div>
      </header>

      <h2 className="mb-4">Welcome, {studentName}!</h2>

      <div className="row">
        <div className="col-md-9">
          <div className="row g-3">
            {classes.map((cls) => (
              <div className="col-md-6 col-lg-4" key={cls.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">{cls.name}</h5>
                    <button className="btn btn-outline-primary btn-sm">View Class</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-journal-text me-1"></i> Upcoming Assignments
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Assignment 1:</strong> Homework
                </li>
                <li>
                  <strong>Assignment 2:</strong> Homework
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;