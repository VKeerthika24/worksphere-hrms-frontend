import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import AddEmployee from "./AddEmployee";

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddEmployee, setShowAddEmployee] = useState(false);

    // =========================
    // FETCH ALL EMPLOYEES
    // =========================

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError("");

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

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // SEARCH EMPLOYEES
    // =========================

    const handleSearch = async (event) => {

        event.preventDefault();

        const trimmedName = searchName.trim();

        // If search is empty,
        // fetch all employees again.

        if (!trimmedName) {

            fetchEmployees();

            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await employeeService.searchEmployees(
                    trimmedName
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Search failed"
                );
            }

            setEmployees(response.data || []);

        } catch (error) {

            console.error(
                "Employee search error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to search employees"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // CLEAR SEARCH
    // =========================

    const handleClearSearch = () => {

        setSearchName("");

        fetchEmployees();
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchEmployees();

    }, []);


    // =========================
    // LOADING SCREEN
    // =========================

    if (loading) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3">
                    Loading employees...
                </p>

            </div>
        );
    }


    // =========================
    // MAIN PAGE
    // =========================

    return (

        <div>

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Employees
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your employees
                    </p>

                </div>


                {/* ADD EMPLOYEE BUTTON */}

                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() =>
                        setShowAddEmployee(true)
                    }
                >

                    <i className="bi bi-plus-lg me-2"></i>

                    Add Employee

                </button>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <form
                        onSubmit={handleSearch}
                        className="row g-2"
                    >

                        {/* Search Input */}

                        <div className="col-md-8">

                            <div className="input-group">

                                <span className="input-group-text">

                                    <i className="bi bi-search"></i>

                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by first name..."
                                    value={searchName}
                                    onChange={(event) =>
                                        setSearchName(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* Search Button */}

                        <div className="col-md-auto">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Search
                            </button>

                        </div>


                        {/* Clear Button */}

                        <div className="col-md-auto">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClearSearch}
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* =========================
                EMPLOYEE TABLE
            ========================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            {/* TABLE HEADER */}

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        Employee Code
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Designation
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody>

                                {employees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center py-5 text-muted"
                                        >

                                            No employees found

                                        </td>

                                    </tr>

                                ) : (

                                    employees.map((employee) => (

                                        <tr
                                            key={employee.id}
                                        >

                                            {/* Employee Code */}

                                            <td>

                                                {employee.employeeCode}

                                            </td>


                                            {/* Name */}

                                            <td>

                                                <div className="fw-semibold">

                                                    {employee.firstName}{" "}

                                                    {employee.lastName}

                                                </div>

                                            </td>


                                            {/* Email */}

                                            <td>

                                                {employee.email}

                                            </td>


                                            {/* Designation */}

                                            <td>

                                                {employee.designation}

                                            </td>


                                            {/* Department */}

                                            <td>

                                                {employee.departmentName}

                                            </td>


                                            {/* Phone */}

                                            <td>

                                                {employee.phoneNumber}

                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={
                                                        employee.status ===
                                                        "ACTIVE"
                                                            ? "badge bg-success"
                                                            : "badge bg-secondary"
                                                    }
                                                >

                                                    {employee.status}

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================
                ADD EMPLOYEE MODAL
            ========================= */}

            {showAddEmployee && (

                <AddEmployee
                    onClose={() =>
                        setShowAddEmployee(false)
                    }
                    onEmployeeCreated={
                        fetchEmployees
                    }
                />

            )}

        </div>
    );
}

export default Employees;