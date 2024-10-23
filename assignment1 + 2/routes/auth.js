const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAccount = new Account({ username, password: hashedPassword });

  try {
    await newAccount.save();
    res.status(201).send('Account created');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({ username });

  if (!account) return res.status(400).send('Account not found');

  const isValid = await bcrypt.compare(password, account.password);

  if (!isValid) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: account._id, username: account.username }, 'secretkey', { expiresIn: '1h' });
  res.send({ token });
});

module.exports = router;
