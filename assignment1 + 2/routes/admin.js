const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const router = express.Router();

// Middleware to authenticate tokens
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/dashboard/login');
  }
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.redirect('/dashboard/login');
    req.user = user;
    next();
  });
}

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Account.findOne({ username });
  if (!user) {
    return res.render('login', { error: 'Invalid credentials', title: 'Login' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.render('login', { error: 'Invalid credentials', title: 'Login' });
  }

  const token = jwt.sign({ _id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.cookie('token', token);
  res.redirect('/dashboard');
});


// Render login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: undefined }); // Ensure error is passed
});
// Render register page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});


// Handle register form submission
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new account
    const newUser = new Account({ username, password: hashedPassword });
    await newUser.save();

    res.redirect('/dashboard/login');
});


// Render dashboard (protected route)
router.get('/', authenticateToken, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/dashboard/login');
});

module.exports = router;
