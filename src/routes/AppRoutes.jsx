import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Employees from "../pages/employee/Employees";
import Departments from "../pages/department/Departments";
import Attendance from "../pages/attendance/Attendance";
import Leaves from "../pages/leaves/Leaves";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";


function AppRoutes() {

    return (

        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                ALL AUTHENTICATED USERS
            ========================= */}

            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>

                    {/* =========================
                        DASHBOARD
                    ========================= */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* =========================
                        EMPLOYEES
                        ADMIN + MANAGER
                    ========================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "MANAGER"
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/employees"
                            element={<Employees />}
                        />

                        <Route
                            path="/departments"
                            element={<Departments />}
                        />
                    </Route>


                    {/* =========================
                        ATTENDANCE
                        ALL ROLES
                    ========================= */}

                    <Route
                        path="/attendance"
                        element={<Attendance />}
                    />


                    {/* =========================
                        LEAVES
                        ALL ROLES
                    ========================= */}

                    <Route
                        path="/leaves"
                        element={<Leaves />}
                    />

                </Route>

            </Route>


            {/* =========================
                UNKNOWN URL
            ========================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default AppRoutes;