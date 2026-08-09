import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    return (
        <header className="navbar-custom">

            <div>
                <h5 className="mb-0">
                    WorkSphere HRMS
                </h5>
            </div>

            <div className="navbar-user">

                <div className="user-avatar">
                    <i className="bi bi-person"></i>
                </div>

                <div className="user-info">

                    <span className="user-name">
                        {user?.name || "User"}
                    </span>

                    <small>
                        {user?.role || "Employee"}
                    </small>

                </div>

            </div>

        </header>
    );
}

export default Navbar;