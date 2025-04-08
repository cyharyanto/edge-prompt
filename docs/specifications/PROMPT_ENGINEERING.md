# EdgePrompt Prompt Engineering Methodology

## Implementation Notes

This document provides a high-density algorithmic specification for testing and validating the claims in the EdgePrompt paper. It is designed to be implemented by either AI assistants or human developers to generate empirical data supporting the paper's core arguments about neural-symbolic principles, multi-stage validation, and resource optimization in edge-deployed LLMs.

**Key implementation considerations:**
- This is an algorithm-level specification rather than code-level implementation
- Code can be generated in any language (Python, C++, JavaScript, etc.) from these specifications
- Hardware simulation allows testing on high-performance systems (RTX series GPUs, Apple Silicon, etc.)
- State-of-the-art LLMs (GPT-4o, Claude 3.7, Gemini 2.5) simulate teacher/student evaluation
- All outputs are designed for direct integration into the EdgePrompt paper

This document should be read in conjunction with the SYSTEM_VISION.md, which outlines the philosophical foundations and educational principles of EdgePrompt, and the conference paper draft which provides the formal mathematical framework being tested.

## 1. System Architecture

```mermaid
graph TD
    A[Template Repository] --> B[Test Orchestrator]
    C[Hardware Simulator] --> B
    D[Evaluation LLM] --> B
    
    B --> E[Template Processor]
    E --> F[Edge LLM Engine]
    F --> G[Validation Engine]
    
    G --> H[Metrics Collector]
    H --> I[Results Analyzer]
    I --> J[Paper-Ready Visualizations]
    
    K[Human Researcher] -->|Template Design| A
    J -->|Feedback Loop| K
```

The system consists of interconnected components that automate the testing process:
- The **Template Repository** stores structured prompts implementing $T_c$, $A_s$, and other formal constructs
- The **Hardware Simulator** emulates edge device constraints on high-performance hardware
- The **Edge LLM Engine** executes tests on target models (Gemma 3, Llama 3)
- The **Validation Engine** implements the multi-stage validation sequences
- The **Metrics Collector** captures comprehensive performance data
- The **Results Analyzer** generates paper-ready visualizations

## 2. Core Algorithms

### 2.1 Hardware Simulation Algorithm

```
ALGORITHM HardwareSimulation
INPUT: 
  - hardware_profile (object defining resource constraints)
  - execution_function (function to run under constraints)
OUTPUT: 
  - execution_result (object containing output and performance metrics)

1. Initialize resource monitoring system
2. Apply memory constraints: 
   - Linux: Use cgroups (memory.limit_in_bytes = profile.max_memory)
   - Docker: Use --memory flag and appropriate GPU limits
   - MacOS: Use resource limitation APIs
3. Apply compute constraints:
   - Limit CPU cores and frequencies
   - For GPU acceleration, limit VRAM and compute capability
4. Apply network constraints if specified (bandwidth and latency)
5. Start measurement of: time, memory, power, temperature
6. Execute the specified function under these constraints
7. Stop measurement
8. Release resource constraints
9. Return: execution result and collected metrics
```

### 2.2 Template Processing Algorithm

```
ALGORITHM TemplateProcessing
INPUT:
  - template_schema (JSON schema specifying the template structure)
  - template_instance (specific template with variables)
  - variable_values (dictionary of values to substitute)
OUTPUT:
  - processed_template (ready for model input)
  - metadata (information about processing steps)

1. Validate template_instance against template_schema
2. Extract all variables from template pattern using regex: \[([a-zA-Z_]+)\]
3. For each variable in extracted variables:
   a. If variable exists in variable_values:
      - Substitute [variable] with variable_values[variable]
   b. Else:
      - Raise error: missing required variable
4. Apply constraint encoding:
   a. For each constraint in template_instance.constraints:
      - Format constraint according to template type
      - Append to processed template in appropriate location
5. Optimize for token efficiency:
   a. Eliminate redundant whitespace
   b. Consolidate similar constraints
   c. Prioritize constraints by importance
6. Return processed template and metadata
```

### 2.3 Multi-Stage Validation Algorithm

