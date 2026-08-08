import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await dashboardService.getDashboard();

                if (!response.success) {
                    throw new Error(
                        response.message ||
                        "Failed to fetch dashboard"
                    );
                }

                setDashboard(response.data);

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load dashboard"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);

    if (loading) {

        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="container-fluid p-4">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Dashboard
                </h2>

                <p className="text-muted">
                    Welcome to WorkSphere HRMS
                </p>

            </div>

            <div className="row g-4">

                {/* Total Employees */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Total Employees
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.totalEmployees}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Total Departments */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Total Departments
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.totalDepartments}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Present Today */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Present Today
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.presentToday}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Late Today */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Late Today
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.lateToday}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Employees On Leave */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Employees On Leave
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.employeesOnLeave}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Pending Leaves */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Pending Leaves
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.pendingLeaves}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Approved Leaves */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Approved Leaves
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.approvedLeaves}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Rejected Leaves */}

                <div className="col-md-6 col-lg-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-2">
                                Rejected Leaves
                            </p>

                            <h2 className="fw-bold mb-0">
                                {dashboard.rejectedLeaves}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;