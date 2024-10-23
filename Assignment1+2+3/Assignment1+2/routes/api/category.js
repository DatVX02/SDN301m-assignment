const express = require('express');
const router = express.Router();
const postmanController = require('../../controllers/postmanController');

router.get('/', postmanController.authenticateJWT, postmanController.getAllCategories);

router.post('/', postmanController.authenticateJWT, postmanController.createCategory);

router.put('/:id', postmanController.authenticateJWT, postmanController.updateCategory);

router.delete('/:id', postmanController.authenticateJWT, postmanController.deleteCategory);

module.exports = router;