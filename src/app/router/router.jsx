import {createBrowserRouter} from "react-router-dom";
import {PublicLayout, PrivateLayout} from "../layouts";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import DashboardPage from "../../pages/DashboardPage/DashboardPage";
import SignupPage from "../../pages/SignupPage/SignupPage";

const router = createBrowserRouter([
    {
        path: '/',
        Component: PublicLayout,
        children: [
            { index: true, Component: HomePage },
            { path: 'login', Component: LoginPage },
            { path: 'signup', Component: SignupPage }
        ],
    },
    {
        path: '/',
        Component: PrivateLayout,
        children: [
            { path: 'dashboard', Component: DashboardPage }
        ],
    },
]);

export default router;