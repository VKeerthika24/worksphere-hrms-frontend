import { useEffect, useState } from "react";
import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";

function Attendance() {

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // FETCH EMPLOYEES + ATTENDANCE
    // =========================

    const fetchTodayAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                employeeResponse,
                attendanceResponse
            ] = await Promise.all([
                employeeService.getAllEmployees(),
                attendanceService.getTodayAttendance()
            ]);


            if (!employeeResponse.success) {

                throw new Error(
                    employeeResponse.message ||
                    "Failed to fetch employees"
                );
            }


            if (!attendanceResponse.success) {

                throw new Error(
                    attendanceResponse.message ||
                    "Failed to fetch attendance"
                );
            }


            // =========================
            // ACTIVE EMPLOYEES ONLY
            // =========================

            const activeEmployees =
                (employeeResponse.data || [])
                    .filter(
                        employee =>
                            employee.status === "ACTIVE"
                    );


            const todayAttendance =
                attendanceResponse.data || [];


            // =========================
            // MERGE EMPLOYEE + ATTENDANCE
            // =========================

            const mergedData =
                activeEmployees.map(employee => {

                    const employeeAttendance =
                        todayAttendance.find(
                            attendance =>
                                attendance.employeeId ===
                                employee.id
                        );


                    if (employeeAttendance) {

                        return employeeAttendance;
                    }


                    return {

                        id: null,

                        employeeId:
                            employee.id,

                        attendanceDate: null,

                        checkIn: null,

                        checkOut: null,

                        workingHours: null,

                        status: null,

                        employeeCode:
                            employee.employeeCode,

                        employeeName:
                            `${employee.firstName} ${employee.lastName}`,

                        late: null,

                        overtimeHours: null

                    };

                });


            setAttendance(mergedData);

        } catch (error) {

            console.error(
                "Attendance fetch error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load attendance"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchTodayAttendance();

    }, []);


    // =========================
    // CHECK IN
    // =========================

    const handleCheckIn = async (employeeId) => {

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            const response =
                await attendanceService.checkIn(
                    employeeId
                );


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Check-in failed"
                );
            }


            setSuccess(
                "Check-in successful! 🚀"
            );


            await fetchTodayAttendance();

        } catch (error) {

            console.error(
                "Check-in error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Check-in failed"
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =========================
    // CHECK OUT
    // =========================

    const handleCheckOut = async (employeeId) => {

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            const response =
                await attendanceService.checkOut(
                    employeeId
                );


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Check-out failed"
                );
            }


            setSuccess(
                "Check-out successful! 🚀"
            );


            await fetchTodayAttendance();

        } catch (error) {

            console.error(
                "Check-out error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Check-out failed"
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =========================
    // STATUS BADGE
    // =========================

    const getStatusBadge = (status) => {

        switch (status) {

            case "PRESENT":
                return "bg-success";

            case "HALF_DAY":
                return "bg-warning text-dark";

            case "ABSENT":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };


    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        return time.substring(0, 5);
    };


    // =========================
    // FORMAT HOURS
    // =========================

    const formatHours = (hours) => {

        if (
            hours === null ||
            hours === undefined
        ) {
            return "-";
        }

        return `${Number(hours).toFixed(2)} hrs`;
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3 text-muted">
                    Loading today's attendance...
                </p>

            </div>

        );
    }


    // =========================
    // SUMMARY COUNTS
    // =========================

    const checkedInCount =
        attendance.filter(
            item =>
                item.checkIn &&
                !item.checkOut
        ).length;


    const checkedOutCount =
        attendance.filter(
            item =>
                item.checkOut
        ).length;


    const notCheckedInCount =
        attendance.filter(
            item =>
                !item.checkIn
        ).length;


    return (

        <div>

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Attendance
                    </h2>

                    <p className="text-muted mb-0">
                        Manage today's employee attendance
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchTodayAttendance}
                    disabled={actionLoading}
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Refresh

                </button>

            </div>


            {/* =========================
                SUCCESS MESSAGE
            ========================= */}

            {success && (

                <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                >

                    {success}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setSuccess("")
                        }
                    />

                </div>

            )}


            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (

                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >

                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setError("")
                        }
                    />

                </div>

            )}


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="row g-3 mb-4">

                {/* TOTAL ACTIVE EMPLOYEES */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Active Employees
                            </p>

                            <h3 className="fw-bold mb-0">
                                {attendance.length}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* CHECKED IN */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Currently Working
                            </p>

                            <h3 className="fw-bold mb-0 text-success">
                                {checkedInCount}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* CHECKED OUT */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Checked Out
                            </p>

                            <h3 className="fw-bold mb-0">
                                {checkedOutCount}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* NOT CHECKED IN */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Not Checked In
                            </p>

                            <h3 className="fw-bold mb-0 text-warning">
                                {notCheckedInCount}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                ATTENDANCE TABLE
            ========================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 py-3">

                    <h5 className="fw-bold mb-1">
                        Today's Attendance
                    </h5>

                    <small className="text-muted">

                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        )}

                    </small>

                </div>


                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee Code
                                    </th>

                                    <th>
                                        Check In
                                    </th>

                                    <th>
                                        Check Out
                                    </th>

                                    <th>
                                        Working Hours
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Late
                                    </th>

                                    <th>
                                        Overtime
                                    </th>

                                    <th className="text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {attendance.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="text-center py-5 text-muted"
                                        >

                                            <i className="bi bi-people fs-2 d-block mb-2"></i>

                                            No active employees found

                                        </td>

                                    </tr>

                                ) : (

                                    attendance.map(
                                        item => (

                                            <tr
                                                key={
                                                    item.employeeId
                                                }
                                            >

                                                {/* EMPLOYEE */}

                                                <td>

                                                    <div className="fw-semibold">

                                                        {
                                                            item.employeeName
                                                        }

                                                    </div>

                                                </td>


                                                {/* CODE */}

                                                <td>

                                                    <span className="text-muted">

                                                        {
                                                            item.employeeCode
                                                        }

                                                    </span>

                                                </td>


                                                {/* CHECK IN */}

                                                <td>

                                                    {formatTime(
                                                        item.checkIn
                                                    )}

                                                </td>


                                                {/* CHECK OUT */}

                                                <td>

                                                    {formatTime(
                                                        item.checkOut
                                                    )}

                                                </td>


                                                {/* WORKING HOURS */}

                                                <td>

                                                    {formatHours(
                                                        item.workingHours
                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    {item.status ? (

                                                        <span
                                                            className={`badge ${getStatusBadge(
                                                                item.status
                                                            )}`}
                                                        >

                                                            {
                                                                item.status
                                                            }

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-secondary">
                                                            Not Marked
                                                        </span>

                                                    )}

                                                </td>


                                                {/* LATE */}

                                                <td>

                                                    {item.late === true ? (

                                                        <span className="badge bg-danger">
                                                            Late
                                                        </span>

                                                    ) : item.late === false ? (

                                                        <span className="badge bg-success">
                                                            On Time
                                                        </span>

                                                    ) : (

                                                        <span className="text-muted">
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* OVERTIME */}

                                                <td>

                                                    {formatHours(
                                                        item.overtimeHours
                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="d-flex justify-content-center">

                                                        {/* NOT CHECKED IN */}

                                                        {!item.checkIn && (

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={() =>
                                                                    handleCheckIn(
                                                                        item.employeeId
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                            >

                                                                <i className="bi bi-box-arrow-in-right me-1"></i>

                                                                Check In

                                                            </button>

                                                        )}


                                                        {/* CHECKED IN BUT NOT CHECKED OUT */}

                                                        {item.checkIn &&
                                                            !item.checkOut && (

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() =>
                                                                        handleCheckOut(
                                                                            item.employeeId
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        actionLoading
                                                                    }
                                                                >

                                                                    <i className="bi bi-box-arrow-right me-1"></i>

                                                                    Check Out

                                                                </button>

                                                            )}


                                                        {/* COMPLETED */}

                                                        {item.checkIn &&
                                                            item.checkOut && (

                                                                <span className="badge bg-secondary">

                                                                    Completed

                                                                </span>

                                                            )}

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Attendance;