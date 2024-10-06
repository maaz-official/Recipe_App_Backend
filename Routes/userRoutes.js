// routes/userRoutes.js
import express from 'express';
import UserController from '../controllers/UserController.js'; // Ensure the correct path
import { protect, admin } from '../middleware/index.js'; // Import the protect middleware

const router = express.Router();

// User routes

// Get all users (protected route, admin access can be enforced here)
router.get('/', protect, admin, UserController.getAllUsers); 

// Get user by ID (protected route)
router.get('/:id', protect, UserController.getUserById); 

// Create a new user (can be accessible without protection, e.g., for admin use)
router.post('/create', UserController.createUser); 

// Update user by ID (protected route)
router.put('/:id', protect, UserController.updateUser); 

// Delete user by ID (protected route)
router.delete('/:id', protect, admin, UserController.deleteUser); 

// User login (no protection, open for all)
router.post('/login', UserController.loginUser); 

// Add a recipe to user's favorites (protected route)
router.post('/favorites/:userId/:recipeId', protect, UserController.addFavoriteRecipe); 

// Remove a recipe from user's favorites (protected route)
router.delete('/favorites/:userId/:recipeId', protect, UserController.removeFavoriteRecipe); 

export default router; // Use export default for ES6 module