```
ALGORITHM MultiStageValidation
INPUT:
  - question (string)
  - answer (string)
  - validation_sequence (array of ordered validation steps)
  - abort_on_failure (boolean)
OUTPUT:
  - validation_result (object with overall result and detailed stage results)

1. Initialize validation_result = {isValid: true, score: 0, stageResults: []}
2. For each stage in validation_sequence (ordered by priority):
   a. Format stage-specific prompt using: question, answer, and stage.template
   b. Start resource measurement for this stage
   c. Execute LLM inference with this prompt
   d. Parse LLM response to extract:
      - passed (boolean)
      - score (number)
      - feedback (string)
   e. End resource measurement
   f. Record stage result including:
      - stageId
      - passed/failed status
      - score
      - feedback
      - performance metrics
   g. If !passed AND abort_on_failure:
      - Set validation_result.isValid = false
      - Update validation_result.score based on stage.scoringImpact
      - Break loop (early exit optimization)
   h. If passed:
      - Update validation_result.score based on stage.scoringImpact
3. Aggregate feedback from all stages
4. Return validation_result
```

### 2.4 Metrics Collection Algorithm

```
ALGORITHM MetricsCollection
INPUT:
  - collection_config (configuration specifying metrics to collect)
  - sampling_interval_ms (how frequently to sample)
OUTPUT:
  - metrics_result (comprehensive performance data)

1. Initialize data structures for each metric category:
   - time_series = {timestamps: [], values: {}}
   - peak_values = {}
   - cumulative_values = {}

2. Define sampling function:
   a. Record current timestamp
   b. For each metric in config.metrics:
      i. Sample current value
      ii. Add to time_series
      iii. Update peak_values if current > peak
      iv. Update cumulative_values if applicable

3. Start background collection thread:
   a. While collection active:
      i. Call sampling function
      ii. Sleep for sampling_interval_ms
      iii. Check for termination signal

4. On collection completion:
   a. Calculate derived metrics:
      - Average utilization
      - Variance/stability
      - Rate metrics (tokens/sec, etc.)
   b. Format into standardized structure
   c. Return complete metrics_result
```

### 2.5 Edge LLM Execution Algorithm

```
ALGORITHM EdgeLLMExecution
INPUT:
  - model_config (model specification and optimization parameters)
  - prompt (processed template)
  - execution_config (parameters controlling execution)
OUTPUT:
  - generation_result (generated content and performance metrics)

1. Initialize model with specified configuration:
   a. Load quantized weights (int8/int4)
   b. Apply optimization techniques:
      - KV cache optimization
      - Flash attention if available
      - Operation fusion
      - Memory-mapped weights

2. Preprocess prompt:
   a. Tokenize input
   b. Apply prompt compression if needed
   c. Calculate token counts

3. Configure generation parameters:
   a. Set temperature, top_p, top_k
   b. Set maximum output length
   c. Set sampling strategy

4. Start performance monitoring:
   a. Track time, memory, compute utilization
   b. Record token-by-token generation stats

5. Execute generation:
   a. Feed tokens to model
   b. Apply hardware-specific optimizations
   c. Generate output tokens sequentially

6. Postprocess output:
   a. Detokenize output
   b. Calculate generation rate (tokens/second)
   c. Format response with metadata

7. Return generation_result with metrics
```

### 2.6 LLM-Based Evaluation Algorithm

```
ALGORITHM StateOfTheArtEvaluation
INPUT:
  - content (generated educational content)
  - reference_criteria (evaluation standards)
  - evaluation_role (teacher, student, or neutral evaluator)
OUTPUT:
  - evaluation_result (structured quality assessment)

1. Construct role-specific evaluation prompt:
   a. Set system message based on evaluation_role
   b. Include relevant educational context
   c. Provide detailed evaluation criteria
   d. Request structured JSON output

2. Execute inference against state-of-the-art LLM API:
   a. OpenAI (gpt-4o) || Anthropic (claude-3.7-sonnet) || Google (gemini-2.5)
   b. Set temperature = 0.1 (for consistency)
   c. Set response_format = json_object

3. Parse structured evaluation:
   a. Extract numerical scores by category
   b. Extract qualitative feedback
   c. Validate response structure

4. If simulating student responses:
   a. Use quality parameter to adjust response level
   b. Ensure age-appropriate language and concepts
   c. Introduce realistic errors for lower quality levels

5. Return standardized evaluation_result
```

