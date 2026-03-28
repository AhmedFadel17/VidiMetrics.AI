import { AppRoute } from "@/types/ui";


import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Recovery from "@/pages/Auth/Recovery";
import UserHome from "@/pages/Dashboard/User/Home";
import Home from "@/pages/Main/Home";
import AIInsights from "@/pages/Main/AIInsights";

import Features from "@/pages/Main/Features";
import Storyboarder from "@/pages/Main/Storyboarder";
import PricingPage from "@/pages/Main/Pricing";
import API from "@/pages/Main/API";
import Documentation from "@/pages/Main/Documentation";
import Tutorials from "@/pages/Main/Tutorials";
import Community from "@/pages/Main/Community";
import Blog from "@/pages/Main/Blog";
import About from "@/pages/Main/About";
import Careers from "@/pages/Main/Careers";
import Contact from "@/pages/Main/Contact";
import Partners from "@/pages/Main/Partners";
import Privacy from "@/pages/Main/Privacy";
import Terms from "@/pages/Main/Terms";
import Cookie from "@/pages/Main/Cookie";

// =============================
// 🚀 NAVBAR ROUTES
// =============================
export const NavbarRoutes: AppRoute[] = [
    { path: "/", label: "Home", element: <Home /> },
    { path: "/features", label: "Features", element: <Features /> },
    { path: "/ai-insights", label: "AI Insights", element: <AIInsights /> },
    { path: "/pricing", label: "Pricing", element: <PricingPage /> },
    { path: "/community", label: "Community", element: <Community /> },
];

// =============================
// 🚀 MAIN ROUTES
// =============================
export const MainRoutes: AppRoute[] = [
    { path: "/", label: "Home", element: <Home /> },
    { path: "/ai-insights", label: "AI Insights", element: <AIInsights /> },
    { path: "/features", label: "Features", element: <Features /> },
    { path: "/storyboarder", label: "Storyboarder", element: <Storyboarder /> },
    { path: "/pricing", label: "Pricing", element: <PricingPage /> },
    { path: "/api", label: "API", element: <API /> },
    { path: "/documentation", label: "Documentation", element: <Documentation /> },
    { path: "/tutorials", label: "Tutorials", element: <Tutorials /> },
    { path: "/community", label: "Community", element: <Community /> },
    { path: "/blog", label: "Creator Blog", element: <Blog /> },
    { path: "/about", label: "About", element: <About /> },
    { path: "/careers", label: "Careers", element: <Careers /> },
    { path: "/contact", label: "Contact", element: <Contact /> },
    { path: "/partners", label: "Partners", element: <Partners /> },
    { path: "/privacy", label: "Privacy Policy", element: <Privacy /> },
    { path: "/terms", label: "Terms of Service", element: <Terms /> },
    { path: "/cookie", label: "Cookie Policy", element: <Cookie /> },
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