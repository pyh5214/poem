import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  apiKey: process.env.API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  uploadsDir: path.join(__dirname, '../../uploads'),
  openai: {
    model: 'gpt-4o-mini',
    maxTokens: 500,
    timeout: 60000,
    apiUrl: 'https://api.openai.com/v1/chat/completions'
  },
  vertexAI: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    model: 'lyria-002',
    timeout: 120000,
    musicDuration: 32.8, // Lyria outputs 32.8 seconds
  },
  // Legacy config for backward compatibility
  gemini: {
    model: 'lyria-002',
    musicDuration: 32.8,
    timeout: 120000
  }
};

export const validateConfig = (): void => {
  if (!config.apiKey) {
    console.error('Warning: API_KEY is not set.');
    console.error('Create a backend/.env file and add:');
    console.error('PORT=5000');
    console.error('API_KEY=your_openai_api_key_here');
  } else {
    console.log('OpenAI API key is configured.');
  }

  if (!config.vertexAI.projectId) {
    console.error('Warning: GOOGLE_CLOUD_PROJECT is not set.');
    console.error('Add GOOGLE_CLOUD_PROJECT to your .env file for music generation.');
    console.error('Also ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account key.');
  } else {
    console.log('Vertex AI project configured:', config.vertexAI.projectId);
    console.log('Vertex AI location:', config.vertexAI.location);
  }
};
