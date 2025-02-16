import axios from "axios";


// Signup API
export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};
