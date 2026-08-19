import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {

    const { user } = useAuth();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "bi-speedometer2",
            roles: [
                "ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ]
        },
        {
            name: "Employees",
            path: "/employees",
            icon: "bi-people",
            roles: [
                "ADMIN",
                "MANAGER"
            ]
        },
        {
            name: "Departments",
            path: "/departments",
            icon: "bi-building",
            roles: [
                "ADMIN",
                "MANAGER"
            ]
        },
        {
            name: "Attendance",
            path: "/attendance",
            icon: "bi-clock-history",
            roles: [
                "ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ]
        },
        {
            name: "Leaves",
            path: "/leaves",
            icon: "bi-calendar-check",
            roles: [
                "ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ]
        }
    ];


    const visibleMenuItems =
        menuItems.filter((item) =>
            item.roles.includes(user?.role)
        );


    return (

        <aside className="sidebar">

            <div className="sidebar-brand">

                <h4>
                    WorkSphere
                </h4>

                <small>
                    HRMS
                </small>

            </div>


            <nav className="sidebar-menu">

                {visibleMenuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >

                        <i
                            className={`bi ${item.icon}`}
                        ></i>

                        <span>
                            {item.name}
                        </span>

                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}

export default Sidebar;