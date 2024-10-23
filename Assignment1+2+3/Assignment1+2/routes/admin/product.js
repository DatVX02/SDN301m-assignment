const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const authController = require('../../controllers/authController');

router.get('/', authController.authenticateJWT, productController.getAll);

router.post('/', authController.authenticateJWT, productController.create);

router.put('/:id', authController.authenticateJWT, productController.update);

router.delete('/:id', authController.authenticateJWT, productController.delete);

module.exports = router;