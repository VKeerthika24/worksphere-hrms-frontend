import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";

function Departments() {

    const [departments, setDepartments] = useState([]);
    const [searchName, setSearchName] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showEditDepartment, setShowEditDepartment] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // =========================
    // FETCH DEPARTMENTS
    // =========================

    const fetchDepartments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await departmentService.getAllDepartments();

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to fetch departments"
                );
            }

            setDepartments(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Department fetch error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load departments"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchDepartments();

    }, []);


    // =========================
    // FRONTEND SEARCH
    // =========================

    const filteredDepartments =
        departments.filter((department) =>
            department.name
                .toLowerCase()
                .includes(
                    searchName
                        .toLowerCase()
                        .trim()
                )
        );


    // =========================
    // CLEAR SEARCH
    // =========================

    const handleClearSearch = () => {

        setSearchName("");
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

                <p className="mt-3">
                    Loading departments...
                </p>

            </div>
        );
    }


    // =========================
    // PAGE
    // =========================

    // =========================
    // OPEN EDIT DEPARTMENT
    // =========================

    const handleEdit = (department) => {

        setSelectedDepartment(department);

        setShowEditDepartment(true);
    };

    // =========================
    // DELETE DEPARTMENT
    // =========================

    const handleDelete = async (department) => {

    const confirmed = window.confirm(
        `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        setError("");

        const response =
            await departmentService.deleteDepartment(
                department.id
            );

        if (!response.success) {

            throw new Error(
                response.message ||
                "Failed to delete department"
            );
        }

        alert(
            "Department deleted successfully! 🗑️"
        );

        await fetchDepartments();

    } catch (error) {

        console.error(
            "Delete department error:",
            error
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to delete department"
        );
    }
};

    return (

        <div>

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Departments
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your departments
                    </p>

                </div>


                {/* ADD DEPARTMENT */}

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowAddDepartment(true)}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Department
                </button>

            </div>




            {/* =========================
                SEARCH
            ========================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-2">

                        <div className="col-md-8">

                            <div className="input-group">

                                <span className="input-group-text">

                                    <i className="bi bi-search"></i>

                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search department..."
                                    value={searchName}
                                    onChange={(event) =>
                                        setSearchName(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="col-md-auto">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={
                                    handleClearSearch
                                }
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                ERROR
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
                DEPARTMENT TABLE
            ========================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            {/* HEADER */}

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Department Name
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th className="text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* BODY */}

                            <tbody>

                                {filteredDepartments.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center py-5 text-muted"
                                        >

                                            No departments found

                                        </td>

                                    </tr>

                                ) : (

                                    filteredDepartments.map(
                                        (department) => (

                                            <tr
                                                key={
                                                    department.id
                                                }
                                            >

                                                <td>

                                                    {department.id}

                                                </td>


                                                <td>

                                                    <div className="fw-semibold">

                                                        {
                                                            department.name
                                                        }

                                                    </div>

                                                </td>


                                                <td>

                                                    {
                                                        department.description ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    <div className="d-flex justify-content-center gap-2">

                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Edit Department"
                                                            onClick={() =>
                                                                handleEdit(department)
                                                            }
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Delete Department"
                                                            onClick={() =>
                                                                handleDelete(department)
                                                            }
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

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
            {showAddDepartment && (
                <AddDepartment
                    onClose={() =>
                        setShowAddDepartment(false)
                    }
                    onDepartmentCreated={
                        fetchDepartments
                    }
                />
            )}

            {showEditDepartment && (
                <EditDepartment
                    department={selectedDepartment}
                    onClose={() => {
                        setShowEditDepartment(false);
                        setSelectedDepartment(null);
                    }}
                    onDepartmentUpdated={fetchDepartments}
                />
            )}



        </div>
    );
}

export default Departments;