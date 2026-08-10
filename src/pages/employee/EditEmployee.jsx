import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import userService from "../../services/userService";

function EditEmployee({
    employeeId,
    onClose,
    onEmployeeUpdated
}) {

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

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");


    // =========================
    // LOAD EMPLOYEE DATA
    // =========================

    useEffect(() => {

        const loadEmployeeData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    employeeResponse,
                    departmentResponse,
                    userResponse
                ] = await Promise.all([
                    employeeService.getEmployeeById(employeeId),
                    departmentService.getAllDepartments(),
                    userService.getAllUsers()
                ]);


                if (!employeeResponse.success) {

                    throw new Error(
                        employeeResponse.message ||
                        "Failed to load employee"
                    );
                }


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


                const employee =
                    employeeResponse.data;


                // Find department ID
                // using department name

                const department =
                    departmentResponse.data.find(
                        (item) =>
                            item.name ===
                            employee.departmentName
                    );


                // Find user ID
                // using employee email

                const user =
                    userResponse.data.find(
                        (item) =>
                            item.email ===
                            employee.email
                    );


                setFormData({
                    firstName:
                        employee.firstName || "",

                    lastName:
                        employee.lastName || "",

                    gender:
                        employee.gender || "",

                    dateOfBirth:
                        employee.dateOfBirth || "",

                    phoneNumber:
                        employee.phoneNumber || "",

                    address:
                        employee.address || "",

                    designation:
                        employee.designation || "",

                    salary:
                        employee.salary ?? "",

                    joiningDate:
                        employee.joiningDate || "",

                    departmentId:
                        department
                            ? department.id
                            : "",

                    userId:
                        user
                            ? user.id
                            : ""
                });


                setDepartments(
                    departmentResponse.data || []
                );

                setUsers(
                    userResponse.data || []
                );

            } catch (error) {

                console.error(
                    "Edit employee load error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load employee data"
                );

            } finally {

                setLoading(false);
            }
        };


        if (employeeId) {
            loadEmployeeData();
        }

    }, [employeeId]);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================
    // UPDATE EMPLOYEE
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {

            const employeeData = {

                firstName:
                    formData.firstName.trim(),

                lastName:
                    formData.lastName.trim(),

                gender:
                    formData.gender,

                dateOfBirth:
                    formData.dateOfBirth,

                phoneNumber:
                    formData.phoneNumber.trim(),

                address:
                    formData.address.trim(),

                designation:
                    formData.designation.trim(),

                salary:
                    Number(formData.salary),

                joiningDate:
                    formData.joiningDate,

                departmentId:
                    Number(formData.departmentId),

                userId:
                    Number(formData.userId)
            };


            const response =
                await employeeService.updateEmployee(
                    employeeId,
                    employeeData
                );


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update employee"
                );
            }


            alert(
                "Employee updated successfully! 🚀"
            );


            if (onEmployeeUpdated) {
                onEmployeeUpdated();
            }


            if (onClose) {
                onClose();
            }

        } catch (error) {

            console.error(
                "Update employee error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to update employee"
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div
                className="modal-backdrop show"
                style={{
                    display: "block",
                    backgroundColor:
                        "rgba(0,0,0,0.55)"
                }}
            >

                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        minHeight: "100vh"
                    }}
                >

                    <div
                        className="bg-white rounded p-5 text-center"
                    >

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-3 mb-0">
                            Loading employee...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // EDIT MODAL
    // =========================

    return (

        <div
            className="modal-backdrop show"
            style={{
                display: "block",
                backgroundColor:
                    "rgba(0,0,0,0.55)"
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
                                    Edit Employee
                                </h5>

                                <small className="text-muted">
                                    Update employee information
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


                            <form
                                onSubmit={handleSubmit}
                            >

                                {/* =========================
                                    PERSONAL INFORMATION
                                ========================= */}

                                <h6 className="fw-bold mb-3">
                                    Personal Information
                                </h6>

                                <div className="row g-3">

                                    {/* FIRST NAME */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-firstName"
                                            className="form-label"
                                        >
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            id="edit-firstName"
                                            name="firstName"
                                            className="form-control"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* LAST NAME */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-lastName"
                                            className="form-label"
                                        >
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            id="edit-lastName"
                                            name="lastName"
                                            className="form-control"
                                            value={
                                                formData.lastName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* GENDER */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-gender"
                                            className="form-label"
                                        >
                                            Gender
                                        </label>

                                        <select
                                            id="edit-gender"
                                            name="gender"
                                            className="form-select"
                                            value={
                                                formData.gender
                                            }
                                            onChange={
                                                handleChange
                                            }
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


                                    {/* DATE OF BIRTH */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-dateOfBirth"
                                            className="form-label"
                                        >
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            id="edit-dateOfBirth"
                                            name="dateOfBirth"
                                            className="form-control"
                                            value={
                                                formData.dateOfBirth
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-phoneNumber"
                                            className="form-label"
                                        >
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            id="edit-phoneNumber"
                                            name="phoneNumber"
                                            className="form-control"
                                            value={
                                                formData.phoneNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* ADDRESS */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-address"
                                            className="form-label"
                                        >
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            id="edit-address"
                                            name="address"
                                            className="form-control"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
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

                                    {/* DESIGNATION */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-designation"
                                            className="form-label"
                                        >
                                            Designation
                                        </label>

                                        <input
                                            type="text"
                                            id="edit-designation"
                                            name="designation"
                                            className="form-control"
                                            value={
                                                formData.designation
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* SALARY */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-salary"
                                            className="form-label"
                                        >
                                            Salary
                                        </label>

                                        <input
                                            type="number"
                                            id="edit-salary"
                                            name="salary"
                                            className="form-control"
                                            min="0.01"
                                            step="0.01"
                                            value={
                                                formData.salary
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* JOINING DATE */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-joiningDate"
                                            className="form-label"
                                        >
                                            Joining Date
                                        </label>

                                        <input
                                            type="date"
                                            id="edit-joiningDate"
                                            name="joiningDate"
                                            className="form-control"
                                            value={
                                                formData.joiningDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* DEPARTMENT */}

                                    <div className="col-md-6">

                                        <label
                                            htmlFor="edit-departmentId"
                                            className="form-label"
                                        >
                                            Department
                                        </label>

                                        <select
                                            id="edit-departmentId"
                                            name="departmentId"
                                            className="form-select"
                                            value={
                                                formData.departmentId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select department
                                            </option>

                                            {departments.map(
                                                (department) => (

                                                    <option
                                                        key={
                                                            department.id
                                                        }
                                                        value={
                                                            department.id
                                                        }
                                                    >
                                                        {
                                                            department.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* USER ACCOUNT */}

                                    <div className="col-12">

                                        <label
                                            htmlFor="edit-userId"
                                            className="form-label"
                                        >
                                            User Account
                                        </label>

                                        <select
                                            id="edit-userId"
                                            name="userId"
                                            className="form-select"
                                            value={
                                                formData.userId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select user account
                                            </option>

                                            {users.map(
                                                (user) => (

                                                    <option
                                                        key={
                                                            user.id
                                                        }
                                                        value={
                                                            user.id
                                                        }
                                                    >
                                                        {
                                                            user.email
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        <div className="form-text">
                                            Select the login account associated with this employee.
                                        </div>

                                    </div>

                                </div>


                                {/* BUTTONS */}

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

                                                Updating...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-check-lg me-2"></i>
                                                Update Employee
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

export default EditEmployee;