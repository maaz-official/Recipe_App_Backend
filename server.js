// Welcome TO HELL

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { userRoutes } from './routes/index.js'; // Import user routes from the index file
import { errorHandler } from './middleware/index.js'; // Import error handling middleware
import connectDB from './config/db.js'; // Import the database connection function
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Security middleware
app.use(helmet());

// Cross origin connection add your frontend here
app.use(cors());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/users', userRoutes); // Routes for users
// app.use('/api/recipes', recipeRoutes); // Uncomment when implementing recipe routes
// app.use('/api/categories', categoryRoutes); // Uncomment when implementing category routes
// app.use('/api/comments', commentRoutes); // Uncomment when implementing comment routes
// app.use('/api/likes', likeRoutes); // Uncomment when implementing like routes
// app.use('/api/tags', tagRoutes); // Uncomment when implementing tag routes

// Error Handling Middleware (after defining routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
