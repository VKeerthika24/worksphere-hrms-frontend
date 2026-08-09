import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

function Employees() {
    return <h2>Employees Page</h2>;
}

function Departments() {
    return <h2>Departments Page</h2>;
}

function Attendance() {
    return <h2>Attendance Page</h2>;
}

function Leaves() {
    return <h2>Leaves Page</h2>;
}

function AppRoutes() {

    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected Application */}

            <Route element={<ProtectedRoute />}>

                <Route
                    element={<MainLayout />}
                >

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

                    <Route
                        path="/attendance"
                        element={<Attendance />}
                    />

                    <Route
                        path="/leaves"
                        element={<Leaves />}
                    />

                </Route>

            </Route>

            {/* Unknown URL */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;