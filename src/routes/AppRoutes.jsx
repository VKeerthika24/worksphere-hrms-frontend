import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Employees from "../pages/employee/Employees";
import Departments from "../pages/department/Departments";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import Attendance from "../pages/attendance/Attendance";

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
                PROTECTED APPLICATION
            ========================= */}

            <Route element={<ProtectedRoute />}>

                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/employees"
                        element={<Employees />}
                    />

                    <Route
                        path="/departments"
                        element={<Departments />}
                    />

                    {/* Future routes */}

                    

                    <Route
                        path="/leaves"
                        element={
                            <div>
                                Leaves Page
                            </div>
                        }
                    />

                    <Route
                        path="/attendance"
                        element={<Attendance />}
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