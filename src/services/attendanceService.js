import api from "./axios";

const attendanceService = {

    // =========================
    // CHECK IN
    // =========================

    checkIn: async (employeeId) => {

        const response =
            await api.post(
                "/attendance/check-in",
                {
                    employeeId
                }
            );

        return response.data;
    },


    // =========================
    // CHECK OUT
    // =========================

    checkOut: async (employeeId) => {

        const response =
            await api.post(
                `/attendance/check-out/${employeeId}`
            );

        return response.data;
    },


    // =========================
    // GET EMPLOYEE ATTENDANCE
    // =========================

    getAttendanceHistory: async (employeeId) => {

        const response =
            await api.get(
                `/attendance/${employeeId}`
            );

        return response.data;
    },


    // =========================
    // GET TODAY'S ATTENDANCE
    // =========================

    getTodayAttendance: async () => {

        const response =
            await api.get(
                "/attendance/today"
            );

        return response.data;
    }

};

export default attendanceService;