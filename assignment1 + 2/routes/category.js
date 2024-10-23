const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Create category
router.post('/', async (req, res) => {
  const category = new Category(req.body);
  try {
    await category.save();
    res.status(201).send(category);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Read all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    res.status(500).send('Error fetching categories');
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.send(category);
  } catch (err) {
    res.status(500).send('Error fetching category');
  }
});

// Update category by ID
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.send(category);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.send('Category deleted');
  } catch (err) {
    res.status(500).send('Error deleting category');
  }
});

module.exports = router;
