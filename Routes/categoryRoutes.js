const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Category routes
router.get('/', CategoryController.getAllCategories); // Get all categories
router.get('/:id', CategoryController.getCategoryById); // Get category by ID
router.post('/', CategoryController.createCategory); // Create a new category
router.put('/:id', CategoryController.updateCategory); // Update category by ID
router.delete('/:id', CategoryController.deleteCategory); // Delete category by ID

module.exports = router;
