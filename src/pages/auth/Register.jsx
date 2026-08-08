import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "EMPLOYEE"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await authService.register(formData);

            if (!response.success) {
                throw new Error(
                    response.message || "Registration failed"
                );
            }

            setSuccess(
                response.message || "Registration successful!"
            );

            setFormData({
                email: "",
                password: "",
                role: "EMPLOYEE"
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">

            <div
                className="card shadow border-0"
                style={{ width: "420px" }}
            >

                <div className="card-body p-4 p-md-5">

                    <div className="text-center mb-4">

                        <h2 className="fw-bold">
                            WorkSphere HRMS
                        </h2>

                        <p className="text-muted">
                            Create your account
                        </p>

                    </div>

                    {error && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="alert alert-success"
                            role="alert"
                        >
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="mb-3">

                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Password */}

                        <div className="mb-3">

                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Role */}

                        <div className="mb-4">

                            <label
                                htmlFor="role"
                                className="form-label"
                            >
                                Role
                            </label>

                            <select
                                id="role"
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                            >

                                <option value="EMPLOYEE">
                                    Employee
                                </option>

                                

                                <option value="MANAGER">
                                    Manager
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                            </select>

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    />

                                    Creating account...
                                </>
                            ) : (
                                "Register"
                            )}

                        </button>

                    </form>

                    <div className="text-center mt-4">

                        <span className="text-muted">
                            Already have an account?{" "}
                        </span>

                        <Link to="/login">
                            Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;