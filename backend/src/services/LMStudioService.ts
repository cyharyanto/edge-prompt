import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class LMStudioService {
  private baseUrl: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(baseUrl?: string) {
    const url = baseUrl || process.env.LM_STUDIO_URL;
    if (!url) {
      throw new Error('LM_STUDIO_URL environment variable is not set');
    }
    this.baseUrl = url;
    console.log('LM Studio URL:', this.baseUrl);
  }

  async complete(prompt: string): Promise<string> {
    try {
      console.log('Sending prompt to LM Studio:', prompt);
      
      const response = await axios.post(`${this.baseUrl}/v1/chat/completions`, {
        messages: [
          {
            role: "system",
            content: "You are an educational assessment AI that provides structured feedback in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "local-model", // LM Studio will use whatever model is loaded
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      });

      console.log('LM Studio raw response:', response.data);
      
      // Extract the actual response text from the chat completion
      const responseText = response.data.choices[0].message.content;
      console.log('Extracted response:', responseText);
      
      return responseText;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('LM Studio error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          url: this.baseUrl
        });
      } else {
        console.error('LM Studio error:', error);
      }
      throw new Error('Failed to get completion from LM Studio');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      console.log('Checking LM Studio availability at:', this.baseUrl);
      const response = await axios.get(`${this.baseUrl}/v1/models`);
      console.log('LM Studio models:', response.data);
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('LM Studio connection error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          url: this.baseUrl
        });
      } else {
        console.error('LM Studio connection error:', error);
      }
      return false;
    }
  }

  getConfig() {
    return {
      apiUrl: this.baseUrl,
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens
    };
  }
} 