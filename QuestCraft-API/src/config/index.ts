import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development'
};