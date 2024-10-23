const express = require('express');
const router = express.Router();
const postmanController = require('../../controllers/postmanController');

router.post('/register', postmanController.register);

router.post('/login', postmanController.login);

router.post('/logout', postmanController.logout);

module.exports = router;