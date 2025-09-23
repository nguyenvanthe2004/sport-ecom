const express = require("express");
const router = express.Router();
const UserController = require("../app/controller/UserController");
const { verifyUser, verifyAdmin } = require("../config/middleware/authJWT");

router.get("/getAll", verifyUser, verifyAdmin, UserController.getAllUsers);
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/current",verifyUser, UserController.current);

module.exports = router;
