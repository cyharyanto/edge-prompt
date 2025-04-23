import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

  //This will need to be changed & moved once implemented
  type Class = {
    id: string;
    name: string;
  };

  let placeholderClasses = [{
    id: "1",
    name: "English"
  },
  {
    id: "2",
    name: "Science"
  }]


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
    //FIX-ME: implement logic for this
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      {/* Header/Nav (FR3) */}
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt
          </h1>
          <nav className="ms-auto d-flex align-items-center gap-3">
            <span>Home</span>
            <span>Profile</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Welcome Message (FR1) */}
      <h2 className="mb-4">Welcome, {studentName}!</h2>

      {/* Upcoming Assignments Section (FR2) */}
      <section className="mb-5">
        <h4>Upcoming Assignments</h4>
        <ul>
          <li>Assignment 1 - Placeholder</li>
          <li>Assignment 2 - Coming Soon</li>
        </ul>
      </section>

      {/* Current Classes (FR5) */}
      <section>
        <h4>Your Classes</h4>
        {classes.length > 0 ? (
          <ul>
            {classes.map((cls) => (
              <li key={cls.id}>{cls.name}</li>
            ))}
          </ul>
        ) : (
          <p>No classes enrolled yet.</p>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