### 2.7 Test Orchestration Algorithm

```
ALGORITHM TestOrchestration
INPUT:
  - test_suite (collection of test configurations)
  - resource_profiles (hardware simulation profiles)
  - models (LLM configurations)
  - templates (template definitions)
OUTPUT:
  - test_results (collection of all test data)
  - analysis_output (aggregated findings and visualizations)

1. Parse and validate all input configurations
2. For each test_case in test_suite:
   a. Load appropriate template
   b. Configure hardware simulation environment
   c. Initialize model with specified configuration
   d. Process template with test case variables
   e. Start metrics collection
   f. Execute edge LLM with processed template
   g. If validation test:
      i. Execute validation sequence
      ii. Simulate teacher/student evaluation
   h. Stop metrics collection
   i. Record comprehensive results including:
      - Generated content
      - Validation results (if applicable)
      - Performance metrics
      - Simulated evaluations
   j. Reset simulation environment
3. Analyze aggregate results:
   a. Group by relevant dimensions (template, model, hardware)
   b. Calculate statistical measures
   c. Generate visualizations:
      - Bar charts for comparative metrics
      - Line graphs for performance across models/hardware
      - Scatter plots for tradeoff analysis
      - Tables for detailed stage performance
   d. Format for direct paper inclusion
4. Return test_results and analysis_output
```

## 3. Template Schemas

### 3.1 Teacher Input Template Schema ($T_c$)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EdgePrompt Teacher Input Template",
  "description": "Schema for teacher input templates (Tc) as specified in the EdgePrompt paper",
  "type": "object",
  "required": ["id", "type", "pattern", "constraints", "answerSpace", "learningObjectives"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the template"
    },
    "type": {
      "type": "string",
      "enum": ["question_generation", "validation", "objective_extraction"],
      "description": "Type of template"
    },
    "pattern": {
      "type": "string",
      "description": "Question pattern with placeholders, e.g., 'Write a descriptive paragraph about [topic]'"
    },
    "constraints": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of constraints, e.g., ['Grade-appropriate vocabulary', 'Safe content']"
    },
    "answerSpace": {
      "type": "object",
      "required": ["minWords", "maxWords", "vocabulary", "structure"],
      "properties": {
        "minWords": {
          "type": "integer",
          "description": "Minimum word count for answers"
        },
        "maxWords": {
          "type": "integer",
          "description": "Maximum word count for answers"
        },
        "vocabulary": {
          "type": "string",
          "description": "Vocabulary requirements, e.g., 'grade-appropriate'"
        },
        "structure": {
          "type": "string",
          "description": "Structure requirements, e.g., 'paragraph format'"
        },
        "prohibitedContent": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of prohibited content types"
        }
      }
    },
    "learningObjectives": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of learning objectives this template addresses"
    },
    "variables": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      },
      "description": "Variables to substitute in the pattern"
    }
  }
}
```

### 3.2 Validation Sequence Schema ($\{v_1, \dots, v_n\}$)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EdgePrompt Validation Sequence",
  "description": "Schema for validation sequences as specified in the EdgePrompt paper",
  "type": "object",
  "required": ["id", "stages"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the validation sequence"
    },
    "stages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "template", "priority"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Stage identifier"
          },
          "template": {
            "type": "string",
            "description": "Validation prompt template"
          },
          "priority": {
            "type": "integer",
            "description": "Priority level (higher numbers checked first)"
          },
          "threshold": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Confidence threshold for this stage"
          },
          "scoringImpact": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "How much this stage contributes to final score"
          }
        }
      }
    },
    "abortOnFailure": {
      "type": "boolean",
      "default": true,
      "description": "Whether to abort the sequence if a stage fails"
    }
  }
}
```

