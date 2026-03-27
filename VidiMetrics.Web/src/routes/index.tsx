import { AppRoute } from "@/types/ui";


import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Recovery from "@/pages/Auth/Recovery";
import UserHome from "@/pages/Dashboard/User/Home";
import Home from "@/pages/Main/Home";

// =============================
// 🚀 MAIN ROUTES
// =============================
export const MainRoutes: AppRoute[] = [
    {
        path: "/",
        label: "Home",
        element: <Home />,
    },
    {
        path: "/",
        label: "Games",
        element: <Home />,
    },
    {
        path: "/",
        label: "Fans",
        element: <Home />,
    },
    {
        path: "/",
        label: "Contact Us",
        element: <Home />,
    },
    {
        path: "/",
        label: "About Us",
        element: <Home />,
    },
];
// =============================
// 🚀 USER ROUTES
// =============================
export const AppUserRoutes: AppRoute[] = [
    {
        path: "/dashboard",
        label: "Dashboard",
        element: <UserHome />,
    },
];
// =============================
// 🚀 Auth ROUTES
// =============================
export const AuthRoutes: AppRoute[] = [
    {
        path: "/login",
        label: "Login",
        element: <Login />,
    },
    {
        path: "/register",
        label: "Register",
        element: <Register />,
    },
    {
        path: "/recovery",
        label: "Recovery",
        element: <Recovery />,
    },
];
// =============================
// 🚀 ADMIN ROUTES
// =============================
export const AppAdminRoutes: AppRoute[] = [

];