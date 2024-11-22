import api from "./BaseService";

// Get All Templates
export const getTemplates = async () => {
  try {
    const response = await api.get("/templates");
    console.log("TemplateService -> getTemplates -> response", response);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Get Template by ID
export const getTemplateById = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    console.log("TemplateService -> getTemplateById -> response", response);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

// Create Template
export const createTemplate = async (template) => {
  console.log("TemplateService -> createTemplate -> template", template);
  const formData = new FormData();
  formData.append("title", template.title);
  formData.append("message", template.message);
  if (template.image instanceof File) {
    formData.append("image", template.image);
  }
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
export const editTemplate = async (id, template) => {
  const formData = new FormData();
  formData.append("title", template.title);
  formData.append("message", template.message);
  formData.append("image", template.image);
  try {
    console.log("TemplateService -> editTemplate -> template", template);
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
