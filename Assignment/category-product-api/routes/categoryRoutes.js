const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CRUD routes for categories
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
