import axios from "axios";
import { BASE_URL } from "../constants";

const API_URL_USER = `${BASE_URL}/user`;
const API_URL_UPLOAD = `${BASE_URL}/upload`;
const API_URL_PRODUCT = `${BASE_URL}/product`;
const API_URL_BRAND = `${BASE_URL}/brand`;
const API_URL_CATEGORY = `${BASE_URL}/category`;
const API_URL_CART = `${BASE_URL}/cart`;
const API_URL_ORDER = `${BASE_URL}/order`;

export const login = async (email, password) => {
  console.log("Logging in with:", email, password);
  const response = await axios.post(
    `${API_URL_USER}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

export const register = async (email, password, fullname) => {
  const response = await axios.post(`${API_URL_USER}/register`, {
    email,
    password,
    fullname,
  });
  return response.data;
};
export const editUser = async (email, fullname) => {
  const response = await axios.put(
    `${API_URL_USER}/edit`,
    { email, fullname },
    { withCredentials: true }
  );
  return response.data;
};
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.put(
    `${API_URL_USER}/changePassword`,
    { oldPassword: currentPassword, newPassword },
    { withCredentials: true }
  );
  return response.data;
};
export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL_USER}/getAll`, {
    withCredentials: true,
  });
  return response.data;
};
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL_USER}/current`, {
    withCredentials: true,
  });
  return response.data;
};
export const removeUser = async () => {
  const response = await axios.delete(`${API_URL_USER}/remove`, {
    withCredentials: true,
  });
  return response.data;
};

export const UploadAPI = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_URL_UPLOAD}/single`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await axios.post(`${API_URL_UPLOAD}/multiple`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },
};

export const ProductAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL_PRODUCT}/getAll`);
    return res.data;
  },
  getFiltered: async (params) => {
    const res = await axios.get(`${API_URL_PRODUCT}/filter`, { params });
    return res.data;
  },
  search: async (keyword) => {
    try {
      const res = await axios.get(`${API_URL_PRODUCT}/search`, {
        params: { q: keyword },
      });
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },
  create: async (productData) => {
    const res = await axios.post(`${API_URL_PRODUCT}/create`, productData, {
      withCredentials: true,
    });
    return res.data;
  },

  getbySlug: async (slug) => {
    const res = await axios.get(`${API_URL_PRODUCT}/slug/${slug}`);
    return res.data;
  },

  update: async (productId, productData) => {
    const res = await axios.put(
      `${API_URL_PRODUCT}/update/${productId}`,
      productData
    );
    return res.data;
  },

  delete: async (productId) => {
    const res = await axios.delete(`${API_URL_PRODUCT}/delete/${productId}`);
    return res.data;
  },
};

export const BrandAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL_BRAND}/getAll`);
    return res.data;
  },
};

export const CategoryAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL_CATEGORY}/getAll`);
    return res.data;
  },

  create: async (categoryData) => {
    const res = await axios.post(`${API_URL_CATEGORY}/create`, categoryData, {
      withCredentials: true,
    });
    return res.data;
  },

  update: async (categoryId, categoryData) => {
    const res = await axios.put(
      `${API_URL_CATEGORY}/update/${categoryId}`,
      categoryData
    );
    return res.data;
  },

  delete: async (categoryId) => {
    const res = await axios.delete(`${API_URL_CATEGORY}/delete/${categoryId}`);
    return res.data;
  },
};

export const CartAPI = {
  getMyCart: async () => {
    const res = await axios.get(`${API_URL_CART}/myCart`, {
      withCredentials: true,
    });
    return res.data;
  },

  addToCart: async (variantId, quantity = 1) => {
    const res = await axios.post(
      `${API_URL_CART}/add`,
      { variantId, quantity },
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  updateCartItem: async (cartItemId, data) => {
    const res = await axios.put(`${API_URL_CART}/update/${cartItemId}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  removeCartItem: async (cartItemId) => {
    const res = await axios.delete(`${API_URL_CART}/remove/${cartItemId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  clearCart: async () => {
    const res = await axios.delete(`${API_URL_CART}/clear`, {
      withCredentials: true,
    });
    return res.data;
  },
};
export const OrderAPI = {
  getMyOrders: async () => {
    const res = await axios.get(`${API_URL_ORDER}/myOrders`, {
      withCredentials: true,
    });
    return res.data;
  },
  getAll: async () => {
    const res = await axios.get(`${API_URL_ORDER}/getAll`, {
      withCredentials: true,
    });
    return res.data;
  },

  getById: async (orderId) => {
    const res = await axios.get(`${API_URL_ORDER}/${orderId}`, {
      withCredentials: true,
    });
    return res.data;
  },
  create: async (orderData) => {
    const res = await axios.post(`${API_URL_ORDER}/create`, orderData, {
      withCredentials: true,
    });
    return res.data;
  },
  updateStatus: async (orderId, data) => {
    const res = await axios.put(`${API_URL_ORDER}/update/${orderId}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (orderId) => {
    const res = await axios.delete(`${API_URL_ORDER}/delete/${orderId}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
