import axios from "../../utils/CustomizeApi"; 

export const addFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`feedback/addFeedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw new Error("Unable to add feedback.");
  }
};

export const getFeedbackByProductId = async (productId) => {
  try {
    const response = await axios.get(`feedback/getFeedback/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting feedback by product ID:", error);
    throw new Error("Unable to get feedback by product ID.");
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await axios.delete(`feedback/deleteFeedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw new Error("Unable to delete feedback.");
  }
};


