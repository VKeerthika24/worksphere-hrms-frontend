import { Routes, Route, Navigate } from "react-router-dom";

function Login() {
    return <h2>Login Page</h2>;
}

function Register() {
    return <h2>Register Page</h2>;
}

function Dashboard() {
    return <h2>Dashboard Page</h2>;
}

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

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main Application */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<Leaves />} />

            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;