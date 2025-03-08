# EdgePrompt

EdgePrompt is a secure framework for implementing pragmatic guardrails for Large Language Models (LLMs) in K-12 educational settings through structured prompting, based on a backend-first architecture.

## Features

- 🔒 Secure backend-focused architecture with proper data isolation
- 🚀 Edge-first design for offline LLM usage
- 📚 Support for multiple file formats (PDF, Word, Markdown, Text)
- 🌍 Multi-language support with automatic language detection
- 🎯 Focus area-driven content analysis
- 📊 Structured prompt templates with database persistence
- 📝 Backend-managed question generation with rubrics
- ✅ Multi-stage answer validation system

## Architecture

EdgePrompt follows a secure architecture where:

1. **Backend owns all sensitive logic**:
   - All LLM interactions happen on the backend
   - Content processing and validation are isolated from the frontend
   - Template management is database-driven
   - Multi-stage validation occurs server-side

2. **Frontend handles presentation only**:
   - User interface components for material management
   - Project and template selection
   - Question display and student responses
   - Feedback presentation

This design ensures:
- No prompt injection vulnerabilities
- Proper data isolation and security
- Consistent validation across all content
- Reliable prompt template management

## Getting Started

### Prerequisites

- Node.js 18+
- LM Studio running locally with a supported model
- SQLite (included automatically)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/build-club-ai-indonesia/edge-prompt
cd edge-prompt
```

2. Install all dependencies and run database migrations:
```bash
# Install all dependencies and set up database
npm install
npm run build:common
```

3. Start LM Studio and load your preferred model

4. Start the development servers:
```bash
# Start both backend and frontend
./run.sh

# You can customize the LM Studio URL if running on another machine:
./run.sh --lm-studio-url=http://192.168.68.114:1234
```

### Additional Options

- If you encounter issues or need to customize the setup:
  The run.sh script automatically:
  - Detects if you're running in WSL and finds the Windows host IP
  - Sets up the LM Studio URL in backend/.env
  - Installs dependencies and builds packages
  - Manages process cleanup when stopping the server

```bash
# If you need to run parts of the system manually:
cd backend && npm run dev  # Run only the backend
cd frontend && npm run dev # Run only the frontend

# Run database migrations manually if needed
cd backend && npm run migrate
```

## Usage

1. **Create a Project**
   - Create a project with a name and description
   - Select the model being used in LM Studio
   - Choose a prompt template for content generation

2. **Upload Learning Material**
   - Select a file (PDF, Word, Markdown, or Text)
   - Specify the focus area for content analysis
   - Optionally enable source language matching
   - Add optional metadata (title, subject, grade level, chapter)

3. **Content Analysis & Question Generation**
   - View extracted learning objectives
   - Preview suggested question templates
   - Generate questions from templates
   - Review automatically generated rubrics

4. **Student Interface**
   - Answer generated questions
   - Submit responses for validation
   - Receive feedback based on the rubric
   - View scores and detailed explanations

## Database Schema

EdgePrompt uses SQLite for data persistence with the following key tables:

- **projects**: Stores project information and configuration
- **prompt_templates**: Contains prompt templates for different generation tasks
- **materials**: Stores uploaded learning materials and metadata
- **generated_questions**: Contains questions generated from materials
- **responses**: Stores student responses and validation results

## Directory Structure

```
edge-prompt/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/       # Database migrations
│   │   │   ├── schema.sql        # Database schema
│   │   │   └── index.ts          # Database access methods
│   │   ├── services/
│   │   │   ├── DatabaseService.ts   # Database operations
│   │   │   ├── LMStudioService.ts   # LLM integration
│   │   │   ├── MaterialProcessor.ts # Content processing
│   │   │   ├── StorageService.ts    # File management
│   │   │   └── ValidationService.ts # Answer validation
│   │   └── index.ts              # API endpoints
└── frontend/
    └── src/
        ├── components/
        │   ├── common/           # Common UI components
        │   ├── project/          # Project management
        │   ├── prompt/           # Prompt template UI
        │   ├── teacher/          # Teacher interfaces
        │   └── student/          # Student interfaces
        ├── contexts/             # React contexts
        ├── services/             # API client services
        └── types/                # TypeScript type definitions
```

## Features in Detail

### Content Processing
- Secure file upload and storage
- Automatic text extraction from multiple formats
- Focus area-driven learning objective extraction
- Multi-language support for content generation

### Question Generation
- Template-based question creation
- Backend-managed rubric generation
- Context-aware question formulation
- Automatic database persistence

### Validation
- Multi-stage answer validation
- Secure rubric-based assessment
- Detailed feedback generation
- Language-matched response evaluation

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [BuildClub.ai](https://www.buildclub.ai/) - Training campus for AI learners
- [LM Studio](https://lmstudio.ai/) - Local LLM runtime
- Contributors and maintainers

## Research

For more details about the methodology and research behind EdgePrompt, please refer to our paper:
[EdgePrompt: Engineering Guardrails for Offline LLMs in K-12 Educational Settings](https://github.com/build-club-ai-indonesia/edge-prompt/blob/main/paper.pdf)
