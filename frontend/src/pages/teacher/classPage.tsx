import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

const TeacherClassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const data = await api.getClassById(id!);
        setClassData(data);
      } catch (error) {
        console.error("Failed to fetch class data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading class...</div>;
  if (!classData) return <div className="text-center mt-5 text-danger">Class not found</div>;

  return (
    <>
      {/* Header inside container-fluid */}
      <div className="container-fluid">
        <header className="bg-primary text-white p-3 mb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">
              <i className="bi bi-braces"></i> EdgePrompt <span className="text-white">| Class Page</span>
            </h1>
            <nav className="ms-auto d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate("/dashboard/teacher")}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
              </button>
            </nav>
          </div>
        </header>
      </div>
  
      {/* Main Content */}
      <div className="container-fluid px-4 mt-4">
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold">{classData.className}</h2>
            <p className="text-muted mb-0">Manage your learning materials</p>
          </div>
          <div className="col-md-4 text-end">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/dashboard/teacher/class/${id}/add-material`)}
            >
              <i className="bi bi-plus-lg me-1"></i> Add Material
            </button>
          </div>
        </div>
  
        <div className="row">
          {/* Main Content */}
          <div className="col-md-9">
            <div className="mb-3">
              <h5>Learning Materials</h5>
            </div>
  
            {classData.learningMaterials.length === 0 ? (
              <div className="text-muted">No learning materials added yet.</div>
            ) : (
              <div className="row g-3">
                {classData.learningMaterials.map((material: any) => (
                  <div className="col-md-6 col-lg-4" key={material.id}>
                    <div
                      className="card shadow-sm h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/material/${material.id}`)}
                    >
                      <div className="card-body text-center">
                        <h5 className="card-title">{material.title}</h5>
                        <p className="text-muted small mb-0">Click to view or manage</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-tools me-1"></i> Class Tools
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted">
                  This space can be used for future tools like analytics,
                  announcements, or class-level actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
};

export default TeacherClassPage;