const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth'); 
const router = express.Router();
const Category = require('../models/Category');
// Create a product
router.post('/', auth, async (req, res) => {
    const { name, price, categoryId } = req.body;

    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).send('Invalid category ID');
        }

        // Create a new product
        const product = new Product({
            name,
            price,
            category: categoryId
        });          

        await product.save();
        res.status(201).send(product);
        // res.status(201).send({
        //     _id: product._id,
        //     name: product.name.toUpperCase(),
        //     price: product.price,
        //     category: product.category
        // });
    } catch (err) {
        res.status(500).send('Error creating product: ' + err.message);
    }
});

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

// Get a specific product by ID
router.get('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id).populate('category', 'name');
        console.log(product.name);
        product.name = product.name + product.price;
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send('Error fetching product: ' + err.message);
    }
});

// Update a product by ID
router.put('/:id', auth, async (req, res) => {
    const { name, price, categoryId } = req.body;

    try {
        // Check if the category exists
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).send('Invalid category ID');
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, category: categoryId },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.status(200).send(product);
    } catch (err) {
        res.status(500).send('Error updating product: ' + err.message);
    }
});

// Delete a product by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.status(200).send('Product deleted');
    } catch (err) {
        res.status(500).send('Error deleting product: ' + err.message);
    }
});

module.exports = router;
