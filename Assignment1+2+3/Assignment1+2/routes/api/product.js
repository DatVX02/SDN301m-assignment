const express = require('express');
const router = express.Router();
const postmanController = require('../../controllers/postmanController');

router.get('/', postmanController.authenticateJWT, postmanController.getAllProducts);

router.get('/:id', postmanController.authenticateJWT, postmanController.getProductById);

router.post('/', postmanController.authenticateJWT, postmanController.createProduct);

router.put('/:id', postmanController.authenticateJWT, postmanController.updateProduct);

router.delete('/:id', postmanController.authenticateJWT, postmanController.deleteProduct);

module.exports = router;