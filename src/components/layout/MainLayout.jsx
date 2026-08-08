import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-section">

                <Navbar />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default MainLayout;