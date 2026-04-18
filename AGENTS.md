🤖 Project Charter: VidiMetrics Platform
This document serves as the single source of truth for the VidiMetrics project, detailing its purpose, technical stack, architectural conventions, and coding guidelines. All future development, feature requests, and architectural discussions must align with the principles set forth here.

🎯 Project Purpose
The primary goal of VidiMetrics is to provide a comprehensive, AI-enhanced platform for [Placeholder: Describe the core business function, e.g., video content lifecycle management, marketing analytics, etc.]. The platform aims to unify various stages of content creation and monetization, offering users sophisticated tools ranging from content ideation (Storyboarding) to analytics and deployment.

Key Value Proposition: Unifying the creative, analytical, and business sides of content production into one cohesive web experience.
🧱 Current Tech Stack
The project employs a modern, decoupled architecture.

Frontend (Client Application - VidiMetrics.Web)
Framework: React (Functional Components)
Language: TypeScript (Strict Typing enforced)
Build Tool: Vite
State Management: Redux Toolkit (The global state store is managed via react-redux).
Routing: React Router DOM
Styling: Tailwind CSS (Utilizing component-scoped CSS Modules where necessary, e.g., Dashboard.module.css).
Authentication: OpenID Connect (OIDC) via react-oidc-context.
UI Components: Custom, reusable components are being developed and stored in src/components/.
Backend & Services (Inferred)
The presence of multiple projects (VidiMetrics.API, VidiMetrics.Application, etc.) suggests a modular .NET/C# backend structure responsible for core business logic, data access, and API provision.
API Interaction: Handled via axios and dedicated API service layers (e.g., identityApi.ts, mainApi.ts).
📂 Project Structure Overview
The codebase adheres to a clear separation of concerns:

Core Modules: Found in the root of the service projects (VidiMetrics.Domain, VidiMetrics.DataAccess, etc.).
Client Presentation: The entire client logic resides in VidiMetrics.Web/.
src/pages/: Contains the top-level routes and page containers (e.g., /Dashboard/User/, /pages/Main/).
src/layouts/: Defines structural shells for different user contexts (e.g., DashboardLayout, AuthLayout).
src/store/: Centralized Redux slice management.
src/components/: Contains highly reusable, presentational, and structural components, including Guards (AdminRoute).
src/api/: Contains service definitions for network communication.
📏 Coding Guidelines & Conventions
1. Naming Conventions
Components/Pages: PascalCase (e.g., UserProfileCard.tsx, DashboardLayout.tsx).
Variables/Functions: camelCase (e.g., isLoading, handleSaveData).
Constants: SCREAMING_SNAKE_CASE (e.g., MAX_RETRIES).
File Structure: Components should live near their usage, following a module pattern.
2. Component Architecture
Container/Presentational Split: Components should favor a clear separation. Large stateful components (Containers) manage state and data fetching, passing props down to pure UI components (Presentational).
Prop Drilling: Minimize prop drilling; utilize React Context where state needs to be accessed across multiple levels without passing props manually.
3. State Management
Source of Truth: The Redux/Context store must be the single source of truth for global state.
Immutability: All state updates must adhere to immutability principles.
4. Error Handling & Loading States
Atomic Components: Every feature/component should manage its own loading, error, and success states locally where possible.
Global Catch: Global error boundaries (<ErrorBoundary>) must wrap major sections of the application to prevent total UI crashes.
5. Accessibility (A11y)
All interactive elements must include appropriate ARIA roles and semantic HTML markup.
All components must be testable for keyboard navigation.