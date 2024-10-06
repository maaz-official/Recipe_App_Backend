const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/LikeController');

// Like routes
router.get('/recipe/:recipeId', LikeController.getAllLikesForRecipe); // Get all likes for a recipe
router.get('/user/:userId', LikeController.getLikesByUser); // Get all likes by a user
router.post('/:recipeId', LikeController.likeRecipe); // Like a recipe
router.delete('/:recipeId', LikeController.unlikeRecipe); // Unlike a recipe

module.exports = router;
