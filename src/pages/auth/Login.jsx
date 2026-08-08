import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
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
        setLoading(true);

        try {

            const response = await authService.login(formData);

            if (!response.success || !response.data) {
                throw new Error(
                    response.message || "Login failed"
                );
            }

            const loginData = response.data;

            login(
                {
                    email: loginData.email,
                    role: loginData.role
                },
                loginData.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password"
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
                            Sign in to your account
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

                    <form onSubmit={handleSubmit}>

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

                        <div className="mb-4">

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

                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}

                        </button>

                    </form>

                    <div className="text-center mt-4">

                        <span className="text-muted">
                            Don't have an account?{" "}
                        </span>

                        <Link to="/register">
                            Register
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;