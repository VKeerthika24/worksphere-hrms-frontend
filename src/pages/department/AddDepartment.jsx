import { useState } from "react";
import departmentService from "../../services/departmentService";

function AddDepartment({
    onClose,
    onDepartmentCreated
}) {

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


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
    // CREATE DEPARTMENT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // Basic validation

        if (!formData.name.trim()) {

            setError(
                "Department name is required"
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await departmentService.createDepartment({
                    name: formData.name.trim(),
                    description:
                        formData.description.trim()
                });


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to create department"
                );
            }


            alert(
                "Department created successfully! 🚀"
            );


            // Refresh department list

            if (onDepartmentCreated) {

                await onDepartmentCreated();
            }


            // Close modal

            onClose();

        } catch (error) {

            console.error(
                "Create department error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to create department"
            );

        } finally {

            setLoading(false);
        }
    };


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
                                Add Department
                            </h5>

                            <small className="text-muted">
                                Create a new department
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
                        BODY
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
                                    htmlFor="departmentName"
                                    className="form-label"
                                >
                                    Department Name
                                </label>

                                <input
                                    id="departmentName"
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="e.g. Engineering"
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
                                    htmlFor="departmentDescription"
                                    className="form-label"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="departmentDescription"
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

                                        Creating...
                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Add Department
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

export default AddDepartment;