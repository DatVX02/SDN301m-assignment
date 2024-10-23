const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.showLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.showRegisterPage = (req, res) => {
    res.render('register', { error: null });
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.render('register', { error: 'Tên người dùng đã tồn tại' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAccount = new Account({ username, password: hashedPassword });
        await newAccount.save();

        res.redirect('/dashboard/auth/login');
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.render('error', { message: 'Lỗi khi đăng ký', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const account = await Account.findOne({ username });
        if (!account) {
            return res.render('login', { error: 'Sai tên người dùng hoặc mật khẩu' });
        }

        const passwordMatch = await bcrypt.compare(password, account.password);
        if (!passwordMatch) {
            return res.render('login', { error: 'Sai tên người dùng hoặc mật khẩu' });
        }

        const secretKey = 'SECRET_KEY';
        const token = jwt.sign({ userId: account._id }, secretKey, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard/products');
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.render('error', { message: 'Lỗi khi đăng nhập', error });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/dashboard/auth/login');
};

exports.authenticateJWT = (req, res, next) => {
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
        res.redirect('/dashboard/auth/login');
    }
};