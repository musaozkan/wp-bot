import api from "./BaseService";

// Check Session
export const checkSession = async () => {
  try {
    const response = await api.get("/users/check-session");
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Login
export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.delete("/users/logout");
    return response;
  } catch (error) {
    return error.response.data;
  }
};
