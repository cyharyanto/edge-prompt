import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Class = {
  id: string;
  name: string;
};

const ClassPage: React.FC = () => {
  const { classId } = useParams(); // Get classId from the URL
  const [classData, setClassData] = useState<Class | null>(null);

  useEffect(() => {
    // Fetch the class details using the classId from the URL
    const fetchClassData = async () => {
      try {
        console.log("placeholder")
      } catch (err) {
        console.error("Failed to fetch class data:", err);
      }
    };

    fetchClassData();
  }, [classId]);

  if (!classData) return <div>class-id is {classId} </div>;

  return (
    <div className="container">
      <h1 className="my-4">{classData.name}</h1>
    </div>
  );
};

export default ClassPage;
