import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import userService from "../../services/userService";

function AddEmployee({ onClose, onEmployeeCreated }) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        designation: "",
        salary: "",
        joiningDate: "",
        departmentId: "",
        userId: ""
    });

    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);

    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // =========================
    // LOAD DEPARTMENTS + USERS
    // =========================

    useEffect(() => {

        const loadFormData = async () => {

            try {

                setLoadingData(true);
                setError("");

                const [
                    departmentResponse,
                    userResponse
                ] = await Promise.all([
                    departmentService.getAllDepartments(),
                    userService.getAllUsers()
                ]);

                if (!departmentResponse.success) {

                    throw new Error(
                        departmentResponse.message ||
                        "Failed to load departments"
                    );
                }

                if (!userResponse.success) {

                    throw new Error(
                        userResponse.message ||
                        "Failed to load users"
                    );
                }

                setDepartments(
                    departmentResponse.data || []
                );

                setUsers(
                    userResponse.data || []
                );

            } catch (error) {

                console.error(
                    "Add employee data error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load form data"
                );

            } finally {

                setLoadingData(false);
            }
        };

        loadFormData();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {

            const employeeData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim(),
                designation: formData.designation.trim(),
                salary: Number(formData.salary),
                joiningDate: formData.joiningDate,
                departmentId: Number(formData.departmentId),
                userId: Number(formData.userId)
            };

            const response =
                await employeeService.createEmployee(
                    employeeData
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to create employee"
                );
            }

            alert("Employee created successfully! 🚀");

            if (onEmployeeCreated) {
                onEmployeeCreated();
            }

            if (onClose) {
                onClose();
            }

        } catch (error) {

            console.error(
                "Create employee error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to create employee"
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loadingData) {

        return (
            <div
                className="modal-backdrop show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}
            >

                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        minHeight: "100vh"
                    }}
                >

                    <div className="bg-white rounded p-5 text-center">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-3 mb-0">
                            Loading employee form...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // FORM
    // =========================

    return (

        <div
            className="modal-backdrop show"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >

            <div
                className="modal d-block"
                tabIndex="-1"
            >

                <div
                    className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                >

                    <div className="modal-content">

                        {/* HEADER */}

                        <div className="modal-header">

                            <div>

                                <h5 className="modal-title fw-bold">
                                    Add Employee
                                </h5>

                                <small className="text-muted">
                                    Create a new employee record
                                </small>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={submitting}
                            />

                        </div>


                        {/* BODY */}

                        <div className="modal-body">

                            {error && (

                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>

                            )}

                            <form onSubmit={handleSubmit}>

                                {/* =========================
                                    PERSONAL INFORMATION
                                ========================= */}

                                <h6 className="fw-bold mb-3">
                                    Personal Information
                                </h6>

                                <div className="row g-3">

                                    {/* First Name */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            className="form-control"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Last Name */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="lastName"
                                            className="form-label"
                                        >
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            className="form-control"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Gender */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="gender"
                                            className="form-label"
                                        >
                                            Gender
                                        </label>

                                        <select
                                            id="gender"
                                            name="gender"
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="MALE">
                                                Male
                                            </option>

                                            <option value="FEMALE">
                                                Female
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* Date of Birth */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="dateOfBirth"
                                            className="form-label"
                                        >
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            className="form-control"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Phone */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="phoneNumber"
                                            className="form-label"
                                        >
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            className="form-control"
                                            placeholder="Enter phone number"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Address */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="address"
                                            className="form-label"
                                        >
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            className="form-control"
                                            placeholder="Enter address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                <hr className="my-4" />


                                {/* =========================
                                    JOB INFORMATION
                                ========================= */}

                                <h6 className="fw-bold mb-3">
                                    Job Information
                                </h6>

                                <div className="row g-3">

                                    {/* Designation */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="designation"
                                            className="form-label"
                                        >
                                            Designation
                                        </label>

                                        <input
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            className="form-control"
                                            placeholder="e.g. Software Developer"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Salary */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="salary"
                                            className="form-label"
                                        >
                                            Salary
                                        </label>

                                        <input
                                            type="number"
                                            id="salary"
                                            name="salary"
                                            className="form-control"
                                            placeholder="Enter salary"
                                            min="0.01"
                                            step="0.01"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Joining Date */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="joiningDate"
                                            className="form-label"
                                        >
                                            Joining Date
                                        </label>

                                        <input
                                            type="date"
                                            id="joiningDate"
                                            name="joiningDate"
                                            className="form-control"
                                            value={formData.joiningDate}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* Department */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="departmentId"
                                            className="form-label"
                                        >
                                            Department
                                        </label>

                                        <select
                                            id="departmentId"
                                            name="departmentId"
                                            className="form-select"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select department
                                            </option>

                                            {departments.map(
                                                (department) => (

                                                    <option
                                                        key={department.id}
                                                        value={department.id}
                                                    >
                                                        {department.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* User */}

                                    <div className="col-12">

                                        <label
                                            htmlFor="userId"
                                            className="form-label"
                                        >
                                            User Account
                                        </label>

                                        <select
                                            id="userId"
                                            name="userId"
                                            className="form-select"
                                            value={formData.userId}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select user account
                                            </option>

                                            {users.map(
                                                (user) => (

                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.email}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        <div className="form-text">
                                            Select the login account associated with this employee.
                                        </div>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="d-flex justify-content-end gap-2 mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={onClose}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >

                                        {submitting ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />

                                                Creating...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-check-lg me-2"></i>
                                                Create Employee
                                            </>

                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AddEmployee;