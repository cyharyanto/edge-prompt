// frontend/src/pages/TeacherDashboard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const teacherName = "Mr. Anderson"; // Replace this with actual user data

  return (
    <div className="container mt-4">
      <h2>Welcome, {teacherName}!</h2>

      <div className="my-4">
        <h4>Class Management</h4>
        <div className="alert alert-secondary">
          This section will include announcements and class controls.
        </div>
      </div>

      <div className="my-4 d-flex justify-content-between align-items-center">
        <h4>Your Classes</h4>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/teacher/create-class')}
        >
          Create Class
        </button>
      </div>

      <ul className="list-group">
        <li className="list-group-item">Math - Grade 5</li>
        <li className="list-group-item">Science - Grade 6</li>
        {/* Replace with dynamic class list */}
      </ul>

      <div className="mt-4">
        <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Home</button>
        <button className="btn btn-outline-danger" onClick={() => navigate('/logout')}>Logout</button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
