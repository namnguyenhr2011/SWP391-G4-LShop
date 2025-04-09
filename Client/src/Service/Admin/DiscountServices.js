import axios from "../../utils/CustomizeApi"

export const getAllDiscounts = async () => {
    const response = await axios.get(`discount/getAllDiscounts`, { withCredentials: true });
    return response.data;
};

export const createDiscount = async (data) => {
    const response = await axios.post(`discount/createDiscount`, data, { withCredentials: true });
    return response.data;
};

export const updateDiscount = async (data) => {
    const response = await axios.put(`discount/updateDiscount/${data.id}`, data, { withCredentials: true });
    return response.data;
}

export const deleteDiscount = async (id) => {
    const response = await axios.delete(`discount/deleteDiscount/${id}`, { withCredentials: true });
    return response.data;
};

export const activeDiscount = async (id) => {
    const response = await axios.put(`discount/activeDiscount/${id}`, { withCredentials: true });
    return response.data;
}

export const inactiveDiscount = async (id) => {
    const response = await axios.put(`discount/inactiveDiscount/${id}`, { withCredentials: true });
    return response.data;
}

export const assignDiscount = async (data) => {
    const response = await axios.post(`discount/assignDiscount`, data, { withCredentials: true });
    return response.data;
}

export const unassignDiscount = async (data) => {
    const response = await axios.put(`discount/unassignDiscount`, data, { withCredentials: true });
    return response.data;
}