import api from "./BaseService";

// Create a New Numbers List
export const createNumbersList = async (listName, numbers) => {
  try {
    const response = await api.post("/numbers/create", { listName, numbers });
    return response;
  } catch (error) {
    return error;
  }
};

// Get All Lists
export const getNumbersLists = async () => {
  try {
    const response = await api.get("/numbers");
    return response;
  } catch (error) {
    return error;
  }
};

// Get a Specific List
export const getNumbers = async (listName) => {
  try {
    const response = await api.get(`/numbers/${listName}`);
    return response;
  } catch (error) {
    return error;
  }
};

// Add a Number to an Existing List
export const addNumberToList = async (listName, number) => {
  try {
    const response = await api.put(`/numbers/add-number/`, {
      listName,
      number,
    });
    return response;
  } catch (error) {
    return error;
  }
};

// Remove a Number from a List
export const removeNumberFromList = async (listName, number) => {
  try {
    const response = await api.put(`/numbers/remove-number/`, {
      listName,
      number,
    });
    return response;
  } catch (error) {
    return error;
  }
};

// Delete a List
export const deleteNumbersList = async (listName) => {
  try {
    const response = await api.delete(`/numbers/${listName}`);
    return response;
  } catch (error) {
    return error;
  }
};
