// CreateClass.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface ClassFormData {
  name: string;
  description: string;
  students: string[];
}

// Dummy student data for development
const dummyStudents: Student[] = [
  { id: "s1", name: "Alice Johnson", email: "alice.j@example.com" },
  { id: "s2", name: "Bob Smith", email: "bob.smith@example.com" },
  { id: "s3", name: "Carlos Rodriguez", email: "carlos.r@example.com" },
  { id: "s4", name: "Diana Chen", email: "diana.c@example.com" },
  { id: "s5", name: "Emmanuel Okonkwo", email: "emmanuel.o@example.com" },
  { id: "s6", name: "Fatima Al-Zahra", email: "fatima.z@example.com" },
  { id: "s7", name: "Gabriel Santos", email: "gabriel.s@example.com" },
  { id: "s8", name: "Hannah Kim", email: "hannah.k@example.com" },
  { id: "s9", name: "Ishan Patel", email: "ishan.p@example.com" },
  { id: "s10", name: "Julia Martinez", email: "julia.m@example.com" },
];

const CreateClass: React.FC = () => {
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    description: "",
    students: [],
  });
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // For development, use dummy data
    setAvailableStudents(dummyStudents);
    
    // const fetchStudents = async () => {
    //   try {
    //     const students = await api.getStudents();
    //     setAvailableStudents(students);
    //   } catch (err: any) {
    //     setError("Failed to load students: " + err.message);
    //   }
    // };
    // fetchStudents();
  }, []);

  // const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  // {isLoadingStudents ? (
  //   <div className="text-center my-4">
  //     <div className="spinner-border" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //     <p className="mt-2">Loading students...</p>
  //   </div>
  // ) : (
  //   // Student table
  // )}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData((prev) => {
      const isSelected = prev.students.includes(studentId);
      return {
        ...prev,
        students: isSelected
          ? prev.students.filter((id) => id !== studentId)
          : [...prev.students, studentId],
      };
    });
  };

  const selectAllStudents = () => {
    setFormData((prev) => ({
      ...prev,
      students: availableStudents.map((s) => s.id),
    }));
  };

  const deselectAllStudents = () => {
    setFormData((prev) => ({
      ...prev,
      students: [],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Class name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // For development, just log the data
      console.log("Class created:", formData);
      
      // await api.createClass(formData);
      
      setSuccess(`Class "${formData.name}" created successfully!`);
      
      setTimeout(() => {
        navigate("/dashboard/teacher");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt <span className="text-white">| Create New Class</span>
          </h1>
          <nav className="ms-auto d-flex align-items-center gap-3">
            <button className="btn btn-light btn-sm" onClick={() => navigate("/dashboard/teacher")}>
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
          </nav>
        </div>
      </header>

      <div className="row justify-content-center">
        <div className="col-md-10">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h3 className="card-title mb-0">Create New Class</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="className" className="form-label">Class Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="className"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="classDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="classDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <h4>Add Students to Class</h4>
                  <p className="text-muted">Select students to enroll in this class.</p>
                  
                  <div className="mb-2 d-flex gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={selectAllStudents}
                    >
                      Select All
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={deselectAllStudents}
                    >
                      Deselect All
                    </button>
                    <div className="ms-auto">
                      <span className="badge bg-primary">
                        {formData.students.length} students selected
                      </span>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Select</th>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableStudents.map((student) => (
                          <tr key={student.id} className={formData.students.includes(student.id) ? "table-active" : ""}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`student-${student.id}`}
                                checked={formData.students.includes(student.id)}
                                onChange={() => handleStudentToggle(student.id)}
                              />
                            </td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard/teacher")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Class"
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