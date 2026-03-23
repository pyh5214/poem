import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  apiKey: process.env.API_KEY || '',
  uploadsDir: path.join(__dirname, '../../uploads'),
  openai: {
    model: 'gpt-5.4-mini',
    maxTokens: 500,
    timeout: 60000,
    apiUrl: 'https://api.openai.com/v1/chat/completions'
  }
};

export const validateConfig = (): void => {
  if (!config.apiKey) {
    console.error('Warning: API_KEY is not set.');
    console.error('Create a backend/.env file and add:');
    console.error('PORT=5000');
    console.error('API_KEY=your_openai_api_key_here');
  } else {
    console.log('API key is configured.');
  }
};
