import api from "./axios";

const departmentService = {

    // =========================
    // GET ALL DEPARTMENTS
    // =========================

    getAllDepartments: async () => {

        const response =
            await api.get("/departments");

        return response.data;
    },


    // =========================
    // GET DEPARTMENT BY ID
    // =========================

    getDepartmentById: async (id) => {

        const response =
            await api.get(`/departments/${id}`);

        return response.data;
    },


    // =========================
    // CREATE DEPARTMENT
    // =========================

    createDepartment: async (departmentData) => {

        const response =
            await api.post(
                "/departments",
                departmentData
            );

        return response.data;
    },


    // =========================
    // UPDATE DEPARTMENT
    // =========================

    updateDepartment: async (
        id,
        departmentData
    ) => {

        const response =
            await api.put(
                `/departments/${id}`,
                departmentData
            );

        return response.data;
    },


    // =========================
    // DELETE DEPARTMENT
    // =========================

    deleteDepartment: async (id) => {

        const response =
            await api.delete(
                `/departments/${id}`
            );

        return response.data;
    }

};

export default departmentService;