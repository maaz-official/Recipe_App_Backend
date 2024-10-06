// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure the path is correct
import asyncHandler from './asyncHandler.js';

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach it to the request, excluding the password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Middleware to check for admin role
const admin = (req, res, next) => {
    // Check if user is authenticated and has admin role
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

// Export the middlewares
export { protect, admin };
