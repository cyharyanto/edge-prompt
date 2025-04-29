import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';  // Assuming you have an API service setup

export const TeacherClassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const data = await api.getClassById(id!); // You must implement this API if not yet done
        setClassData(data);
      } catch (error) {
        console.error('Failed to fetch class data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!classData) return <div>Class not found</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/dashboard/teacher')}>
        ← Back to Dashboard
      </button>

      <h1>{classData.className}</h1>
      <h4 className="text-muted">{classData.subjectName}</h4>

      <div className="d-flex flex-wrap gap-3 mt-4">
        {classData.learningMaterials.map((material: any) => (
          <div 
            key={material.id} 
            className="card p-3"
            style={{ width: '200px', cursor: 'pointer' }}
            onClick={() => navigate(`/material/${material.id}`)} // Or your material detail page
          >
            <h5>{material.title}</h5>
          </div>
        ))}
      </div>

      <button 
        className="btn btn-primary mt-4"
        onClick={() => navigate(`/dashboard/teacher/class/${id}/add-material`)}
      >
        + Add Learning Material
      </button>
    </div>
  );
};
