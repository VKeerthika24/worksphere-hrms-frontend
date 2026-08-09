import { NavLink } from "react-router-dom";

function Sidebar() {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "bi-speedometer2"
        },
        {
            name: "Employees",
            path: "/employees",
            icon: "bi-people"
        },
        {
            name: "Departments",
            path: "/departments",
            icon: "bi-building"
        },
        {
            name: "Attendance",
            path: "/attendance",
            icon: "bi-clock-history"
        },
        {
            name: "Leaves",
            path: "/leaves",
            icon: "bi-calendar-check"
        }
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">
                <h4>WorkSphere</h4>
                <small>HRMS</small>
            </div>

            <nav className="sidebar-menu">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <i className={`bi ${item.icon}`}></i>

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