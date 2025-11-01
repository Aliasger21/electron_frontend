import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import Home from "../pages/user/Home";

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
