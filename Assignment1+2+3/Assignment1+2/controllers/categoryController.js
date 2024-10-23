const Category = require('../models/category');
const Product = require('../models/product');

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await Category.find();
            if (req.originalUrl.startsWith('/dashboard')) {
                res.render('category', { categories });
            } else if (req.originalUrl.startsWith('/api')) {
                res.render('categoryView', { categories });
            } else {
                res.status(200).json(categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.render('error', { message: 'Error fetching categories', error });
        }
    }


    async create(req, res) {
        try {
            const category = new Category(req.body);
            const savedCategory = await category.save();
            res.redirect('/dashboard/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            res.render('error', { message: 'Error creating category', error });
        }
    }

    async update(req, res) {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (updatedCategory) {
                res.redirect('/dashboard/categories');
            } else {
                res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }
        } catch (error) {
            console.error('Error updating category:', error);
            res.render('error', { message: 'Error updating category', error });
        }
    }

    async delete(req, res) {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (deletedCategory) {
                await Product.deleteMany({ categoryId: req.params.id });
                res.redirect('/dashboard/categories');
            } else {
                res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.render('error', { message: 'Error deleting category', error });
        }
    }
}

module.exports = new CategoryController();