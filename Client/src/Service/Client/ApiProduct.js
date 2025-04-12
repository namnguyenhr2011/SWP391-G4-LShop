import axios from "../../utils/CustomizeApi";

export const getAllCategory = async () => {
    const response = await axios.get('category/getAllCategory', { withCredentials: true });
    return response.data;
};

export const getAllSubCategory = async (categoryId) => {
    const response = await axios.get(`/category/subcategories/${categoryId}`, { withCredentials: true });
    return response.data;
};

export const getSubCategory = async (id) => {
    const response = await axios.get(`category/getSubCategory/${id}`, { withCredentials: true });
    return response.data;
};

export const addCategory = async (name, description, image) => {
    const response = await axios.post('category/addCategory', { name, description, image }, { withCredentials: true });
    return response.data;
};

export const updateCategory = async (id, name, description, image) => {
    const response = await axios.put(`category/updateCategory/${id}`, { name, description, image }, { withCredentials: true });
    return response.data;
};

export const managerDeleteCategory = async (id) => {
    const response = await axios.delete(`category/managerDeleteCategory/${id}`, { withCredentials: true });
    return response.data;
};

export const adminDeleteCategory = async (id) => {
    const response = await axios.delete(`category/adminDeleteCategory/${id}`, { withCredentials: true });
    return response.data;
};

export const addSubCategory = async (id, name, description, image) => {
    const response = await axios.post(`category/addSubCategory/${id}`, { name, description, image }, { withCredentials: true });
    return response.data;
};

export const updateSubCategory = async (id, name, description, image) => {
    const response = await axios.put(`category/updateSubCategory/${id}`, { name, description, image }, { withCredentials: true });
    return response.data;
};

export const deleteSubCategory = async (id) => {
    const response = await axios.delete(`category/managerDeleteSubCategory/${id}`, { withCredentials: true });
    return response.data;
};

export const getAllProduct = async (page) => {
    const response = await axios.get('product/getAllProduct', { params: { page }, withCredentials: true });
    return response.data;
};

export const getAllProductBySubCategory = async (id, page) => {
    const response = await axios.put(`product/getProductBySubCategory/${id}`, { params: { page }, withCredentials: true });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`product/getProductById/${id}`, { withCredentials: true });
    return response.data;
};

export const getTop8 = async () => {
    const response = await axios.get(`product/getTop8`, { withCredentials: true });
    return response.data;
};

export const getTopSold = async () => {
    const response = await axios.get(`product/getTopSold`, { withCredentials: true });
    return response.data;
};

export const getTopView = async () => {
    const response = await axios.get(`product/getTopView`, { withCredentials: true });
    return response.data;
};

export const searchProducts = async (name, page) => {
    const response = await axios.post(`product/search`, { name }, { params: { page }, withCredentials: true });
    return response.data;
}

export const addProduct = async (subCategoryId, data) => {
    const response = await axios.post(`product/addProduct/${subCategoryId}`, data);
    return response.data;
};

export const updateProduct = async (data) => {
    const response = await axios.put(`product/updateProduct`, data);
    return response.data;
};

export const managerDeleteProduct = async (id) => {
    const response = await axios.delete(`product/managerDelete/${id}`);
    return response.data;
};

export const adminDeleteProduct = async (id) => {
    const response = await axios.delete(`product/adminDelete/${id}`);
    return response.data;
};



export const uploadImage = async (id, base64Image) => {
    try {
        // const base64String = base64Image.split(',')[1];

        const response = await axios.put(
            `product/updateImage/${id}`,
            { image: base64Image },
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error uploading image:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllProductsWithSale = async () => {
    const response = await axios.get(`product/getAllProductsWithSale`, { withCredentials: true });
    return response.data;
};

export const getTopRatedProduct = async () => {
    const response = await axios.get(`product/getTopRatedProduct`, { withCredentials: true });
    return response.data;
};

export const getSoldProductsData = async () => {
    try {
        const response = await axios.get("/api/products/sold-data");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm đã bán:", error);
        return { soldThisMonth: 0, soldChartData: [] };
    }
};


export const compareProducts = async (productId1, productId2) => {
    const response = await axios.post(`product/compareProduct`, { productId1, productId2 }, { withCredentials: true });
    return response;
};