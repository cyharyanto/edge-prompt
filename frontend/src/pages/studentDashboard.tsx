import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SimplifiedMaterialUploader } from "../components/teacher/SimplifiedMaterialUploader";
import { MaterialDetailView } from "../components/teacher/MaterialDetailView";
import { useProject } from "../contexts/ProjectContext";
import { PromptTemplateManager } from "../components/prompt/PromptTemplateManager";
import PromptEngineeringTool from "../components/tools/PromptEngineeringTool";
import { api } from "../services/api";
import { Material } from "../types";
import { ProjectForm } from "../components/project/ProjectForm";

const StudentDashboard: React.FC = () => {

return ( <div className="container-fluid">
<header className="bg-primary text-white p-3 mb-4">
  <div className="d-flex justify-content-between align-items-center">
    <h1 className="h4 mb-0">
      <i className="bi bi-braces"></i> EdgePrompt
    </h1>
    <div className="ms-auto d-flex align-items-center">
      <button
        className="btn btn-outline-light btn-sm"
        // onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right me-1"></i> Logout
      </button>
    </div>
  </div>
</header>
</div>

      )
}

export default StudentDashboard