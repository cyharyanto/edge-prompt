import express from 'express';
import cors from 'cors';
import { ValidationService } from './services/ValidationService';
import { LMStudioService } from './services/LMStudioService';

const app = express();
app.use(cors());
app.use(express.json());

const lmStudio = new LMStudioService();
const validator = new ValidationService(lmStudio);

app.post('/api/validate', async (req, res): Promise<void> => {
  const { question, answer, rubric } = req.body;
  
  try {
    if (!question || !answer || !rubric) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          question: !question,
          answer: !answer,
          rubric: !rubric
        }
      });
      return;
    }

    console.log('Validation request:', { question, answer, rubric });
    
    const result = await validator.validateResponse(question, answer, rubric);
    console.log('Validation result:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/generate', async (req, res): Promise<void> => {
  const { template, rules } = req.body;
  
  try {
    if (!template || !rules) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          template: !template,
          rules: !rules
        }
      });
      return;
    }

    console.log('Generation request:', { template, rules });
    
    const prompt = `
You are an educational content generator. Please generate a question based on:
Template: ${template.pattern}
Constraints: ${template.constraints.join(', ')}
Evaluation Criteria: ${rules.criteria}

IMPORTANT: Return ONLY a valid JSON object in the following format, with NO additional text before or after:
{
  "question": string (the generated question),
  "sampleAnswer": string (an example of a good answer),
  "rubric": {
    "criteria": string[],
    "maxScore": number
  }
}
`;

    const response = await lmStudio.complete(prompt);
    console.log('Raw response:', response);

    // Extract JSON from the response by finding the first { and last }
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON object found in response');
    }

    const jsonStr = response.slice(jsonStart, jsonEnd);
    console.log('Extracted JSON string:', jsonStr);

    try {
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Invalid JSON string:', jsonStr);
      throw new Error('Failed to parse response as JSON');
    }
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/health', async (_req, res): Promise<void> => {
  try {
    const isLMStudioAvailable = await lmStudio.isAvailable();
    res.json({ 
      status: 'ok',
      lmStudio: isLMStudioAvailable 
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 