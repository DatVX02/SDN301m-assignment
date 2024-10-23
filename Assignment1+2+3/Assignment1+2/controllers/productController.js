const Product = require('../models/product');
const Category = require('../models/category');

class ProductController {
    async getAll(req, res) {
        try {
            const products = await Product.find().populate('categoryId');
            const categories = await Category.find();

            if (req.originalUrl.startsWith('/dashboard')) {
                res.render('product', { products, categories });
            } else {
                res.status(200).json(products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).render('error', { message: 'Error fetching products', error });
        }
    }

    async getById(req, res) {
        try {
            const product = await Product.findById(req.params.id).populate('categoryId');
            if (product) {
                if (req.originalUrl.startsWith('/dashboard')) {
                    res.render('productDetail', { product });
                } else {
                    res.status(200).json(product);
                }
            } else {
                res.status(404).json({ message: 'Product does not exist!' });
            }
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            res.status(500).render('error', { message: 'Error fetching product by ID', error });
        }
    }

    async create(req, res) {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.redirect('/dashboard/products');
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).render('error', { message: 'Error creating product', error });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params; // Get the product ID from the route parameters
            const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
            if (updatedProduct) {
                // Redirect to the product list after successful update for dashboard requests
                if (req.originalUrl.startsWith('/dashboard')) {
                    res.redirect('/dashboard/products');
                } else {
                    // Respond with the updated product for API requests
                    res.status(200).json(updatedProduct);
                }
            } else {
                res.status(404).json({ message: 'Product does not exist!' });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).render('error', { message: 'Error updating product', error });
        }
    }
    

    async delete(req, res) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (deletedProduct) {
                res.redirect('/dashboard/products');
            } else {
                res.status(404).json({ message: 'Product does not exist!' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).render('error', { message: 'Error deleting product', error });
        }
    }
}

module.exports = new ProductController();
