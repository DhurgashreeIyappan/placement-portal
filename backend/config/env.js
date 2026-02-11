/**
 * Load and validate environment variables.
 * Must be imported first, before any code that uses process.env.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend directory (works when running from project root or backend)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Copy backend/.env.example to backend/.env and set the values.');
  process.exit(1);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI.trim(),
  JWT_SECRET: process.env.JWT_SECRET.trim(),
  FRONTEND_URL: process.env.FRONTEND_URL?.trim() || 'http://localhost:5173',
};
