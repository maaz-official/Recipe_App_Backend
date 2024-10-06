// controllers/CommentController.js
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc   Fetch all comments for a specific recipe
// @route  GET /api/comments/recipe/:recipeId
// @access Public
const getCommentsByRecipe = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ recipe: req.params.recipeId }).populate('user', 'name');

    if (comments.length > 0) {
        res.status(200).json(comments);
    } else {
        res.status(404);
        throw new Error('No comments found for this recipe');
    }
});

// @desc   Fetch a single comment by ID
// @route  GET /api/comments/:id
// @access Public
const getCommentById = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id).populate('user', 'name');

    if (comment) {
        res.status(200).json(comment);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

// @desc   Add a new comment or review
// @route  POST /api/comments/:recipeId
// @access Private (User)
const createComment = asyncHandler(async (req, res) => {
    const { content, rating } = req.body;
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    const newComment = new Comment({
        user: req.user._id, // Attach logged-in user
        recipe: recipe._id, // Attach the recipe ID
        content,
        rating,
    });

    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
});

// @desc   Update a comment
// @route  PUT /api/comments/:id
// @access Private (User)
const updateComment = asyncHandler(async (req, res) => {
    const { content, rating } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        // Ensure the logged-in user owns the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this comment');
        }

        // Update comment fields
        comment.content = content || comment.content;
        comment.rating = rating || comment.rating;

        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

// @desc   Delete a comment
// @route  DELETE /api/comments/:id
// @access Private (User/Admin)
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        // Ensure the logged-in user owns the comment or is an admin
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to delete this comment');
        }

        await comment.remove();
        res.status(200).json({ message: 'Comment removed' });
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

// @desc   Fetch all comments made by a specific user
// @route  GET /api/comments/user/:userId
// @access Public
const getCommentsByUser = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ user: req.params.userId }).populate('recipe', 'name');

    if (comments.length > 0) {
        res.status(200).json(comments);
    } else {
        res.status(404);
        throw new Error('No comments found for this user');
    }
});

module.exports = {
    getCommentsByRecipe,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
};