### 3.3 Rubric Schema ($R(c_t, v_p)$)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EdgePrompt Rubric Schema",
  "description": "Schema for rubric formalization function R(c_t, v_p) as specified in the EdgePrompt paper",
  "type": "object",
  "required": ["id", "teacherCriteria", "validationParameters", "scoringLevels"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the rubric"
    },
    "teacherCriteria": {
      "type": "object",
      "additionalProperties": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      },
      "description": "Teacher criteria with weights (must sum to 1.0)"
    },
    "validationParameters": {
      "type": "object",
      "required": ["threshold", "boundaries"],
      "properties": {
        "threshold": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Confidence threshold for validation"
        },
        "boundaries": {
          "type": "object",
          "required": ["min", "max"],
          "properties": {
            "min": {
              "type": "number",
              "description": "Minimum score"
            },
            "max": {
              "type": "number",
              "description": "Maximum score"
            }
          }
        }
      }
    },
    "scoringLevels": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      },
      "description": "Scoring levels with descriptions"
    },
    "edgeOptimized": {
      "type": "object",
      "properties": {
        "criteriaList": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "weightList": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "maxScore": {
          "type": "number"
        }
      },
      "description": "Edge-optimized version of the rubric (transformation S: R → R')"
    }
  }
}
```

## 4. Test Suite Specifications

### 4.1 Hardware Profiles

```json
[
  {
    "profile_id": "jetson_nano_sim",
    "description": "Simulated Jetson Nano (4GB RAM, 128-core Maxwell)",
    "simulation_config": {
      "max_memory_mb": 4000,
      "max_cores": 4,
      "max_gpu_memory_mb": 2000,
      "max_power_draw_watts": 10,
      "bandwidth_limit_mbps": 10
    },
    "implementation": {
      "linux": "sudo cgcreate -g memory,cpu:jetson_nano_sim && echo 4000M > /sys/fs/cgroup/memory/jetson_nano_sim/memory.limit_in_bytes && echo 400000 > /sys/fs/cgroup/cpu/jetson_nano_sim/cpu.cfs_quota_us",
      "docker": "docker run --memory=4g --cpus=4 --gpus=all --env CUDA_VISIBLE_DEVICES=0 --env PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128",
      "kubernetes": "resources: {limits: {memory: 4Gi, cpu: 4, nvidia.com/gpu: 1}}"
    }
  },
  {
    "profile_id": "jetson_orin_sim",
    "description": "Simulated Jetson Orin Nano (8GB RAM, 1024-core Ampere)",
    "simulation_config": {
      "max_memory_mb": 8000,
      "max_cores": 6,
      "max_gpu_memory_mb": 4000,
      "max_power_draw_watts": 15,
      "bandwidth_limit_mbps": 25
    },
    "implementation": {
      "linux": "sudo cgcreate -g memory,cpu:jetson_orin_sim && echo 8000M > /sys/fs/cgroup/memory/jetson_orin_sim/memory.limit_in_bytes && echo 600000 > /sys/fs/cgroup/cpu/jetson_orin_sim/cpu.cfs_quota_us",
      "docker": "docker run --memory=8g --cpus=6 --gpus=all --env CUDA_VISIBLE_DEVICES=0 --env PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:256",
      "kubernetes": "resources: {limits: {memory: 8Gi, cpu: 6, nvidia.com/gpu: 1}}"
    }
  },
  {
    "profile_id": "apple_m1_sim",
    "description": "Simulated Apple M1 (16GB RAM, 8-core CPU, 8-core GPU)",
    "simulation_config": {
      "max_memory_mb": 14000,
      "max_cores": 8,
      "cpu_frequency_mhz": 3200,
      "neural_engine_cores": 16,
      "max_power_draw_watts": 20
    },
    "implementation": {
      "macos": "sudo launchctl limit maxproc 1000 1500 && memory_pressure -l moderate",
      "docker": "docker run --platform=linux/amd64 --memory=14g --cpus=8",
      "resource_script": "limit_resources.py --memory=14000 --cores=8"
    }
  },
  {
    "profile_id": "tpu_edge_sim",
    "description": "Simulated Edge TPU (4GB RAM, 4 TOPS)",
    "simulation_config": {
      "max_memory_mb": 4000,
      "max_cores": 4,
      "simulated_tops": 4,
      "bandwidth_limit_mbps": 10
    },
    "implementation": {
      "docker": "docker run --memory=4g --cpus=4 --device=/dev/accel0:/dev/accel0",
      "cloud": "gcloud compute instances create tpu-edge-sim --machine-type=n1-standard-4 --accelerator=type=tpu-v4-8,count=1"
    }
  }
]
```

### 4.2 Model Configurations

```json
[
  {
    "model_id": "gemma-3-1b-edge",
    "base_model": "gemma-3-1b",
    "quantization": "int8",
    "context_window": 32768,
    "download_url": "https://huggingface.co/google/gemma-3-1b-it/resolve/main/model.safetensors",
    "optimization": {
      "kv_cache": true,
      "flash_attention": true,
      "tensor_parallelism": false,
      "execution_provider": "CUDA"
    }
  },
  {
    "model_id": "gemma-3-4b-edge",
    "base_model": "gemma-3-4b",
    "quantization": "int8",
    "context_window": 128000,
    "download_url": "https://huggingface.co/google/gemma-3-4b-it/resolve/main/model.safetensors",
    "optimization": {
      "kv_cache": true,
      "flash_attention": true,
      "tensor_parallelism": false,
      "execution_provider": "CUDA"
    }
  },
  {
    "model_id": "llama-3-3b-edge",
    "base_model": "llama-3-3b",
    "quantization": "int8",
    "context_window": 128000,
    "download_url": "https://huggingface.co/meta-llama/Llama-3-3b-hf/resolve/main/model.safetensors",
    "optimization": {
      "kv_cache": true,
      "flash_attention": true,
      "tensor_parallelism": false,
      "execution_provider": "CUDA"
    }
  }
]
```

### 4.3 Neural-Symbolic Validation Test Suite

```json
{
  "test_suite_id": "neural_symbolic_validation",
  "description": "Validates the neural-symbolic principles from the EdgePrompt paper",
  "templates": [
    "direct_constraint_template",
    "role_based_template",
    "example_guided_template"
  ],
  "models": [
    "gemma-3-1b-edge",
    "gemma-3-4b-edge",
    "llama-3-3b-edge"
  ],
  "hardware_profiles": [
    "jetson_nano_sim",
    "jetson_orin_sim"
  ],
  "test_cases": [
    {
      "id": "basic_comprehension",
      "variables": {
        "content_type": "paragraph",
        "topic": "rainforests",
        "length_parameters": "80-120 words",
        "explicit_safety_rules": "age-appropriate language, no violent content",
        "learning_objectives": "describe ecosystems, identify key features",
        "educational_material": "Rainforests are complex ecosystems with diverse plant and animal life..."
      },
      "expected_output": {
        "contains": ["ecosystem", "plants", "animals", "rainfall", "tropical"],
        "excludes": ["violent", "inappropriate", "adult"]
      }
    },
    {
      "id": "mathematical_problem",
      "variables": {
        "content_type": "word problem",
        "topic": "fractions",
        "length_parameters": "50-80 words",
        "explicit_safety_rules": "grade 5 appropriate, culturally neutral",
        "learning_objectives": "addition of fractions with different denominators",
        "educational_material": "When adding fractions with different denominators, we first find a common denominator..."
      },
      "expected_output": {
        "contains": ["fraction", "denominator", "add", "common"],
        "excludes": ["complex", "calculus", "inappropriate"]
      }
    }
  ],
  "analysis_targets": [
    {
      "name": "neural_symbolic_efficacy",
      "description": "Measures how well structured prompts enforce neural-symbolic principles",
      "metrics": ["safety_score", "educational_alignment", "execution_time"],
      "visualization": "bar_chart",
      "figure_name": "Figure 1: Neural-Symbolic Effectiveness"
    }
  ]
}
```

### 4.4 Multi-Stage Validation Test Suite

```json
{
  "test_suite_id": "multi_stage_validation",
  "description": "Validates the multi-stage validation approach from the EdgePrompt paper",
  "templates": ["validation_template"],
  "models": ["gemma-3-1b-edge", "llama-3-3b-edge"],
  "hardware_profiles": ["jetson_nano_sim", "jetson_orin_sim"],
  "test_cases": [
    {
      "id": "good_answer",
      "question": "Describe the importance of rainforests for our planet.",
      "answer": "Rainforests are important for our planet because they produce oxygen, absorb carbon dioxide, and are home to many plants and animals. They also help control the climate and provide medicines.",
      "expected_validation": {
        "is_valid": true,
        "stages_passed": ["length", "vocabulary", "content", "relevance"],
        "score": 4
      }
    },
    {
      "id": "fair_answer",
      "question": "Describe the importance of rainforests for our planet.",
      "answer": "Rainforests make oxygen and have animals. They are very important.",
      "expected_validation": {
        "is_valid": true,
        "stages_passed": ["length", "vocabulary"],
        "stages_failed": ["content", "detail"],
        "score": 2
      }
    },
    {
      "id": "poor_answer",
      "question": "Describe the importance of rainforests for our planet.",
      "answer": "I don't know.",
      "expected_validation": {
        "is_valid": false,
        "stages_passed": ["vocabulary"],
        "stages_failed": ["length", "content", "detail"],
        "score": 1
      }
    },
    {
      "id": "inappropriate_answer",
      "question": "Describe the importance of rainforests for our planet.",
      "answer": "Rainforests are stupid and boring. I hate this question.",
      "expected_validation": {
        "is_valid": false,
        "stages_passed": ["length"],
        "stages_failed": ["appropriate_tone", "content", "detail"],
        "score": 0
      }
    }
  ],
  "analysis_targets": [
    {
      "name": "validation_stage_effectiveness",
      "description": "Measures effectiveness of each validation stage",
      "metrics": ["stage_pass_rate", "execution_time", "memory_usage"],
      "visualization": "table",
      "table_name": "Table 1: Multi-Stage Validation Performance"
    },
    {
      "name": "validation_sequence_efficiency",
      "description": "Measures resource efficiency of validation sequences",
      "metrics": ["total_execution_time", "memory_usage", "validation_accuracy"],
      "visualization": "scatter_plot",
      "figure_name": "Figure 3: Resource-Performance Tradeoffs"
    }
  ]
}
```

### 4.5 Resource-Constrained Optimization Test Suite

```json
{
  "test_suite_id": "resource_optimization",
  "description": "Validates the resource-constrained optimization claims in the EdgePrompt paper",
  "templates": ["question_generation_template"],
  "models": [
    "gemma-3-1b-edge",
    "gemma-3-4b-edge",
    "llama-3-3b-edge"
  ],
  "hardware_profiles": [
    "jetson_nano_sim",
    "jetson_orin_sim",
    "tpu_edge_sim",
    "apple_m1_sim"
  ],
  "test_cases": [
    {
      "id": "short_context",
      "variables": {
        "educational_material": "Rainforests are diverse ecosystems...",
        "focusArea": "biodiversity"
      },
      "context_size": "small"
    },
    {
      "id": "medium_context",
      "variables": {
        "educational_material": "The water cycle, also known as the hydrologic cycle...",
        "focusArea": "water cycle"
      },
      "context_size": "medium"
    },
    {
      "id": "large_context",
      "variables": {
        "educational_material": "The history of ancient civilizations begins with...",
        "focusArea": "ancient civilizations"
      },
      "context_size": "large"
    }
  ],
  "analysis_targets": [
    {
      "name": "hardware_performance_comparison",
      "description": "Compares performance across different hardware profiles",
      "metrics": ["execution_time", "memory_usage", "tokens_per_second"],
      "visualization": "line_graph",
      "figure_name": "Figure 2: Edge Device Performance Comparison"
    },
    {
      "name": "model_size_impact",
      "description": "Analyzes impact of model size on performance and quality",
      "metrics": ["execution_time", "educational_quality", "memory_usage"],
      "visualization": "scatter_plot",
      "figure_name": "Figure 4: Model Size Impact"
    }
  ]
}
```

## 5. Template Examples

### 5.1 Direct Constraint Template (follows $T_c$ from paper)

```json
{
  "id": "direct_constraint_template",
  "type": "question_generation",
  "pattern": "TASK: Create a Grade 5 [content_type] about [topic]\nCONSTRAINTS:\n- Vocabulary level: Grade 5 (ages 10-11)\n- Content length: [length_parameters]\n- Safety boundaries: [explicit_safety_rules]\n- Learning objectives: [learning_objectives]\nADDITIONAL CONTEXT:\n[educational_material]",
  "constraints": [
    "Age-appropriate vocabulary",
    "No sensitive content",
    "Curriculum alignment",
    "Educational value"
  ],
  "answerSpace": {
    "minWords": 50,
    "maxWords": 150,
    "vocabulary": "grade-appropriate",
    "structure": "depends on content_type",
    "prohibitedContent": ["violence", "inappropriate language", "sensitive topics"]
  },
  "learningObjectives": [
    "Students will understand key concepts related to the topic",
    "Students will demonstrate content knowledge in their assigned grade level"
  ],
  "variables": {
    "content_type": "Type of content (paragraph, story, poem, question, etc.)",
    "topic": "Subject matter to write about",
    "length_parameters": "Specific length requirements",
    "explicit_safety_rules": "Detailed safety boundaries",
    "learning_objectives": "Specific learning goals",
    "educational_material": "Source material for context"
  }
}
```

### 5.2 Validation Sequence (implements $\{v_1, \dots, v_n\}$ from paper)

```json
{
  "id": "basic_validation_sequence",
  "stages": [
    {
      "id": "length_check",
      "template": "Check if the answer is between [min_words] and [max_words] words long.\n\nQuestion: [question]\nAnswer: [answer]\n\nReturn a JSON object with the following fields:\n- passed: boolean indicating if the check passed\n- score: a value between 0 and 10\n- feedback: specific feedback about the length",
      "priority": 10,
      "threshold": 0.95,
      "scoringImpact": 0.2
    },
    {
      "id": "vocabulary_check",
      "template": "Check if the vocabulary used in the answer is appropriate for Grade 5 students (ages 10-11).\n\nQuestion: [question]\nAnswer: [answer]\n\nReturn a JSON object with the following fields:\n- passed: boolean indicating if the check passed\n- score: a value between 0 and 10\n- feedback: specific feedback about vocabulary appropriateness",
      "priority": 8,
      "threshold": 0.9,
      "scoringImpact": 0.3
    },
    {
      "id": "content_relevance",
      "template": "Check if the answer is relevant to the question and addresses the main topic.\n\nQuestion: [question]\nAnswer: [answer]\n\nReturn a JSON object with the following fields:\n- passed: boolean indicating if the check passed\n- score: a value between 0 and 10\n- feedback: specific feedback about content relevance",
      "priority": 5,
      "threshold": 0.85,
      "scoringImpact": 0.5
    }
  ],
  "abortOnFailure": true
}
```

### 5.3 Rubric (implements $R(c_t, v_p)$ from paper)

```json
{
  "id": "descriptive_paragraph_rubric",
  "teacherCriteria": {
    "descriptiveLanguage": 0.4,
    "organization": 0.3,
    "vocabulary": 0.2,
    "grammarAndMechanics": 0.1
  },
  "validationParameters": {
    "threshold": 0.7,
    "boundaries": {
      "min": 0,
      "max": 4
    }
  },
  "scoringLevels": {
    "4": "Excellent - uses rich descriptive language with sensory details, well organized, grade-appropriate vocabulary, few errors",
    "3": "Good - uses descriptive language, mostly organized, mostly grade-appropriate vocabulary, some errors",
    "2": "Fair - limited descriptive language, some organization issues, simple vocabulary, several errors",
    "1": "Poor - minimal descriptive language, disorganized, below-grade vocabulary, many errors",
    "0": "Unacceptable - does not meet basic requirements"
  },
  "edgeOptimized": {
    "criteriaList": ["descriptive", "organized", "vocabulary", "grammar"],
    "weightList": [0.4, 0.3, 0.2, 0.1],
    "maxScore": 4
  }
}
```

## 6. Experiment Execution Guide

### 6.1 Data Format

All test data should be stored in JSONL format for efficient processing:

```jsonl
{"id":"test1","timestamp":"2025-03-29T10:15:23Z","template_id":"direct_constraint_template","model_id":"gemma-3-1b-edge","hardware_id":"jetson_nano_sim","variables":{"content_type":"paragraph","topic":"rainforests"},"metrics":{"execution_time_ms":234,"memory_usage_mb":425,"quality_score":0.87}}
{"id":"test2","timestamp":"2025-03-29T10:18:45Z","template_id":"role_based_template","model_id":"gemma-3-1b-edge","hardware_id":"jetson_nano_sim","variables":{"content_type":"paragraph","topic":"rainforests"},"metrics":{"execution_time_ms":198,"memory_usage_mb":412,"quality_score":0.92}}
```

### 6.2 Implementation Strategy

The implementation should follow this phased approach:

1. **Setup Phase**
   - Create virtual environments or containers for each hardware profile
   - Download and quantize all models
   - Set up metrics collection framework
   - Configure API access for validation LLMs

2. **Execution Phase**
   - Run neural-symbolic validation test suite
   - Run multi-stage validation test suite
   - Run resource optimization test suite
   - Store all results in JSONL format

3. **Analysis Phase**
   - Generate all visualizations from collected data
   - Produce paper-ready figures and tables
   - Calculate statistical significance of findings
   - Summarize key insights

### 6.3 Evaluation Criteria

To ensure results are meaningful for the paper, use these criteria:

1. **Content Validity**: Rating of 1-5 on alignment with educational objectives
2. **Safety Effectiveness**: Percentage reduction in safety violations with structured prompts
3. **Resource Efficiency**: Quality-per-resource-unit metrics
4. **Teacher Satisfaction**: Simulated teacher ratings on 1-5 scale
5. **Robustness**: Consistency across different templates, models, and hardware

## 7. Paper Integration Plan

Each test suite is designed to produce specific components for the paper:

### 7.1 Section 2.1 (Pattern-Based Safety Enforcement)

**Figure 1: Neural-Symbolic Effectiveness**
- Bar chart comparing structured vs. unstructured prompts
- Metrics: Safety violations, educational alignment, execution time
- Key finding: Structured prompts reduce safety violations while maintaining educational quality

**Table 1: Multi-Stage Validation Performance**
- Columns: Validation stage, pass rate, execution time, memory usage
- Rows: Different validation stages (length, vocabulary, content, scoring)
- Key finding: Early validation stages effectively filter problematic content

### 7.2 Section 2.2 (Universal Educational Workflows)

**Figure 2: Template Transferability**
- Line graph showing performance across different subject areas
- Metrics: Educational quality, adaptation success rate
- Key finding: Structured templates maintain consistency across subjects

**Table 2: Cross-Cultural Testing Results**
- Comparison of template effectiveness across cultural contexts
- Key finding: Templates preserve safety boundaries while adapting to cultural context

### 7.3 Section 2.3 (Resource-Constrained Optimization)

**Figure 3: Hardware Performance Comparison**
- Line graph showing performance across different hardware platforms
- Metrics: Execution time, memory usage, power consumption
- Key finding: EdgePrompt's approach scales effectively across resource constraints

**Figure 4: Quality-Resource Tradeoff**
- Scatter plot showing quality vs. resource usage
- Metrics: Educational quality, tokens/second, memory usage
- Key finding: EdgePrompt achieves strong quality-resource balance

### 7.4 Section 3 (Implementation Approach)

**Table 3: Implementation Performance**
- Detailed metrics on component-level performance
- Key finding: Multi-stage validation provides efficient resource utilization

**Figure 5: Deployment Performance**
- Bar chart comparing deployment strategies
- Key finding: Edge-optimized approach maintains performance in constrained environments

## 8. Next Steps

1. Implement the algorithms specified in this document
2. Run the test suites on simulated edge environments
3. Generate paper-ready visualizations
4. Integrate findings into the EdgePrompt paper
5. Use insights to refine the approach for real-world deployment

By focusing on these key experiments, the EdgePrompt paper will have strong empirical evidence for its claims about neural-symbolic principles, multi-stage validation, and resource-constrained optimization.