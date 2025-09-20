const express = require('express');
const router = express.Router();
const UserController = require('../app/controller/UserController');

router.get('/getAll', UserController.getAllUsers);

module.exports = router;