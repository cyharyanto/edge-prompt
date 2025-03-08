import React, { useState } from 'react';
// Remove this line since Bootstrap CSS is loaded globally in index.html
// import 'bootstrap/dist/css/bootstrap.min.css';
// Using Bootstrap icons instead of Lucide-React
// If you prefer to keep Lucide, run: npm install lucide-react

interface Variable {
  name: string;
  value: string;
}

type Side = 'left' | 'right';

const PromptEngineeringTool: React.FC = () => {
  // State for prompts and variables
  const [leftPrompt, setLeftPrompt] = useState('');
  const [rightPrompt, setRightPrompt] = useState('');
  const [leftVariables, setLeftVariables] = useState<Variable[]>([{ name: '', value: '' }]);
  const [rightVariables, setRightVariables] = useState<Variable[]>([{ name: '', value: '' }]);
  const [leftResponse, setLeftResponse] = useState('');
  const [rightResponse, setRightResponse] = useState('');

  // Function to add a new variable
  const addVariable = (side: Side) => {
    if (side === 'left') {
      setLeftVariables([...leftVariables, { name: '', value: '' }]);
    } else {
      setRightVariables([...rightVariables, { name: '', value: '' }]);
    }
  };

  // Function to remove a variable
  const removeVariable = (side: Side, index: number) => {
    if (side === 'left') {
      const newVariables = [...leftVariables];
      newVariables.splice(index, 1);
      setLeftVariables(newVariables);
    } else {
      const newVariables = [...rightVariables];
      newVariables.splice(index, 1);
      setRightVariables(newVariables);
    }
  };

  // Function to update variable name
  const updateVariableName = (side: Side, index: number, value: string) => {
    if (side === 'left') {
      const newVariables = [...leftVariables];
      newVariables[index].name = value;
      setLeftVariables(newVariables);
    } else {
      const newVariables = [...rightVariables];
      newVariables[index].name = value;
      setRightVariables(newVariables);
    }
  };

  // Function to update variable value
  const updateVariableValue = (side: Side, index: number, value: string) => {
    if (side === 'left') {
      const newVariables = [...leftVariables];
      newVariables[index].value = value;
      setLeftVariables(newVariables);
    } else {
      const newVariables = [...rightVariables];
      newVariables[index].value = value;
      setRightVariables(newVariables);
    }
  };

  // Function to generate responses
  const generateResponse = (side: Side) => {
    // In a real implementation, this would call the LLM API
    // For now, just setting a placeholder response
    if (side === 'left') {
      setLeftResponse(`Response for prompt: ${leftPrompt}\nWith variables: ${JSON.stringify(leftVariables, null, 2)}`);
    } else {
      setRightResponse(`Response for prompt: ${rightPrompt}\nWith variables: ${JSON.stringify(rightVariables, null, 2)}`);
    }
  };

  // Function to add a new prompt
  const addPrompt = () => {
    // This would be implemented to add another column or section
    alert('This would add another prompt section to continue with the next shot.');
  };

  // Function to compare responses
  const compareResponses = () => {
    // This would be implemented to compare the two responses
    alert('This would compare the responses from the two prompts.');
  };

  return (
    <div className="container-fluid d-flex flex-column vh-100 p-0">
      <div className="row flex-grow-1 g-0">
        {/* Left Panel */}
        <div className="col border-end">
          <div className="d-flex flex-column h-100 p-2">
            {/* Prompt Input */}
            <div className="card mb-3 flex-grow-1">
              <div className="card-header text-center bg-light">
                Prompt
              </div>
              <div className="card-body p-0">
                <textarea 
                  className="form-control border-0 h-100"
                  value={leftPrompt}
                  onChange={(e) => setLeftPrompt(e.target.value)}
                  style={{ minHeight: "150px", resize: "none" }}
                ></textarea>
              </div>
            </div>
            
            {/* Variables */}
            {leftVariables.map((variable, index) => (
              <div key={index} className="mb-3">
                <div className="input-group mb-1">
                  <input
                    type="text"
                    placeholder="Variable Name"
                    className="form-control"
                    value={variable.name}
                    onChange={(e) => updateVariableName('left', index, e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => removeVariable('left', index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Variable Value"
                  className="form-control"
                  value={variable.value}
                  onChange={(e) => updateVariableValue('left', index, e.target.value)}
                />
              </div>
            ))}
            
            {/* Add Variable Button */}
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Variable Name"
                className="form-control bg-light"
                disabled
              />
              <button 
                className="btn btn-outline-success"
                onClick={() => addVariable('left')}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            
            {/* Generate Button */}
            <button 
              className="btn btn-primary mb-3"
              onClick={() => generateResponse('left')}
            >
              GENERATE
            </button>
            
            {/* Response Area */}
            <div className="card flex-grow-1">
              <div className="card-header text-center bg-light">
                Response
              </div>
              <div className="card-body overflow-auto">
                <pre className="mb-0">{leftResponse}</pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="col">
          <div className="d-flex flex-column h-100 p-2">
            {/* Prompt Input */}
            <div className="card mb-3 flex-grow-1">
              <div className="card-header text-center bg-light">
                Prompt
              </div>
              <div className="card-body p-0">
                <textarea 
                  className="form-control border-0 h-100"
                  value={rightPrompt}
                  onChange={(e) => setRightPrompt(e.target.value)}
                  style={{ minHeight: "150px", resize: "none" }}
                ></textarea>
              </div>
            </div>
            
            {/* Variables */}
            {rightVariables.map((variable, index) => (
              <div key={index} className="mb-3">
                <div className="input-group mb-1">
                  <input
                    type="text"
                    placeholder="Variable Name"
                    className="form-control"
                    value={variable.name}
                    onChange={(e) => updateVariableName('right', index, e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => removeVariable('right', index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Variable Value"
                  className="form-control"
                  value={variable.value}
                  onChange={(e) => updateVariableValue('right', index, e.target.value)}
                />
              </div>
            ))}
            
            {/* Add Variable Button */}
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Variable Name"
                className="form-control bg-light"
                disabled
              />
              <button 
                className="btn btn-outline-success"
                onClick={() => addVariable('right')}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            
            {/* Generate Button */}
            <button 
              className="btn btn-primary mb-3"
              onClick={() => generateResponse('right')}
            >
              GENERATE
            </button>
            
            {/* Response Area */}
            <div className="card flex-grow-1">
              <div className="card-header text-center bg-light">
                Response
              </div>
              <div className="card-body overflow-auto">
                <pre className="mb-0">{rightResponse}</pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Compare Button (Right-most Column) */}
        <div className="col-1 d-flex align-items-center justify-content-center border-start">
          <button 
            className="btn btn-outline-primary"
            onClick={compareResponses}
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", height: "150px" }}
          >
            COMPARE
          </button>
        </div>
      </div>
      
      {/* Add Prompt Button (Bottom) */}
      <div className="row g-0 border-top">
        <div className="col p-3 text-center">
          <button 
            className="btn btn-secondary mx-auto d-block mb-2"
            onClick={addPrompt}
          >
            ADD PROMPT
          </button>
          <small className="text-muted">
            When clicked, this will add another set of prompts to continue with the next shot.
          </small>
        </div>
      </div>
    </div>
  );
};

export default PromptEngineeringTool;