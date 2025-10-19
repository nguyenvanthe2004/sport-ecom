import axios from "axios";

const API_URL_USER = "http://localhost:8000/user";


export const login = async (email, password) => {
  const res = await axios.post(
    `${API_URL_USER}/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
};

export const register = async (email, password, fullname) => {
  const res = await axios.post(`${API_URL_USER}/register`, {
    email,
    password,
    fullname,
  });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_URL_USER}/current`, {
    withCredentials: true,
  });
  return res.data;
};

