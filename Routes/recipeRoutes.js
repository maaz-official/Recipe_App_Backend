const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/RecipeController');

// Recipe routes
router.get('/', RecipeController.getAllRecipes); // Get all recipes
router.get('/published', RecipeController.getPublishedRecipes); // Get published recipes
router.get('/:id', RecipeController.getRecipeById); // Get recipe by ID
router.post('/', RecipeController.createRecipe); // Create a new recipe
router.put('/:id', RecipeController.updateRecipe); // Update recipe by ID
router.delete('/:id', RecipeController.deleteRecipe); // Delete recipe by ID
router.post('/publish/:id', RecipeController.publishRecipe); // Publish a recipe
router.get('/category/:categoryId', RecipeController.getRecipesByCategory); // Get recipes by category
router.get('/tag/:tagId', RecipeController.getRecipesByTag); // Get recipes by tag
router.post('/:id/like', RecipeController.likeRecipe); // Like a recipe
router.delete('/:id/unlike', RecipeController.unlikeRecipe); // Unlike a recipe

module.exports = router;
