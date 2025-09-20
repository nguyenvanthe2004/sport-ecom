const express = require('express');
const router = express.Router();
const CategoriesController = require('../app/controller/CategoriesController');

router.get('/getAll', CategoriesController.getAllCategories);

module.exports = router;
