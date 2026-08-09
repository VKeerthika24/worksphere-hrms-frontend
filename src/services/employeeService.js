import api from "./axios";

const employeeService = {

    getAllEmployees: async () => {

        const response =
            await api.get("/employees");

        return response.data;
    },

    searchEmployees: async (firstName) => {

        const response =
            await api.get("/employees/search", {
                params: {
                    firstName
                }
            });

        return response.data;
    },

    createEmployee: async (employeeData) => {

        const response =
            await api.post(
                "/employees",
                employeeData
            );

        return response.data;
    },

    updateEmployee: async (id, employeeData) => {

        const response =
            await api.put(
                `/employees/${id}`,
                employeeData
            );

        return response.data;
    },

    deleteEmployee: async (id) => {

        const response =
            await api.delete(
                `/employees/${id}`
            );

        return response.data;
    },

    getEmployeesPage: async (page = 0, size = 10) => {

        const response =
            await api.get("/employees/page", {
                params: {
                    page,
                    size
                }
            });

        return response.data;
    }

};

export default employeeService;