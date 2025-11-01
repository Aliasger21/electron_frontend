import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--bg-dark)",
                color: "var(--text)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
