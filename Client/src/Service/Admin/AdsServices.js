import axios from "../../utils/CustomizeApi";

export const getAds = async () => {
    const response = await axios.get(`ads/getAllAds`, { withCredentials: true });
    return response.data;
};

export const addAds = async (data) => {
    const response = await axios.post(`ads/addAds`, data, { withCredentials: true });
    return response.data;
};

export const updateAds = async (adsId, data) => {
    const response = await axios.put(`ads/updateAds/${adsId}`, data, { withCredentials: true });
    return response.data;
};

export const deleteAds = async (adsId) => {
    const response = await axios.delete(`ads/deleteAds/${adsId}`, { withCredentials: true });
    return response.data;
};

export const inactiveAds = async (adsId) => {
    const response = await axios.put(`ads/activeAds/${adsId}`, { withCredentials: true });
    return response.data;
};