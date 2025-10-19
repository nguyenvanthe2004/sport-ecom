import axios from "axios";

const API_URL_USER = "http://localhost:8000/user";


export const login = async (email, password) => {
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

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL_USER}/current`, {
    withCredentials: true,
  });
  return response.data;
};

