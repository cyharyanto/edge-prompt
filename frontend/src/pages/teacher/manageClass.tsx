import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "src/services/api";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface ClassData {
  id?: string;
  name: string;
  description: string;
  students: string[];
}

const ManageClass: React.FC = () => {
  // Get classId from URL parameters
  const { classId } = useParams<{ classId: string }>();

  // const history = useHistory();
  const navigate = useNavigate();

  // State for class data and form handling
  const [classData, setClassData] = useState<ClassData>({
    name: "",
    description: "",
    students: [],
  });

  // State for students management
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<string[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch class data and student information
  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) {
        setError("No class ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch class details
        const classDetails = await api.getClassDetails(classId);
        setClassData({
          id: classId,
          name: classDetails.name,
          description: classDetails.description || "",
          students: classDetails.students || [],
        });

        // Fetch enrolled students
        const enrolled = await api.getEnrolledStudents(classId);
        setEnrolledStudents(enrolled);

        // Fetch available students
        const available = await api.getAvailableStudents(classId);
        setAvailableStudents(available);
      } catch (err: any) {
        setError(`Failed to load class data: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClassData();
  }, [classId]);

  const handleDeleteClass = async () => {
    if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        await api.deleteClass(classId!);
        setSuccess("Class deleted successfully");
        
        // Navigate back to dashboard after a delay
        setTimeout(() => {
          navigate("/dashboard/teacher", { 
            state: { successMessage: `Class "${classData.name}" was deleted successfully.` } 
          });
        }, 2000);
      } catch (err: any) {
        setError(`Failed to delete class: ${err.message || "Unknown error"}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClassData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle removing a student from the class
  const handleRemoveStudent = async (studentId: string) => {
    try {
      setIsSubmitting(true);
      await api.removeStudentFromClass(classId!, studentId);

      // Update local state
      setEnrolledStudents(prev => prev.filter(student => student.id !== studentId));

      // Add removed student to available list
      const removedStudent = enrolledStudents.find(s => s.id === studentId);
      if (removedStudent) {
        setAvailableStudents(prev => [...prev, removedStudent]);
      }

      // Update class data
      setClassData(prev => ({
        ...prev,
        students: prev.students.filter(id => id !== studentId)
      }));

      setSuccess("Student removed successfully");
    } catch (err: any) {
      setError(`Failed to remove student: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle student selection in the available students list
  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentsToAdd(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Add selected students to the class
  const handleAddSelectedStudents = async () => {
    if (selectedStudentsToAdd.length === 0) {
      setError("No students selected to add");
      return;
    }

    try {
      setIsSubmitting(true);

      // Add students one by one
      for (const studentId of selectedStudentsToAdd) {
        await api.addStudentToClass(classId!, studentId);
      }

      // Update local state
      const studentsToAdd = availableStudents.filter(student => 
        selectedStudentsToAdd.includes(student.id)
      );

      setEnrolledStudents(prev => [...prev, ...studentsToAdd]);
      setAvailableStudents(prev => 
        prev.filter(student => !selectedStudentsToAdd.includes(student.id))
      );

      // Update class data
      setClassData(prev => ({
        ...prev,
        students: [...prev.students, ...selectedStudentsToAdd]
      }));

      setSelectedStudentsToAdd([]);
      setSuccess(`${studentsToAdd.length} student(s) added successfully`);
    } catch (err: any) {
      setError(`Failed to add students: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!classData.name.trim()) {
      setError("Class name is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.updateClassDetails(classId!, {
        name: classData.name,
        description: classData.description,
      });

      setSuccess(`Class "${classData.name}" updated successfully!`);

      // Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard/teacher");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <header className="bg-primary text-white p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">
              <i className="bi bi-braces"></i> EdgePrompt <span className="text-white">| Manage Class</span>
            </h1>
            <button className="btn btn-light btn-sm" onClick={() => navigate("/dashboard/teacher")}>
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
          </div>
        </header>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading class data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">
            <i className="bi bi-braces"></i> EdgePrompt <span className="text-white">| Manage Class</span>
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
          {/* Error and success messages */}
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
              <h3 className="card-title mb-0">Manage Class</h3>
            </div>
  
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Class details section */}
                <div className="mb-3">
                  <label htmlFor="className" className="form-label">Class Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="className"
                    name="name"
                    value={classData.name}
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
                    value={classData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
  
                <hr className="my-4" />
  
                {/* Students section */}
                <div className="mb-4">
                  <h4>Enrolled Students</h4>
                  <p className="text-muted">Students currently enrolled in this class.</p>
  
                  {enrolledStudents.length === 0 ? (
                    <div className="alert alert-info">
                      No students are currently enrolled in this class.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledStudents.map((student) => (
                            <tr key={student.id}>
                              <td>{student.name}</td>
                              <td>{student.email}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleRemoveStudent(student.id)}
                                  disabled={isSubmitting}
                                >
                                  <i className="bi bi-person-dash me-1"></i> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
  
                {/* Add students section */}
                <div className="mb-4">
                  <h4>Add Students</h4>
                  <p className="text-muted">Select students to add to this class.</p>
  
                  {availableStudents.length === 0 ? (
                    <div className="alert alert-info">
                      All available students are already enrolled in this class.
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 d-flex justify-content-end">
                        <span className="badge bg-primary">
                          {selectedStudentsToAdd.length} students selected
                        </span>
                      </div>
  
                      <div className="table-responsive mb-3">
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
                              <tr
                                key={student.id}
                                className={selectedStudentsToAdd.includes(student.id) ? "table-active" : ""}
                              >
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`student-${student.id}`}
                                    checked={selectedStudentsToAdd.includes(student.id)}
                                    onChange={() => handleStudentToggle(student.id)}
                                    disabled={isSubmitting}
                                  />
                                </td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
  
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleAddSelectedStudents}
                        disabled={selectedStudentsToAdd.length === 0 || isSubmitting}
                      >
                        <i className="bi bi-person-plus me-1"></i> Add Selected Students
                      </button>
                    </>
                  )}
                </div>
  
                {/* Form actions */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteClass}
                    disabled={isSubmitting}
                  >
                    Delete Class
                  </button>
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() => navigate("/dashboard/teacher")}
                      disabled={isSubmitting}
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
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageClass;
