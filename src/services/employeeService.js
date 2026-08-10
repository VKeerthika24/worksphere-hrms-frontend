import api from "./axios";

const employeeService = {

    // =========================
    // GET ALL EMPLOYEES
    // =========================

    getAllEmployees: async () => {

        const response =
            await api.get("/employees");

        return response.data;
    },


    // =========================
    // GET EMPLOYEE BY ID
    // =========================

    getEmployeeById: async (id) => {

        const response =
            await api.get(`/employees/${id}`);

        return response.data;
    },


    // =========================
    // SEARCH EMPLOYEES
    // =========================

    searchEmployees: async (firstName) => {

        const response =
            await api.get("/employees/search", {
                params: {
                    firstName
                }
            });

        return response.data;
    },


    // =========================
    // CREATE EMPLOYEE
    // =========================

    createEmployee: async (employeeData) => {

        const response =
            await api.post(
                "/employees",
                employeeData
            );

        return response.data;
    },


    // =========================
    // UPDATE EMPLOYEE
    // =========================

    updateEmployee: async (id, employeeData) => {

        const response =
            await api.put(
                `/employees/${id}`,
                employeeData
            );

        return response.data;
    },


    // =========================
    // DELETE EMPLOYEE
    // =========================

    deleteEmployee: async (id) => {

        const response =
            await api.delete(
                `/employees/${id}`
            );

        return response.data;
    },


    // =========================
    // PAGINATED EMPLOYEES
    // =========================

    getEmployeesPage: async (
        page = 0,
        size = 10
    ) => {

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