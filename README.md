# EdgePrompt

EdgePrompt is a framework for implementing pragmatic guardrails for Large Language Models (LLMs) in K-12 educational settings through structured prompting inspired by neuro-symbolic principles.

## Features

- 🚀 Edge-first architecture for offline LLM usage
- 📚 Support for multiple file formats (PDF, Word, Markdown, Text)
- 🌍 Multi-language support with automatic language detection
- 🎯 Focus area-driven content analysis
- 🔒 Structured content validation
- 📝 Automated question generation
- ✅ Built-in assessment capabilities

## Getting Started

### Prerequisites

- Node.js 18+
- LM Studio running locally
- TypeScript 5.0+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/build-club-ai-indonesia/edge-prompt
cd edge-prompt
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start LM Studio and load your preferred model

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## Usage

1. Upload Teaching Material
   - Select a file (PDF, Word, Markdown, or Text)
   - Specify the focus area for content analysis
   - Optionally enable source language matching for generated content
   - Add optional metadata (title, subject, grade level, chapter)

2. Content Analysis
   - Automatic extraction of learning objectives
   - Generation of question templates
   - Word count analysis

3. Question Generation
   - Select from suggested templates
   - Add custom constraints
   - Set validation rules
   - Generate questions with context awareness

4. Student Interface
   - Answer generated questions
   - Receive instant feedback
   - View scoring and explanations

## Architecture

```
edge-prompt/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── LMStudioService.ts    # LLM integration
│   │   │   ├── MaterialProcessor.ts   # Content processing
│   │   │   └── ValidationService.ts   # Answer validation
│   │   └── types/
│   │       └── index.ts              # Shared types
└── frontend/
    └── src/
        └── components/
            └── teacher/
                ├── ContentGenerator.tsx   # Question generation
                └── MaterialUploader.tsx   # File handling
```

## Features in Detail

### Content Processing
- Automatic text extraction from multiple file formats
- Smart content truncation for LLM context limits
- Focus area-driven learning objective extraction
- Language-aware content generation

### Question Generation
- Template-based question creation
- Constraint-driven generation
- Context-aware question formulation
- Multi-language support

### Validation
- Structured answer validation
- Scoring parameter customization
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
