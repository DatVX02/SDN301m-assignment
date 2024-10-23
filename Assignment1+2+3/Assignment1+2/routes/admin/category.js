const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const authController = require('../../controllers/authController');

router.get('/', authController.authenticateJWT, categoryController.getAll);

router.post('/', authController.authenticateJWT, categoryController.create);

router.put('/:id', authController.authenticateJWT, categoryController.update);

router.delete('/:id', authController.authenticateJWT, categoryController.delete);

module.exports = router;