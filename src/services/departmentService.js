import api from "./axios";

const departmentService = {

    getAllDepartments: async () => {

        const response =
            await api.get("/departments");

        return response.data;
    }

};

export default departmentService;