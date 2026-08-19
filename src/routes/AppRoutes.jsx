import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Employees from "../pages/employee/Employees";
import Departments from "../pages/department/Departments";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import Attendance from "../pages/attendance/Attendance";
import Leaves from "../pages/leaves/Leaves";


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

            <Route
                element={<ProtectedRoute />}
            >

                <Route element={<MainLayout />}>

                    {/* DASHBOARD */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* ATTENDANCE */}

                    <Route
                        path="/attendance"
                        element={<Attendance />}
                    />


                    {/* LEAVES */}

                    <Route
                        path="/leaves"
                        element={<Leaves />}
                    />


                </Route>

            </Route>


            {/* =========================
                ADMIN / MANAGER ROUTES
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

                <Route element={<MainLayout />}>

                    {/* EMPLOYEES */}

                    <Route
                        path="/employees"
                        element={<Employees />}
                    />


                    {/* DEPARTMENTS */}

                    <Route
                        path="/departments"
                        element={<Departments />}
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