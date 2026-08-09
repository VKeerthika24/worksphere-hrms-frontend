import api from "./axios";

const dashboardService = {

    getDashboard: async () => {

        const response = await api.get("/dashboard", {
            headers: {
                Authorization: undefined
            }
        });

        return response.data;
    }

};

export default dashboardService;