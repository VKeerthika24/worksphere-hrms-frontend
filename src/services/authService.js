import api from "./axios";

const login = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

const register = async (registerData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
};

const authService = {
    login,
    register,
};

export default authService;