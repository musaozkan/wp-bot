import api from "./BaseService";

// Create a new WhatsApp session
export const createSession = async (sessionName) => {
  try {
    const response = await api.post("/sessions", { sessionName });
    return response;
  } catch (error) {
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

// Cancel or Delete a WhatsApp session creation
export const cancelOrDeleteSession = async (taskId, type) => {
  try {
    const response = await api.delete(`/sessions/${taskId}?type=${type}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
