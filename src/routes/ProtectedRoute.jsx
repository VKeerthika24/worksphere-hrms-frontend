import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {

    const {
        user,
        loading
    } = useAuth();

    const location = useLocation();


    // =========================
    // AUTHENTICATION LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <h5 className="mt-3">
                        Loading...
                    </h5>

                </div>

            </div>
        );
    }


    // =========================
    // NOT AUTHENTICATED
    // =========================

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }


    // =========================
    // ROLE AUTHORIZATION
    // =========================

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    // =========================
    // AUTHENTICATED + AUTHORIZED
    // =========================

    return <Outlet />;
}

export default ProtectedRoute;