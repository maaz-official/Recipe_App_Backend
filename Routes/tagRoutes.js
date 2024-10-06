const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

// Tag routes
router.get('/', TagController.getAllTags); // Get all tags
router.get('/:id', TagController.getTagById); // Get tag by ID
router.post('/', TagController.createTag); // Create a new tag
router.put('/:id', TagController.updateTag); // Update tag by ID
router.delete('/:id', TagController.deleteTag); // Delete tag by ID
router.get('/recipes/:tagId', TagController.getRecipesByTag); // Get all recipes by tag

module.exports = router;
