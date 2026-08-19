import { useEffect, useState } from "react";
import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";

function Attendance() {

    const { user } = useAuth();

    const [attendance, setAttendance] = useState([]);

    const [currentEmployee, setCurrentEmployee] = useState(null);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const isEmployee =
        user?.role === "EMPLOYEE";


    // =========================
    // FETCH EMPLOYEE ATTENDANCE
    // =========================

    const fetchEmployeeAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            // -------------------------
            // GET CURRENT EMPLOYEE
            // -------------------------

            const employeeResponse =
                await employeeService.getCurrentEmployee();

            if (!employeeResponse.success) {

                throw new Error(
                    employeeResponse.message ||
                    "Failed to fetch employee profile"
                );
            }

            const employee =
                employeeResponse.data;

            setCurrentEmployee(employee);


            // -------------------------
            // GET ATTENDANCE HISTORY
            // -------------------------

            const attendanceResponse =
                await attendanceService.getAttendanceHistory(
                    employee.id
                );

            if (!attendanceResponse.success) {

                throw new Error(
                    attendanceResponse.message ||
                    "Failed to fetch attendance"
                );
            }


            const history =
                attendanceResponse.data || [];


            // -------------------------
            // GET TODAY'S ATTENDANCE
            // -------------------------

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            const todayAttendance =
                history.find(
                    item =>
                        item.attendanceDate === today
                );


            /*
             * If employee has attendance today,
             * show it.
             *
             * Otherwise create an empty
             * attendance object for today.
             */

            if (todayAttendance) {

                setAttendance([
                    todayAttendance
                ]);

            } else {

                setAttendance([
                    {
                        id: null,

                        employeeId:
                            employee.id,

                        attendanceDate:
                            today,

                        checkIn: null,

                        checkOut: null,

                        workingHours: 0,

                        status: null,

                        employeeCode:
                            employee.employeeCode,

                        employeeName:
                            `${employee.firstName} ${employee.lastName}`,

                        late: null,

                        overtimeHours: 0
                    }
                ]);
            }

        } catch (error) {

            console.error(
                "Employee attendance error:",
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
    // FETCH MANAGER / ADMIN
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


            const activeEmployees =
                (employeeResponse.data || [])
                    .filter(
                        employee =>
                            employee.status === "ACTIVE"
                    );


            const todayAttendance =
                attendanceResponse.data || [];


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
    // LOAD DATA
    // =========================

    const fetchAttendance = async () => {

        if (isEmployee) {

            await fetchEmployeeAttendance();

        } else {

            await fetchTodayAttendance();
        }
    };


    useEffect(() => {

        fetchAttendance();

    }, [user?.role]);


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


            await fetchAttendance();

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


            await fetchAttendance();

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
                    Loading attendance...
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


    // =====================================================
    // EMPLOYEE VIEW
    // =====================================================

    if (isEmployee) {

        const todayAttendance =
            attendance[0];


        return (

            <div>

                {/* =========================
                    HEADER
                ========================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            My Attendance
                        </h2>

                        <p className="text-muted mb-0">
                            View and manage your attendance
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={fetchAttendance}
                        disabled={actionLoading}
                    >

                        <i className="bi bi-arrow-clockwise me-2"></i>

                        Refresh

                    </button>

                </div>


                {/* =========================
                    SUCCESS
                ========================= */}

                {success && (

                    <div className="alert alert-success">

                        {success}

                    </div>
                )}


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>
                )}


                {/* =========================
                    EMPLOYEE INFO
                ========================= */}

                {currentEmployee && (

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-4">

                                    <small className="text-muted">
                                        Employee
                                    </small>

                                    <h5 className="fw-bold mb-0">

                                        {currentEmployee.firstName}{" "}
                                        {currentEmployee.lastName}

                                    </h5>

                                </div>


                                <div className="col-md-4">

                                    <small className="text-muted">
                                        Employee Code
                                    </small>

                                    <h5 className="fw-bold mb-0">

                                        {currentEmployee.employeeCode}

                                    </h5>

                                </div>


                                <div className="col-md-4">

                                    <small className="text-muted">
                                        Department
                                    </small>

                                    <h5 className="fw-bold mb-0">

                                        {currentEmployee.departmentName}

                                    </h5>

                                </div>

                            </div>

                        </div>

                    </div>
                )}


                {/* =========================
                    TODAY'S ATTENDANCE
                ========================= */}

                <div className="row g-3 mb-4">

                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Check In
                                </p>

                                <h4 className="fw-bold">

                                    {formatTime(
                                        todayAttendance?.checkIn
                                    )}

                                </h4>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Check Out
                                </p>

                                <h4 className="fw-bold">

                                    {formatTime(
                                        todayAttendance?.checkOut
                                    )}

                                </h4>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Working Hours
                                </p>

                                <h4 className="fw-bold">

                                    {formatHours(
                                        todayAttendance?.workingHours
                                    )}

                                </h4>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-3">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Status
                                </p>

                                {todayAttendance?.status ? (

                                    <span
                                        className={`badge ${getStatusBadge(
                                            todayAttendance.status
                                        )}`}
                                    >

                                        {todayAttendance.status}

                                    </span>

                                ) : (

                                    <span className="badge bg-secondary">
                                        Not Marked
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    ACTION
                ========================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">
                            Today's Action
                        </h5>


                        {!todayAttendance?.checkIn && (

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() =>
                                    handleCheckIn(
                                        currentEmployee.id
                                    )
                                }
                                disabled={actionLoading}
                            >

                                <i className="bi bi-box-arrow-in-right me-2"></i>

                                {actionLoading
                                    ? "Processing..."
                                    : "Check In"}

                            </button>
                        )}


                        {todayAttendance?.checkIn &&
                            !todayAttendance?.checkOut && (

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleCheckOut(
                                            currentEmployee.id
                                        )
                                    }
                                    disabled={actionLoading}
                                >

                                    <i className="bi bi-box-arrow-right me-2"></i>

                                    {actionLoading
                                        ? "Processing..."
                                        : "Check Out"}

                                </button>
                            )}


                        {todayAttendance?.checkIn &&
                            todayAttendance?.checkOut && (

                                <span className="badge bg-secondary p-2">

                                    Attendance Completed

                                </span>
                            )}

                    </div>

                </div>


                {/* =========================
                    ATTENDANCE HISTORY
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

                                    </tr>

                                </thead>


                                <tbody>

                                    <tr>

                                        <td>
                                            {todayAttendance?.employeeName}
                                        </td>

                                        <td>
                                            {todayAttendance?.employeeCode}
                                        </td>

                                        <td>
                                            {formatTime(
                                                todayAttendance?.checkIn
                                            )}
                                        </td>

                                        <td>
                                            {formatTime(
                                                todayAttendance?.checkOut
                                            )}
                                        </td>

                                        <td>
                                            {formatHours(
                                                todayAttendance?.workingHours
                                            )}
                                        </td>

                                        <td>

                                            {todayAttendance?.status ? (

                                                <span
                                                    className={`badge ${getStatusBadge(
                                                        todayAttendance.status
                                                    )}`}
                                                >

                                                    {
                                                        todayAttendance.status
                                                    }

                                                </span>

                                            ) : (

                                                <span className="badge bg-secondary">
                                                    Not Marked
                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {todayAttendance?.late === true ? (

                                                <span className="badge bg-danger">
                                                    Late
                                                </span>

                                            ) : todayAttendance?.late === false ? (

                                                <span className="badge bg-success">
                                                    On Time
                                                </span>

                                            ) : (

                                                <span className="text-muted">
                                                    -
                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {formatHours(
                                                todayAttendance?.overtimeHours
                                            )}

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // MANAGER / ADMIN VIEW
    // =====================================================

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
                    onClick={fetchAttendance}
                    disabled={actionLoading}
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Refresh

                </button>

            </div>


            {/* =========================
                SUCCESS
            ========================= */}

            {success && (

                <div className="alert alert-success">

                    {success}

                </div>
            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>
            )}


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="row g-3 mb-4">

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

                                    <th>Employee</th>
                                    <th>Employee Code</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Working Hours</th>
                                    <th>Status</th>
                                    <th>Late</th>
                                    <th>Overtime</th>
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

                                    attendance.map(item => (

                                        <tr
                                            key={item.employeeId}
                                        >

                                            <td>
                                                <div className="fw-semibold">
                                                    {item.employeeName}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="text-muted">
                                                    {item.employeeCode}
                                                </span>
                                            </td>

                                            <td>
                                                {formatTime(
                                                    item.checkIn
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    item.checkOut
                                                )}
                                            </td>

                                            <td>
                                                {formatHours(
                                                    item.workingHours
                                                )}
                                            </td>

                                            <td>

                                                {item.status ? (

                                                    <span
                                                        className={`badge ${getStatusBadge(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>

                                                ) : (

                                                    <span className="badge bg-secondary">
                                                        Not Marked
                                                    </span>

                                                )}

                                            </td>

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

                                            <td>
                                                {formatHours(
                                                    item.overtimeHours
                                                )}
                                            </td>

                                            <td>

                                                <div className="d-flex justify-content-center">

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


                                                    {item.checkIn &&
                                                        item.checkOut && (

                                                            <span className="badge bg-secondary">

                                                                Completed

                                                            </span>
                                                        )}

                                                </div>

                                            </td>

                                        </tr>
                                    ))
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