const express = require("express");
const router = express.Router();
const UserController = require("../app/controller/UserController");
const { verifyUser, verifyAdmin } = require("../config/middleware/authJWT");

router.get("/getAll", verifyUser, verifyAdmin, UserController.getAllUsers);
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/current",verifyUser, UserController.current);
router.put("/edit", verifyUser, UserController.editUser);
router.put("/changePassword", verifyUser, UserController.changePassword);
router.delete("/remove", verifyUser, verifyAdmin, UserController.removeUser);

module.exports = router;
