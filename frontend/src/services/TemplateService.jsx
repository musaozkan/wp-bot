import api from "./BaseService";

// Get All Templates
export const getTemplates = async () => {
  try {
    const response = await api.get("/templates");
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Get Template by ID
export const getTemplateById = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Create Template
export const createTemplate = async (formData) => {
  try {
    const response = await api.post("/templates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Edit Template
export const editTemplate = async (id, formData) => {
  try {
    const response = await api.put(`/templates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Delete Template
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/templates/${id}`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
