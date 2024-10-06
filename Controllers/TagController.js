// controllers/TagController.js
const Tag = require('../models/Tag');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc   Fetch all tags
// @route  GET /api/tags
// @access Public
const getAllTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({});
    res.status(200).json(tags);
});

// @desc   Fetch a single tag by ID
// @route  GET /api/tags/:id
// @access Public
const getTagById = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if (tag) {
        res.status(200).json(tag);
    } else {
        res.status(404);
        throw new Error('Tag not found');
    }
});

// @desc   Create a new tag
// @route  POST /api/tags
// @access Private (Admin)
const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Check if the tag already exists
    const tagExists = await Tag.findOne({ name });

    if (tagExists) {
        res.status(400);
        throw new Error('Tag already exists');
    }

    const tag = new Tag({
        name,
    });

    const createdTag = await tag.save();
    res.status(201).json(createdTag);
});

// @desc   Update tag details
// @route  PUT /api/tags/:id
// @access Private (Admin)
const updateTag = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const tag = await Tag.findById(req.params.id);

    if (tag) {
        tag.name = name || tag.name;

        const updatedTag = await tag.save();
        res.status(200).json(updatedTag);
    } else {
        res.status(404);
        throw new Error('Tag not found');
    }
});

// @desc   Delete a tag
// @route  DELETE /api/tags/:id
// @access Private (Admin)
const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if (tag) {
        await tag.remove();
        res.status(200).json({ message: 'Tag removed' });
    } else {
        res.status(404);
        throw new Error('Tag not found');
    }
});

// @desc   Fetch all recipes associated with a specific tag
// @route  GET /api/tags/recipes/:tagId
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

module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    getRecipesByTag,
};
