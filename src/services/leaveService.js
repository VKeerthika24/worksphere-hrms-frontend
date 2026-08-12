import api from "./axios";

const leaveService = {

    // =========================
    // APPLY LEAVE
    // =========================

    applyLeave: async (leaveData) => {

        const response =
            await api.post(
                "/leaves",
                leaveData
            );

        return response.data;
    },


    // =========================
    // GET EMPLOYEE LEAVE HISTORY
    // =========================

    getEmployeeLeaves: async (employeeId) => {

        const response =
            await api.get(
                `/leaves/${employeeId}`
            );

        return response.data;
    },


    // =========================
    // GET ALL LEAVES
    // =========================

    getAllLeaves: async () => {

        const response =
            await api.get(
                "/leaves"
            );

        return response.data;
    },


    // =========================
    // APPROVE LEAVE
    // =========================

    approveLeave: async (leaveId) => {

        const response =
            await api.put(
                `/leaves/${leaveId}/approve`
            );

        return response.data;
    },


    // =========================
    // REJECT LEAVE
    // =========================

    rejectLeave: async (leaveId) => {

        const response =
            await api.put(
                `/leaves/${leaveId}/reject`
            );

        return response.data;
    }

};

export default leaveService;