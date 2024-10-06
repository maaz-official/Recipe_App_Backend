const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

// Comment/Review routes
router.get('/recipe/:recipeId', CommentController.getCommentsByRecipe); // Get comments by recipe
router.get('/user/:userId', CommentController.getCommentsByUser); // Get comments by user
router.get('/:id', CommentController.getCommentById); // Get comment by ID
router.post('/:recipeId', CommentController.createComment); // Create a new comment for a recipe
router.put('/:id', CommentController.updateComment); // Update comment by ID
router.delete('/:id', CommentController.deleteComment); // Delete comment by ID

module.exports = router;
