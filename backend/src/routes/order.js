const express = require('express');
const router = express.Router();
const OrderController = require('../app/controller/OrderController');
const { verifyUser, verifyAdmin } = require('../config/middleware/authJWT');

router.get('/getAll', verifyUser, verifyAdmin, OrderController.getAllOrders);
router.get("/myOrders", verifyUser, OrderController.getUserOrders);
router.get("/:orderid", verifyUser, OrderController.getOrderById);
router.post("/create", verifyUser, OrderController.createOrder);
router.put("/update/:orderId", verifyUser, verifyAdmin, OrderController.updateOrderStatus);
router.delete("/delete/:orderId", verifyUser, verifyAdmin, OrderController.deleteOrder);


module.exports = router;
