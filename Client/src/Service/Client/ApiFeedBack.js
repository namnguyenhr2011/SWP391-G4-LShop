import axios from "../../utils/CustomizeApi";  // Đảm bảo axios được cấu hình đúng

export const addFeedback = async (feedbackData) => {
  try {
    // Sửa lại URL cho đúng với API backend
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