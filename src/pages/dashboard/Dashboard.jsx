import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

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


    useEffect(() => {

        fetchDashboard();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="container-fluid py-5">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3">
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="container-fluid py-5">

                <div
                    className="alert alert-danger"
                    role="alert"
                >

                    <strong>
                        Unable to load dashboard
                    </strong>

                    <div className="mt-1">
                        {error}
                    </div>

                    <button
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // =========================
    // DASHBOARD
    // =========================

    return (

        <div className="container-fluid py-4">

            {/* =========================
                HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        WorkSphere Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Overview of your organization's workforce
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchDashboard}
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Refresh

                </button>

            </div>


            {/* =========================
                WORKFORCE OVERVIEW
            ========================= */}

            <h5 className="fw-bold mb-3">
                Workforce Overview
            </h5>


            <div className="row g-4 mb-4">

                {/* TOTAL EMPLOYEES */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Total Employees
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {dashboard.totalEmployees}
                                    </h2>

                                </div>

                                <div className="fs-2 text-primary">
                                    <i className="bi bi-people-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* DEPARTMENTS */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Departments
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {dashboard.totalDepartments}
                                    </h2>

                                </div>

                                <div className="fs-2 text-success">
                                    <i className="bi bi-building"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PRESENT TODAY */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Present Today
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {dashboard.presentToday}
                                    </h2>

                                </div>

                                <div className="fs-2 text-info">
                                    <i className="bi bi-person-check-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ON LEAVE */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Employees On Leave
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {dashboard.employeesOnLeave}
                                    </h2>

                                </div>

                                <div className="fs-2 text-warning">
                                    <i className="bi bi-calendar-event-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                ATTENDANCE OVERVIEW
            ========================= */}

            <h5 className="fw-bold mb-3">
                Attendance Overview
            </h5>


            <div className="row g-4 mb-4">

                {/* LATE */}

                <div className="col-lg-4 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Late Today
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {dashboard.lateToday}
                                    </h2>

                                    <small className="text-muted">
                                        Employees marked late
                                    </small>

                                </div>

                                <div className="fs-1 text-danger">
                                    <i className="bi bi-clock-history"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* AVERAGE HOURS */}

                <div className="col-lg-4 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Average Working Hours
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {Number(
                                            dashboard.averageWorkingHours || 0
                                        ).toFixed(2)}
                                        <span className="fs-6 text-muted ms-1">
                                            hrs
                                        </span>
                                    </h2>

                                    <small className="text-muted">
                                        Today's completed attendance
                                    </small>

                                </div>

                                <div className="fs-1 text-primary">
                                    <i className="bi bi-hourglass-split"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PRESENT RATE */}

                <div className="col-lg-4 col-md-12">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Attendance Today
                                    </p>

                                    <h2 className="fw-bold mb-1">

                                        {dashboard.totalEmployees > 0
                                            ? (
                                                (
                                                    dashboard.presentToday /
                                                    dashboard.totalEmployees
                                                ) * 100
                                            ).toFixed(0)
                                            : 0
                                        }%

                                    </h2>

                                    <small className="text-muted">
                                        Current attendance rate
                                    </small>

                                </div>

                                <div className="fs-1 text-success">
                                    <i className="bi bi-bar-chart-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                LEAVE OVERVIEW
            ========================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Leave Overview
                            </h5>

                            <small className="text-muted">
                                Current leave request statistics
                            </small>

                        </div>

                        <i className="bi bi-calendar2-check fs-3 text-primary"></i>

                    </div>


                    <div className="row g-4">

                        {/* PENDING */}

                        <div className="col-md-4">

                            <div className="p-3 bg-warning bg-opacity-10 rounded">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Pending
                                        </small>

                                        <h3 className="fw-bold mb-0">
                                            {dashboard.pendingLeaves}
                                        </h3>

                                    </div>

                                    <i className="bi bi-hourglass-split fs-3 text-warning"></i>

                                </div>

                            </div>

                        </div>


                        {/* APPROVED */}

                        <div className="col-md-4">

                            <div className="p-3 bg-success bg-opacity-10 rounded">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Approved
                                        </small>

                                        <h3 className="fw-bold mb-0">
                                            {dashboard.approvedLeaves}
                                        </h3>

                                    </div>

                                    <i className="bi bi-check-circle-fill fs-3 text-success"></i>

                                </div>

                            </div>

                        </div>


                        {/* REJECTED */}

                        <div className="col-md-4">

                            <div className="p-3 bg-danger bg-opacity-10 rounded">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Rejected
                                        </small>

                                        <h3 className="fw-bold mb-0">
                                            {dashboard.rejectedLeaves}
                                        </h3>

                                    </div>

                                    <i className="bi bi-x-circle-fill fs-3 text-danger"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;