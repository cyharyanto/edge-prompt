import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProjectProvider } from "./contexts/ProjectContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Page imports
import HomePage from "./pages/homepage";
import SignUpPage from "./pages/signup";
import LoginPage from "./pages/signin";
import Dashboard from "./pages/dashboard";
import StudentDashboard from "./pages/studentDashboard";
import TeacherDashboard from "./pages/teacherDashboard";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProjectProvider>
        <Router>
          <Routes>
            {/* Home page is the default route */}
            <Route path="/" element={<HomePage />} />

            {/* Authentication routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Main dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />

            {/* Teacher dashboard */}
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />

            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </ErrorBoundary>
  );
};

export default App;
