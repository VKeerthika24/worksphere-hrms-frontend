import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {

    const {
        user,
        loading
    } = useAuth();


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
            />
        );
    }


    // =========================
    // AUTHENTICATED
    // =========================

    return <Outlet />;
}

export default ProtectedRoute;