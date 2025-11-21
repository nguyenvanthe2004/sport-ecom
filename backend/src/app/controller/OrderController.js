const Order = require("../models/Orders");
const OrderDetail = require("../models/OrderDetails");
const Payment = require("../models/Payments");
const Variant = require("../models/Variants");
const path = require("path");

class OrderController {
  async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalOrders = await Order.countDocuments();

      const orders = await Order.find()
        .populate("userId", "fullname email")
        .populate({
          path: "orderItems",
          populate: { path: "variantId", select: "name price image" },
        })
        .populate("paymentId", "paymentMethod")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalPages = Math.ceil(totalOrders / limit);

      res.status(200).json({ page, limit, totalPages, totalOrders, orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getUserOrders(req, res) {
    try {
      const userId = req.user.userId;

      const orders = await Order.find({ userId })
        .populate({
          path: "orderItems",
          populate: {
            path: "variantId",
            select: "nameDetail price image productId",
            populate: {
              path: "productId",
              select: "name",
            },
          },
        })
        .populate("paymentId", "paymentMethod");

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("userId", "fullname email")
        .populate({
          path: "orderItems",
          populate: { path: "variantId", select: "name price image" },
        })
        .populate("paymentId", "paymentMethod");

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const { orderItems, shippingAddress, paymentMethod } = req.body;
      const userId = req.user.userId;

      if (!orderItems || orderItems.length === 0) {
        return res
          .status(400)
          .json({ message: "Không có sản phẩm nào trong đơn hàng" });
      }

      const payment = new Payment({
        userId,
        paymentMethod,
      });
      await payment.save();

      const order = new Order({
        userId,
        orderItems: [],
        totalPrice: 0,
        status: "pending",
        shippingAddress,
        paymentStatus: "unpaid",
        shipping: 0,
        paymentId: payment._id,
      });
      await order.save();

      let totalPrice = 0;
      const orderDetailIds = [];

      for (const item of orderItems) {
        const variant = await Variant.findById(item.variantId);
        if (!variant) {
          return res
            .status(404)
            .json({ message: `Không tìm thấy biến thể ${item.variantId}` });
        }

        const price = variant.price * item.quantity;
        totalPrice += price;

        const updated = await Variant.findOneAndUpdate(
          { _id: item.variantId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({ message: "Sản phẩm không đủ hàng!" });
        }
        
        const orderDetail = new OrderDetail({
          orderId: order._id,
          variantId: item.variantId,
          quantity: item.quantity,
          price,
        });

        await orderDetail.save();
        orderDetailIds.push(orderDetail._id);
      }

      order.orderItems = orderDetailIds;
      order.totalPrice = totalPrice;
      await order.save();

      res.status(201).json({
        message: "Đặt hàng thành công!",
        order,
      });
    } catch (error) {
      console.error("❌ Lỗi createOrder:", error);
      res.status(500).json({ message: error.message });
    }
  }
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status, paymentStatus } = req.body;
      const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      order.status = status;
      order.paymentStatus = paymentStatus || order.paymentStatus;
      await order.save();

      res
        .status(200)
        .json({ message: "Cập nhật trạng thái thành công", order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async deleteOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      console.log(orderId);

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      await OrderDetail.deleteMany({ orderId: orderId });
      await Order.findByIdAndDelete(orderId);
      await Payment.findByIdAndDelete(order.paymentId);

      res.status(200).json({ message: "Đã xóa đơn hàng thành công" });
    } catch (error) {
      console.error("❌ Lỗi khi xóa đơn hàng:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
