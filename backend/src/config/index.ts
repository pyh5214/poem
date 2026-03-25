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
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  adminEmail: process.env.ADMIN_EMAIL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
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

  if (!config.googleOAuth.clientId || !config.googleOAuth.clientSecret) {
    console.warn('Warning: Google OAuth credentials not configured.');
    console.warn('Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env for authentication.');
  } else {
    console.log('Google OAuth configured.');
  }

  if (config.jwt.secret === 'default-secret-change-in-production') {
    console.warn('Warning: Using default JWT secret. Set JWT_SECRET in production!');
  } else {
    console.log('JWT secret is configured.');
  }

  if (!config.adminEmail) {
    console.warn('Warning: ADMIN_EMAIL not set. Admin features may be limited.');
  } else {
    console.log('Admin email configured:', config.adminEmail);
  }
};
