import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import leaveService from "../../services/leaveService";

function Leaves() {

    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [employees, setEmployees] = useState([]);

const [showApplyModal, setShowApplyModal] = useState(false);

const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: ""
});

const [formLoading, setFormLoading] = useState(false);


    // =========================
    // FETCH ALL LEAVES
    // =========================

    const fetchLeaves = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await leaveService.getAllLeaves();

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to fetch leave requests"
                );
            }

            setLeaves(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Leave fetch error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load leave requests"
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchEmployees = async () => {

    try {

        const response =
            await employeeService.getAllEmployees();

        if (!response.success) {
            throw new Error(
                response.message ||
                "Failed to fetch employees"
            );
        }

        setEmployees(response.data || []);

    } catch (error) {

        console.error(
            "Employee fetch error:",
            error
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to load employees"
        );
    }
};


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

    fetchLeaves();
    fetchEmployees();

}, []);

const handleFormChange = (event) => {

    const { name, value } = event.target;

    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

const handleApplyLeave = async (event) => {

    event.preventDefault();

    try {

        setFormLoading(true);
        setError("");
        setSuccess("");

        const response =
            await leaveService.applyLeave({
                employeeId: Number(formData.employeeId),
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason
            });

        if (!response.success) {

            throw new Error(
                response.message ||
                "Failed to apply leave"
            );
        }

        setSuccess(
            "Leave applied successfully! 🚀"
        );

        setShowApplyModal(false);

        setFormData({
            employeeId: "",
            leaveType: "CASUAL",
            startDate: "",
            endDate: "",
            reason: ""
        });

        await fetchLeaves();

    } catch (error) {

        console.error(
            "Apply leave error:",
            error
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to apply leave"
        );

    } finally {

        setFormLoading(false);
    }
};


    // =========================
    // APPROVE LEAVE
    // =========================

    const handleApprove = async (leaveId) => {

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            const response =
                await leaveService.approveLeave(
                    leaveId
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to approve leave"
                );
            }

            setSuccess(
                "Leave approved successfully! 🚀"
            );

            await fetchLeaves();

        } catch (error) {

            console.error(
                "Approve leave error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to approve leave"
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =========================
    // REJECT LEAVE
    // =========================

    const handleReject = async (leaveId) => {

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            const response =
                await leaveService.rejectLeave(
                    leaveId
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to reject leave"
                );
            }

            setSuccess(
                "Leave rejected successfully!"
            );

            await fetchLeaves();

        } catch (error) {

            console.error(
                "Reject leave error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to reject leave"
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

            case "PENDING":
                return "bg-warning text-dark";

            case "APPROVED":
                return "bg-success";

            case "REJECTED":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };


    // =========================
    // LEAVE TYPE BADGE
    // =========================

    const getLeaveTypeBadge = (leaveType) => {

        switch (leaveType) {

            case "CASUAL":
                return "bg-primary";

            case "SICK":
                return "bg-info text-dark";

            case "EARNED":
                return "bg-success";

            default:
                return "bg-secondary";
        }
    };


    // =========================
    // DATE FORMAT
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
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
                    Loading leave requests...
                </p>

            </div>
        );
    }


    // =========================
    // SUMMARY COUNTS
    // =========================

    const pendingCount =
        leaves.filter(
            leave =>
                leave.status === "PENDING"
        ).length;


    const approvedCount =
        leaves.filter(
            leave =>
                leave.status === "APPROVED"
        ).length;


    const rejectedCount =
        leaves.filter(
            leave =>
                leave.status === "REJECTED"
        ).length;


    return (

        <div>

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Leave Management
                    </h2>

                    <p className="text-muted mb-0">
                        Manage employee leave requests
                    </p>

                </div>


                <div className="d-flex gap-2">

    <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowApplyModal(true)}
    >
        <i className="bi bi-plus-lg me-2"></i>
        Apply Leave
    </button>

    <button
        type="button"
        className="btn btn-outline-primary"
        onClick={fetchLeaves}
        disabled={actionLoading}
    >
        <i className="bi bi-arrow-clockwise me-2"></i>
        Refresh
    </button>

