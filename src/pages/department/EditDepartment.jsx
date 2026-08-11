import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";

function EditDepartment({
    department,
    onClose,
    onDepartmentUpdated
}) {

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =========================
    // LOAD DEPARTMENT DATA
    // =========================

    useEffect(() => {

        if (department) {

            setFormData({
                name: department.name || "",
                description:
                    department.description || ""
            });

        }

    }, [department]);


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
    // UPDATE DEPARTMENT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // Validation

        if (!formData.name.trim()) {

            setError(
                "Department name is required"
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await departmentService.updateDepartment(
                    department.id,
                    {
                        name: formData.name.trim(),
                        description:
                            formData.description.trim()
                    }
                );


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update department"
                );
            }


            alert(
                "Department updated successfully! 🚀"
            );


            // Refresh list

            if (onDepartmentUpdated) {

                await onDepartmentUpdated();
            }


            // Close modal

            onClose();

        } catch (error) {

            console.error(
                "Update department error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to update department"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // NO DEPARTMENT
    // =========================

    if (!department) {
        return null;
    }


    return (

        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor:
                    "rgba(0, 0, 0, 0.5)"
            }}
        >

            <div
                className="modal-dialog modal-dialog-centered"
            >

                <div className="modal-content">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="modal-header">

                        <div>

                            <h5 className="modal-title fw-bold mb-1">
                                Edit Department
                            </h5>

                            <small className="text-muted">
                                Update department information
                            </small>

                        </div>


                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        FORM
                    ========================= */}

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">


                            {/* ERROR */}

                            {error && (

                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>

                            )}


                            {/* DEPARTMENT NAME */}

                            <div className="mb-3">

                                <label
                                    htmlFor="editDepartmentName"
                                    className="form-label"
                                >
                                    Department Name
                                </label>

                                <input
                                    id="editDepartmentName"
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter department name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                    autoFocus
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mb-3">

                                <label
                                    htmlFor="editDepartmentDescription"
                                    className="form-label"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="editDepartmentDescription"
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter department description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* =========================
                            FOOTER
                        ========================= */}

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {loading ? (

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
                                        Update Department
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default EditDepartment;