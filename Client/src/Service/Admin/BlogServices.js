import axios from "../../utils/CustomizeApi";

// Lấy danh sách tất cả bài blog
export const getAllBlogs = async () => {
  try {
    const response = await axios.get("/blog/", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};

// Lấy chi tiết một bài blog theo ID
export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`/blog/${blogId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blog details");
  }
};

// Tạo một bài blog mới
export const createBlog = async (blogData, token) => {
  try {
    if (!token) throw new Error("No token provided");
    const response = await axios.post("/blog/", blogData, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

// Cập nhật bài blog theo ID
export const updateBlog = async (blogId, updatedData, token) => {
  try {
    if (!token) throw new Error("No token provided");
    const response = await axios.put(`/blog/${blogId}`, updatedData, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update blog");
  }
};

// Xóa bài blog theo ID
export const deleteBlog = async (blogId, token) => {
  try {
    if (!token) throw new Error("No token provided");
    const response = await axios.delete(`/blog/${blogId}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete blog");
  }
};

// Thêm bình luận cho bài blog
export const addComment = async (blogId, commentData, token) => {
  try {
    if (!token) throw new Error("No token provided");
    const response = await axios.post(`/blog/${blogId}/comment`, commentData, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add comment");
  }
};