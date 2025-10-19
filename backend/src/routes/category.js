const express = require('express');
const router = express.Router();
const CategoriesController = require('../app/controller/CategoriesController');

router.get('/getAll', CategoriesController.getAllCategories);
router.post('/create', CategoriesController.createCategory);
router.put('/update/:categoryId', CategoriesController.updateCategory);
router.delete('/delete/:categoryId', CategoriesController.deleteCategory);

module.exports = router;
