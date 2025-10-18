import axios from 'axios';

const API_URL_USER = "http://localhost:8000/user";
const API_URL_UPLOAD = "http://localhost:8000/upload";
const API_URL_PRODUCT = "http://localhost:8000/product";
const API_URL_BRAND = "http://localhost:8000/brand";
const API_URL_CATEGORY = "http://localhost:8000/category";

export const login = async (email, password) => {
    console.log('Logging in with:', email, password);
    const response = await axios.post(`${API_URL_USER}/login`, { email, password }, { withCredentials: true });
    return response.data;
}

export const register = async (email, password, fullname) => {
    const response = await axios.post(`${API_URL_USER}/register`, { email, password, fullname});  
    return response.data;
}

export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL_USER}/current`, { 
        withCredentials: true,
    });
    return response.data;
}

export const UploadAPI = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL_UPLOAD}/single`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const response = await axios.post(`${API_URL_UPLOAD}/multiple`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};

export const ProductAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL_PRODUCT}/getAll`);
    return response.data;
  },
  
  create: async (productData) => {
    const response = await axios.post(`${API_URL_PRODUCT}/create`, productData,{ withCredentials: true });
    return response.data;
  },
  getbySlug: async (slug) => { 
    const response = await axios.get(`${API_URL_PRODUCT}/slug/${slug}`);
    return response.data;
  },
  update: async (productId, productData) => {
    const response = await axios.put(`${API_URL_PRODUCT}/update/${productId}`, productData);
    return response.data;
  },

  delete: async (productId) => {
    const response = await axios.delete(`${API_URL_PRODUCT}/delete/${productId}`);
    return response.data;
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
    const res = await axios.post(`${API_URL_CATEGORY}/create`, categoryData,{ withCredentials: true } )
    return res.data;
  },
  update: async (categoryId, categoryData) => {
    const response = await axios.put(`${API_URL_CATEGORY}/update/${categoryId}`, categoryData);
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await axios.delete(`${API_URL_CATEGORY}/delete/${categoryId}`);
    return response.data;
  },
};
