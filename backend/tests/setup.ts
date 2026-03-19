// Jest setup file for backend tests
import dotenv from 'dotenv';

// Load test environment variables (fallback to .env if .env.test doesn't exist)
dotenv.config({ path: '.env.test' });
dotenv.config({ path: '.env' });

// Ensure API_KEY is set for tests
process.env.API_KEY = process.env.API_KEY || 'test-api-key-for-ci';

// Set default test timeout
jest.setTimeout(30000);

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};
