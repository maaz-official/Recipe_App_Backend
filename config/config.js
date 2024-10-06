// config.js
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const config = {
    //You Guys Enter Your Own DB Link Here
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-apps', // Fallback for local development
};

export default config;
