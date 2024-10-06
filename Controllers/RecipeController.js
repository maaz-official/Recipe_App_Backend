// controllers/RecipeController.js
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc   Fetch all recipes
// @route  GET /api/recipes
// @access Public
const getAllRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({}).populate('category').populate('author', 'name');
    res.status(200).json(recipes);
});

// @desc   Fetch a single recipe by ID
// @route  GET /api/recipes/:id
// @access Public
const getRecipeById = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('category').populate('author', 'name');

    if (recipe) {
        res.status(200).json(recipe);
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Create a new recipe
// @route  POST /api/recipes
// @access Private (Admin/User)
const createRecipe = asyncHandler(async (req, res) => {
    const { name, description, category, ingredients, instructions, cookingTime, difficulty, servings, image, nutrition } = req.body;

    const recipe = new Recipe({
        name,
        description,
        category,
        ingredients,
        instructions,
        cookingTime,
        difficulty,
        servings,
        image,
        nutrition,
        author: req.user._id, // Attach the logged-in user as the author
        isPublished: false, // Default to unpublished
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
});

// @desc   Update recipe details
// @route  PUT /api/recipes/:id
// @access Private (Admin/User)
const updateRecipe = asyncHandler(async (req, res) => {
    const { name, description, category, ingredients, instructions, cookingTime, difficulty, servings, image, nutrition } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
        // Update recipe fields
        recipe.name = name || recipe.name;
        recipe.description = description || recipe.description;
        recipe.category = category || recipe.category;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.cookingTime = cookingTime || recipe.cookingTime;
        recipe.difficulty = difficulty || recipe.difficulty;
        recipe.servings = servings || recipe.servings;
        recipe.image = image || recipe.image;
        recipe.nutrition = nutrition || recipe.nutrition;

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Delete a recipe
// @route  DELETE /api/recipes/:id
// @access Private (Admin/User)
const deleteRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
        await recipe.remove();
        res.status(200).json({ message: 'Recipe removed' });
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Mark a recipe as published
// @route  POST /api/recipes/publish/:id
// @access Private (Admin)
const publishRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
        recipe.isPublished = true;
        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc   Fetch only published recipes
// @route  GET /api/recipes/published
// @access Public
const getPublishedRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({ isPublished: true }).populate('category').populate('author', 'name');
    res.status(200).json(recipes);
});

// @desc   Fetch recipes by a specific category
// @route  GET /api/recipes/category/:categoryId
// @access Public
const getRecipesByCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.categoryId);

    if (category) {
        const recipes = await Recipe.find({ category: category._id, isPublished: true }).populate('author', 'name');
        res.status(200).json(recipes);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc   Fetch recipes by a specific tag
// @route  GET /api/recipes/tag/:tagId
// @access Public
const getRecipesByTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.tagId);

    if (tag) {
        const recipes = await Recipe.find({ tags: tag._id, isPublished: true }).populate('author', 'name');
        res.status(200).json(recipes);
    } else {
        res.status(404);
        throw new Error('Tag not found');
    }
});

// @desc   Like a recipe
// @route  POST /api/recipes/:id/like
// @access Private (User)
const likeRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

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

// @desc   Unlike a recipe
// @route  DELETE /api/recipes/:id/unlike
// @access Private (User)
const unlikeRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
        if (recipe.likes.includes(req.user._id)) {
            recipe.likes = recipe.likes.filter((userId) => userId.toString() !== req.user._id.toString());
            await recipe.save();
            res.status(200).json({ message: 'Recipe unliked' });
        } else {
            res.status(400).json({ message: 'Recipe not liked' });
        }
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    publishRecipe,
    getPublishedRecipes,
    getRecipesByCategory,
    getRecipesByTag,
    likeRecipe,
    unlikeRecipe,
};
