import { createSlice } from "@reduxjs/toolkit";
import { CartAPI } from "../../services/api";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    setCheckoutItems: (state, action) => {
      state.items = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, resetCart, setCheckoutItems } = cartSlice.actions;

export const fetchCart = () => async (dispatch) => {
  try {
    const data = await CartAPI.getMyCart();
    dispatch(setCart(data?.cartItems || []));
  } catch (error) {
    console.error("❌ Lỗi khi tải giỏ hàng:", error);
    dispatch(setCart([]));
  }
};

export const addToCart = (variant, quantity = 1) => async (dispatch) => {
  try {
    const variantId = variant?._id;

    if (!variantId) {
      console.error("❌ Không tìm thấy variantId!");
      return;
    }

    await CartAPI.addToCart(variantId, quantity);
    const data = await CartAPI.getMyCart();

    dispatch(setCart(data?.cartItems || []));
  } catch (error) {
    console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
  }
};



export const removeFromCart = (cartItemId) => async (dispatch) => {
  try {
    await CartAPI.removeCartItem(cartItemId);
    const data = await CartAPI.getMyCart();
    dispatch(setCart(data?.cartItems || []));
  } catch (error) {
    console.error("❌ Lỗi khi xóa sản phẩm khỏi giỏ:", error);
  }
};

export const updateCartQuantity = (variantId, newQuantity) => async (dispatch) => {
  try {
    await CartAPI.updateCartItem(variantId, { quantity: newQuantity });
    const data = await CartAPI.getMyCart();
    dispatch(setCart(data?.cartItems || []));
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật số lượng:", error);
  }
};

export const clearCart = () => async (dispatch) => {
  try {
    await CartAPI.clearCart();
    const data = await CartAPI.getMyCart();
    dispatch(resetCart(data?.cartItems || []));
  } catch (error) {
    console.error("❌ Lỗi khi làm trống giỏ hàng:", error);
    dispatch(resetCart());
  }
};

export default cartSlice.reducer;
