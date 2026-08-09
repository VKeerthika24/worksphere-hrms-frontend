import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {

        fetchEmployees();

    }, []);

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

    return (
        <div>

            {/* Page Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Employees
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your employees
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-lg me-2"></i>

                    Add Employee

                </button>

            </div>


            {/* Error */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* Employee Table */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

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

                                        <tr key={employee.id}>

                                            <td>
                                                {employee.employeeCode}
                                            </td>

                                            <td>

                                                <div className="fw-semibold">
                                                    {employee.firstName}{" "}
                                                    {employee.lastName}
                                                </div>

                                            </td>

                                            <td>
                                                {employee.email}
                                            </td>

                                            <td>
                                                {employee.designation}
                                            </td>

                                            <td>
                                                {employee.departmentName}
                                            </td>

                                            <td>
                                                {employee.phoneNumber}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        employee.status === "ACTIVE"
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

        </div>
    );
}

export default Employees;