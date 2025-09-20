const express = require('express');
const router = express.Router();
const VariantController = require('../app/controller/VariantController');

router.get('/getAll', VariantController.getAllVariants);

module.exports = router;
