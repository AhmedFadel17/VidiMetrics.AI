import { AppRoute } from "@/types/ui";


import Register from "@/pages/Auth/Register";
import Recovery from "@/pages/Auth/Recovery";
import LoginError from "@/pages/Auth/LoginError";
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
import CallbackPage from "@/pages/Auth/Callback";
import SeriesLibrary from "@/pages/Dashboard/User/Series";
import SeriesSetup from "@/pages/Dashboard/User/Series/SeriesSetup";
import SeriesDetails from "@/pages/Dashboard/User/Series/Details";
import EpisodeSetup from "@/pages/Dashboard/User/Episodes/EpisodeSetup";
import EpisodeDetails from "@/pages/Dashboard/User/Episodes/Details";
import CharacterDetails from "@/pages/Dashboard/User/Characters/Details";
import CharacterSetup from "@/pages/Dashboard/User/Characters/CharacterSetup";
import EnvironmentDetails from "@/pages/Dashboard/User/Environments/Details";
import SceneSetup from "@/pages/Dashboard/User/Scenes/SceneSetup";
import SceneDetails from "@/pages/Dashboard/User/Scenes/Details";
import EnvironmentSetup from "@/pages/Dashboard/User/Environments/EnvironemntSetup";


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
    {
        path: "/dashboard/series",
        label: "Series Library",
        element: <SeriesLibrary />,
    },
    {
        path: "/dashboard/series/new",
        label: "Series Setup",
        element: <SeriesSetup />,
    },
    {
        path: "/dashboard/series/:id",
        label: "Series Workspace",
        element: <SeriesDetails />,
    },
    {
        path: "/dashboard/series/:showId/episodes/:id",
        label: "Eposides",
        element: <EpisodeDetails />,
    },
    {
        path: "/dashboard/series/:showId/episodes/new",
        label: "Eposides",
        element: <EpisodeSetup />,
    },
    {
        path: "/dashboard/series/:showId/characters/:id",
        label: "Characters",
        element: <CharacterDetails />,
    },
    {
        path: "/dashboard/series/:showId/characters/new",
        label: "Characters",
        element: <CharacterSetup />,
    },
    {
        path: "/dashboard/series/:showId/episodes/:episodeId/scenes/new",
        label: "Scenes",
        element: <SceneSetup />,
    },
    {
        path: "/dashboard/series/:showId/environments/:id",
        label: "Environments",
        element: <EnvironmentDetails />,
    },
    {
        path: "/dashboard/series/:showId/environments/new",
        label: "Environments",
        element: <EnvironmentSetup />,
    },
    {
        path: "/dashboard/scenes/:id",
        label: "Scenes",
        element: <SceneDetails />,
    },

];
// =============================
// 🚀 Auth ROUTES
// =============================
export const AuthRoutes: AppRoute[] = [
    {
        path: "/callback",
        label: "Callback",
        element: <CallbackPage />,
    },
    {
        path: "/login-error",
        label: "Login Error",
        element: <LoginError />,
    },
];
// =============================
// 🚀 ADMIN ROUTES
// =============================
export const AppAdminRoutes: AppRoute[] = [

];