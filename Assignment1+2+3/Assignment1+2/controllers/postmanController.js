const Category = require('../models/category');
const Product = require('../models/product');
const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class PostmanController {
    async getAllCategories(req, res) {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories', error });
        }
    }

    async createCategory(req, res) {
        try {
            const category = new Category(req.body);
            const savedCategory = await category.save();
            res.status(201).json(savedCategory);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Error creating category', error });
        }
    }

    async updateCategory(req, res) {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (updatedCategory) {
                res.status(200).json(updatedCategory);
            } else {
                res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Error updating category', error });
        }
    }

    async deleteCategory(req, res) {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (deletedCategory) {
                await Product.deleteMany({ categoryId: req.params.id });
                res.status(200).json({ message: 'Danh mục đã được xóa!' });
            } else {
                res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Error deleting category', error });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await Product.find().populate('categoryId');
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products', error });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id).populate('categoryId');
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
            }
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ message: 'Error fetching product', error });
        }
    }

    async createProduct(req, res) {
        try {
            const product = new Product(req.body);
            const savedProduct = await product.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Error creating product', error });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (updatedProduct) {
                res.status(200).json(updatedProduct);
            } else {
                res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Error updating product', error });
        }
    }
    

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (deletedProduct) {
                res.status(200).json({ message: 'Sản phẩm đã được xóa!' });
            } else {
                res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Error deleting product', error });
        }
    }

    async register(req, res) {
        try {
            const { username, password } = req.body;
            const existingAccount = await Account.findOne({ username });
            if (existingAccount) {
                return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });
            }

            const saltRounds = 10;
            // const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newAccount = new Account({ username, password });
            await newAccount.save();

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const account = await Account.findOne({ username });
            if (!account) {
                return res.status(401).json({ error: 'Sai tên người dùng hoặc mật khẩu' });
            }

            const passwordMatch = await bcrypt.compare(password, account.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Sai tên người dùng hoặc mật khẩu' });
            }

            const secretKey = 'SECRET_KEY';
            const token = jwt.sign({ userId: account._id }, secretKey, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Đăng nhập thành công', token });
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    logout(req, res) {
        res.clearCookie('token');
        res.status(200).json({ message: 'Đăng xuất thành công' });
    }

    authenticateJWT(req, res, next) {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, 'SECRET_KEY', (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    }
}

module.exports = new PostmanController();