</div>

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

                {/* TOTAL */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Total Requests
                            </p>

                            <h3 className="fw-bold mb-0">
                                {leaves.length}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* PENDING */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Pending
                            </p>

                            <h3 className="fw-bold mb-0 text-warning">
                                {pendingCount}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* APPROVED */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Approved
                            </p>

                            <h3 className="fw-bold mb-0 text-success">
                                {approvedCount}
                            </h3>

                        </div>

                    </div>

                </div>


                {/* REJECTED */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Rejected
                            </p>

                            <h3 className="fw-bold mb-0 text-danger">
                                {rejectedCount}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                LEAVE TABLE
            ========================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 py-3">

                    <h5 className="fw-bold mb-1">
                        Leave Requests
                    </h5>

                    <small className="text-muted">
                        Review and manage employee leave applications
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
                                        Leave Type
                                    </th>

                                    <th>
                                        Start Date
                                    </th>

                                    <th>
                                        End Date
                                    </th>

                                    <th>
                                        Reason
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th className="text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {leaves.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="text-center py-5 text-muted"
                                        >

                                            <i className="bi bi-calendar-x fs-2 d-block mb-2"></i>

                                            No leave requests found

                                        </td>

                                    </tr>

                                ) : (

                                    leaves.map(
                                        leave => (

                                            <tr
                                                key={
                                                    leave.id
                                                }
                                            >

                                                {/* EMPLOYEE */}

                                                <td>

                                                    <div className="fw-semibold">

                                                        {
                                                            leave.employeeName
                                                        }

                                                    </div>

                                                </td>


                                                {/* CODE */}

                                                <td>

                                                    <span className="text-muted">

                                                        {
                                                            leave.employeeCode
                                                        }

                                                    </span>

                                                </td>


                                                {/* LEAVE TYPE */}

                                                <td>

                                                    <span
                                                        className={`badge ${getLeaveTypeBadge(
                                                            leave.leaveType
                                                        )}`}
                                                    >

                                                        {
                                                            leave.leaveType
                                                        }

                                                    </span>

                                                </td>


                                                {/* START DATE */}

                                                <td>

                                                    {
                                                        formatDate(
                                                            leave.startDate
                                                        )
                                                    }

                                                </td>


                                                {/* END DATE */}

                                                <td>

                                                    {
                                                        formatDate(
                                                            leave.endDate
                                                        )
                                                    }

                                                </td>


                                                {/* REASON */}

                                                <td>

                                                    <span
                                                        title={
                                                            leave.reason
                                                        }
                                                    >

                                                        {
                                                            leave.reason
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`badge ${getStatusBadge(
                                                            leave.status
                                                        )}`}
                                                    >

                                                        {
                                                            leave.status
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    {leave.status ===
                                                        "PENDING" ? (

                                                        <div className="d-flex justify-content-center gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        leave.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                            >

                                                                <i className="bi bi-check-lg me-1"></i>

                                                                Approve

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() =>
                                                                    handleReject(
                                                                        leave.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                            >

                                                                <i className="bi bi-x-lg me-1"></i>

                                                                Reject

                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <span className="text-muted small">
                                                            Processed
                                                        </span>

                                                    )}

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
            {showApplyModal && (

    <div
        className="modal d-block"
        tabIndex="-1"
        style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
    >

        <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

                <div className="modal-header">

                    <div>

                        <h5 className="modal-title fw-bold">
                            Apply Leave
                        </h5>

                        <small className="text-muted">
                            Submit a new employee leave request
                        </small>

                    </div>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setShowApplyModal(false)
                        }
                    />

                </div>


                <form onSubmit={handleApplyLeave}>

                    <div className="modal-body">

                        <div className="row g-3">

                            {/* EMPLOYEE */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Employee
                                </label>

                                <select
                                    className="form-select"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleFormChange}
                                    required
                                >

                                    <option value="">
                                        Select employee
                                    </option>

                                    {employees.map(employee => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >

                                            {employee.firstName}{" "}
                                            {employee.lastName}

                                            {" - "}

                                            {employee.employeeCode}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* LEAVE TYPE */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Leave Type
                                </label>

                                <select
                                    className="form-select"
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleFormChange}
                                    required
                                >

                                    <option value="CASUAL">
                                        Casual
                                    </option>

                                    <option value="SICK">
                                        Sick
                                    </option>

                                    <option value="EARNED">
                                        Earned
                                    </option>

                                </select>

                            </div>


                            {/* START DATE */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleFormChange}
                                    required
                                />

                            </div>


                            {/* END DATE */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleFormChange}
                                    required
                                />

                            </div>


                            {/* REASON */}

                            <div className="col-12">

                                <label className="form-label">
                                    Reason
                                </label>

                                <textarea
                                    className="form-control"
                                    name="reason"
                                    rows="4"
                                    placeholder="Enter reason for leave..."
                                    value={formData.reason}
                                    onChange={handleFormChange}
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                setShowApplyModal(false)
                            }
                            disabled={formLoading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={formLoading}
                        >

                            {formLoading ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    />
                                    Applying...
                                </>

                            ) : (

                                <>
                                    <i className="bi bi-send me-2"></i>
                                    Apply Leave
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    </div>

)}

        </div>
    );
}

export default Leaves;