// controllers/LikeController.js
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc   Fetch all likes for a specific recipe
// @route  GET /api/likes/recipe/:recipeId
// @access Public
const getAllLikesForRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId).populate('likes', 'name');

    if (recipe) {
        res.status(200).json({
            recipe: recipe.name,
            totalLikes: recipe.likes.length,
            users: recipe.likes, // List of users who liked the recipe
        });
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Fetch all likes made by a specific user
// @route  GET /api/likes/user/:userId
// @access Public
const getLikesByUser = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({ likes: req.params.userId }).select('name');

    if (recipes.length > 0) {
        res.status(200).json(recipes);
    } else {
        res.status(404).json({ message: 'No likes found for this user' });
    }
});

// @desc   Like a specific recipe
// @route  POST /api/likes/:recipeId
// @access Private (User)
const likeRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (recipe) {
        if (!recipe.likes.includes(req.user._id)) {
            recipe.likes.push(req.user._id);
            await recipe.save();
            res.status(200).json({ message: 'Recipe liked' });
        } else {
            res.status(400).json({ message: 'Recipe already liked' });
        }
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Unlike a specific recipe
// @route  DELETE /api/likes/:recipeId
// @access Private (User)
const unlikeRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (recipe) {
        if (recipe.likes.includes(req.user._id)) {
            recipe.likes = recipe.likes.filter((userId) => userId.toString() !== req.user._id.toString());
            await recipe.save();
            res.status(200).json({ message: 'Recipe unliked' });
        } else {
            res.status(400).json({ message: 'Recipe not liked yet' });
        }
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

module.exports = {
    getAllLikesForRecipe,
    getLikesByUser,
    likeRecipe,
    unlikeRecipe,
};
