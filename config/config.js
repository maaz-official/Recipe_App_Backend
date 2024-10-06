// config.js
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-apps', // Fallback for local development
};

export default config;
