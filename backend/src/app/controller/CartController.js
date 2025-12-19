const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Variant = require("../models/Variants");

class CartController {
  async getMyCart(req, res) {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId }).populate({
      path: "cartItems",
      populate: {
        path: "variantId",
        select: "nameDetail price image stock productId",
        populate: {
          path: "productId", 
          select: "name",
        },
      },
    });

    if (!cart)
      return res.status(200).json({});

    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ message: error.message });
  }
}


  async addToCart(req, res) {
    try {
      const userId = req.user.userId;
      const { variantId, quantity } = req.body;

      // kiểm tra variant
      const variant = await Variant.findById(variantId);
      if (!variant)
        return res.status(404).json({ message: "Không tìm thấy variant" });

      // tìm giỏ hàng của user
      let cart = await Cart.findOne({ userId });
      if (!cart) cart = new Cart({ userId, cartItems: [], totalPrice: 0 });

      // kiểm tra item đã tồn tại chưa
      let existingItem = await CartItem.findOne({
        _id: { $in: cart.cartItems },
        variantId,
      });
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
      } else {
        const newItem = new CartItem({ variantId, quantity });
        await newItem.save();
        cart.cartItems.push(newItem._id);
      }

      await cart.save();
      // Cập nhật tổng tiền
      const allItems = await CartItem.find({
        _id: { $in: cart.cartItems },
      }).populate("variantId", "price");
      cart.totalPrice = allItems.reduce(
        (sum, i) => sum + i.variantId.price * i.quantity,
        0
      );
      await cart.save();

      res.status(200).json({ message: "Đã thêm vào giỏ hàng", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCartItem(req, res) {
    try {
      // Lấy id item từ URL params
      const { cartItemId } = req.params;
      // Lấy thông tin cập nhật từ body
      const { quantity, variantId } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!quantity && !variantId) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập ít nhất một trường để cập nhật" });
      }

      // Tìm cart item trong database
      const cartItem = await CartItem.findById(cartItemId);
      if (!cartItem) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }

      // Nếu có variantId mới, kiểm tra xem variant đó có tồn tại không
      if (variantId) {
        const variant = await Variant.findById(variantId);
        if (!variant) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy variant cần cập nhật" });
        }
        cartItem.variantId = variantId;
      }

      // Nếu có quantity mới, kiểm tra hợp lệ rồi cập nhật
      if (quantity !== undefined) {
        if (quantity <= 0) {
          return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
        }
        cartItem.quantity = quantity;
      }

      // Lưu thay đổi
      await cartItem.save();

      // Populate lại dữ liệu để trả về chi tiết variant
      const updatedItem = await CartItem.findById(cartItem._id).populate(
        "variantId",
        "name price color size image"
      );

      const cart = await Cart.findOne({ cartItems: cartItemId });
      const allItems = await CartItem.find({
        _id: { $in: cart.cartItems },
      }).populate("variantId", "price");
      cart.totalPrice = allItems.reduce(
        (sum, i) => sum + i.variantId.price * i.quantity,
        0
      );
      await cart.save();

      return res.status(200).json({
        cart,
        message: "Cập nhật giỏ hàng thành công",
        cartItem: updatedItem,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async removeCartItem(req, res) {
    try {
      const { cartItemId } = req.params;
      const cart = await Cart.findOne({ cartItems: cartItemId });
      if (!cart)
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

      cart.cartItems = cart.cartItems.filter(
        (id) => id.toString() !== cartItemId
      );
      await CartItem.findByIdAndDelete(cartItemId);

      const allItems = await CartItem.find({
        _id: { $in: cart.cartItems },
      }).populate("variantId", "price");
      cart.totalPrice = allItems.reduce(
        (sum, i) => sum + i.variantId.price * i.quantity,
        0
      );

      await cart.save();

      res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.userId;
      const cart = await Cart.findOne({ userId });
      if (!cart)
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

      await CartItem.deleteMany({ _id: { $in: cart.cartItems } });
      cart.cartItems = [];
      cart.totalPrice = 0;
      await cart.save();

      res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
