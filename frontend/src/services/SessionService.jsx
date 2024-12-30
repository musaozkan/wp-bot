import api from "./BaseService";

// Create a new WhatsApp session
export const createSession = async (phoneNumber) => {
  try {
    const response = await api.post("/sessions", { phoneNumber });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Get all WhatsApp sessions
export const getSessions = async () => {
  try {
    const response = await api.get("/sessions");
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Cancel & Delete a WhatsApp session creation
export const cancelSession = async (taskId, type) => {
  try {
    const response = await api.delete(`/sessions/${taskId}?type=${type}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
