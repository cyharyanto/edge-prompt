import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateClass: React.FC = () => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ className?: string; selectedStudents?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/students", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students.map((student: any) => ({
          id: student.id,
          name: student.name,
        })));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
  
    fetchStudents();
  }, []);  

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const validateForm = () => {
    const newErrors: { className?: string; selectedStudents?: string } = {};

    if (!className.trim()) {
      newErrors.className = "Class name is required";
    } else if (className.trim().length < 3) {
      newErrors.className = "Class name must be at least 3 characters";
    }

    if (selectedStudents.length === 0) {
      newErrors.selectedStudents = "Please select at least one student.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const token = localStorage.getItem("token"); // Get token again
      const response = await fetch("http://localhost:3001/api/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: className,
          description: description,
          students: selectedStudents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }
      navigate("/dashboard/teacher", { state: { successMessage: "Class created successfully!" } });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-journal-plus me-2"></i>
                Create New Class
              </h4>
            </div>
            <div className="card-body p-4">
              {status === "success" && (
                <div className="alert alert-success">Class created successfully!</div>
              )}
              {status === "error" && (
                <div className="alert alert-danger">Failed to create class.</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="className" className="form-label fw-semibold">Class Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.className ? "is-invalid" : ""}`}
                    id="className"
                    placeholder="Enter class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                  <div className="invalid-feedback">{errors.className}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-semibold">Class Description (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    placeholder="Enter subject or description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="search" className="form-label fw-semibold">Add Students</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    id="search"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <p className="text-muted mb-2">
                    {selectedStudents.length} student(s) selected
                  </p>

                  {errors.selectedStudents && (
                    <div className="text-danger mb-2">{errors.selectedStudents}</div>
                  )}

                  <div className="row">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="col-sm-6 col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleCheckboxChange(student.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`student-${student.id}`}
                          >
                            {student.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard/teacher")}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i> Create Class
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
