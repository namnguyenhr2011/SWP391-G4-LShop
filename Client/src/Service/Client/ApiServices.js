import axios from "../../utils/CustomizeApi";

export const userRegister = async (username, email, password, phone, address) => {
    try {
        const response = await axios.post('user/register', {
            username,
            email,
            password,
            phone,
            address,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const userLogin = async (email, password) => {
    try {
        const response = await axios.post('/user/login', { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};


export const verifyEmail = async (otp, email) => {
    try {
        const response = await axios.post('/user/verify', { otp, email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Email verification failed");
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('/user/forgotPassword', { email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Forgot password request failed");
    }
};

export const otp = async (otp, email) => {
    try {
        const response = await axios.post('/user/otp', { otp, email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
};

export const resetPassword = async (password, confirmPassword, token) => {
    try {
        const response = await axios.post('/user/resetPassword', { password, confirmPassword, token }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Password reset failed");
    }
};

export const userProfile = async () => {
    try {
        const response = await axios.get('/user/user-profile', { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
};


