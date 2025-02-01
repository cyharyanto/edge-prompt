# EdgePrompt

EdgePrompt is a prompt engineering framework that implements pragmatic guardrails for Large Language Models (LLMs) in K-12 educational settings through structured prompting. The system enables offline-capable content safety controls, particularly designed for Indonesia's Underdeveloped, Frontier, and Outermost (3T) regions.

## Features

- 🛡️ **Content Safety Controls**: Implements structured prompt-based controls enforcing content boundaries
- 🔄 **Multi-stage Validation**: Sequential prompt-based checks for content verification
- 💻 **Edge Deployment**: Optimized for resource-constrained environments
- 🌐 **Offline Capability**: Functions without persistent internet connectivity
- 📚 **Educational Focus**: Specifically designed for K-12 assessment systems

## Architecture

The system implements three main components as described in the research paper:

1. **Teacher-Driven Content Generation**
   - Domain-constrained content templates
   - Answer space specification
   - Formal learning objective mapping

2. **Student Answers Evaluation**
   - Edge validation protocol
   - Multi-stage response validation
   - Boundary enforcement

3. **Teacher Verification Protocol**
   - Response analysis
   - System adaptation
   - Calibration tracking

## Prerequisites

- Node.js (v14 or higher)
- LM Studio (running on port 1234)
- Git

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/edge-prompt.git
cd edge-prompt
```

2. Start LM Studio and ensure it's running on http://localhost:1234

3. Run the setup script:
```bash
chmod +x run.sh
./run.sh
```

The script will:
- Install dependencies for both frontend and backend
- Start the development servers
- Check LM Studio connectivity

## Manual Setup

If you prefer manual setup:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
edge-prompt/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── teacher/     # Teacher interface components
│   │   │   └── student/     # Student interface components
│   │   └── App.tsx          # Main application component
│   └── package.json
│
├── backend/                  # Express server
│   ├── src/
│   │   ├── services/        # Core services
│   │   │   ├── ValidationService.ts
│   │   │   └── LMStudioService.ts
│   │   └── index.ts         # Server entry point
│   └── package.json
│
└── run.sh                    # Setup and run script
```

## API Endpoints

### Content Generation
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "string",
  "constraints": "string[]"
}
```

### Response Validation
```http
POST /api/validate
Content-Type: application/json

{
  "question": "string",
  "answer": "string",
  "rubric": "string"
}
```

## Development

### Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=3001
LM_STUDIO_URL=http://localhost:1234
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Research Paper

This implementation is based on the research paper "EdgePrompt: Engineering Guardrail Techniques for Offline LLMs in K-12 Educational Settings". The paper outlines the theoretical framework and validation strategies implemented in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- BuildClub.ai as the training campus for AI learners, experts, builders
- Indonesian Ministry of Education for providing educational resources
- Contributors to the research paper and implementation

## Contact

- Riza Alaudin Syah - alaudinsyah@graduate.utm.my
- Christoforus Yoga Haryanto - cyharyanto@zipthought.com.au

Project Link: [https://github.com/cyharyanto/edge-prompt](https://github.com/cyharyanto/edge-prompt)
