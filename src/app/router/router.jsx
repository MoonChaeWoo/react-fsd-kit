import {createBrowserRouter} from "react-router-dom";
import {PublicLayout, PrivateLayout} from "../layouts";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import DashboardPage from "../../pages/DashboardPage/DashboardPage";
import SignupPage from "../../pages/SignupPage/SignupPage";
import MapPage from "../../pages/MapPage/MapPage";
import TestPage from "../../pages/TestPage/TestPage";

const router = createBrowserRouter([
    {
        path: '/',
        Component: PublicLayout,
        children: [
            { index: true, Component: HomePage, handle: { layout: true } },
            { path: 'login', Component: LoginPage, handle: { layout: false } },
            { path: 'signup', Component: SignupPage, handle: { layout: false } },
            { path: 'map', Component: MapPage, handle: { layout: false } },
            { path: 'test', Component: TestPage, handle: { layout: false } }
        ],
    },
    {
        path: '/',
        Component: PrivateLayout,
        children: [
            { path: 'dashboard', Component: DashboardPage, handle: { layout: false } }
        ],
    },
]);

export default router;