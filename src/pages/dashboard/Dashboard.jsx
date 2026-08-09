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
                        "Failed to load dashboard"
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
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);

    if (loading) {
        return (
            <div className="container mt-5">
                <h3>Loading dashboard...</h3>
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
        <div className="container mt-5">

            <h1 className="mb-4">
                WorkSphere Dashboard
            </h1>

            <div className="row g-4">

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Total Employees
                            </h6>
                            <h2>
                                {dashboard.totalEmployees}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Total Departments
                            </h6>
                            <h2>
                                {dashboard.totalDepartments}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Present Today
                            </h6>
                            <h2>
                                {dashboard.presentToday}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Late Today
                            </h6>
                            <h2>
                                {dashboard.lateToday}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Employees On Leave
                            </h6>
                            <h2>
                                {dashboard.employeesOnLeave}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Pending Leaves
                            </h6>
                            <h2>
                                {dashboard.pendingLeaves}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Approved Leaves
                            </h6>
                            <h2>
                                {dashboard.approvedLeaves}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Rejected Leaves
                            </h6>
                            <h2>
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