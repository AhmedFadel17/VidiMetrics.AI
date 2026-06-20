# 🎬 VidiMetrics.AI - Full-Stack Project Documentation & Guide

Welcome to the comprehensive system manual for the **VidiMetrics.AI** ecosystem. This unified repository powers an intelligent, multi-tenant digital production studio and content distribution pipeline. It automates generative AI media workflows, script orchestration, full-stack subscriber accounting, and immediate semantic syndication across major global visual networks.

---

## 🚀 1. Ecosystem Overview & Architecture

VidiMetrics.AI bridges the gap between raw Generative AI frameworks and practical content management. Rather than interacting with disjointed image, text, and video models via disjointed browser tabs, creators use VidiMetrics as a centralized command center to script, generate, schedule, and measure automated episodic intellectual properties.
---
### 💼 1.1 Commercial Business & Monetization Engine
The platform implements a predictable consumption-based **SaaS Subscription Matrix** augmented by a transactional **Cryptographic Credit Ledger** to support granular pay-as-you-go high-performance processing:

* **Tiered Subscription Profiles:** Accounts map directly onto operational membership brackets (e.g., *Free*, *Pro*, *Studio Tier*) handled natively inside the core infrastructure data layouts. Brackets define base system resource bounds, concurrency thresholds, and recurring credit allocations.
* **Granular Credit Wallets (`UserCreditWallets`):** Every destructive or computationally expensive AI execution—such as generating structural character consistency faces, evaluating narrative script steps, or finalizing video synthesis cycles—locks and debits a precise resource cost.
* **Immutable Transaction Auditing (`CreditTransactionLedgers`):** Every financial change generates an un-alterable, sequentially linked record tracking transaction states, prevents balance drift, and isolates concurrency issues during concurrent generation loops.
* **Direct Multi-Channel Syndication:** Built-in secure external OAuth linkages facilitate automated, click-free video, thumbnail, metadata, and tag distribution instantly targeting **YouTube, TikTok, Instagram, and X (Twitter)** directly from internal job runner pipelines.

### 📊 1.2 Dashboard Workspace Capabilities
The primary portal moves away from flat administrative tabular views, providing a real-time command center:

* **The StoryEngine™ Workflow:** Provides complete macro-to-micro management over original creative assets. Projects scale cleanly from top-level **Shows**, extend through sequential **Episodes**, divide into distinct **Scenes**, and track long-term continuity metrics using localized contextual records for distinct **Characters** and environmental **Locations**.
* **AI Asset Integrity Metrics:** Helps prevent budget leakage with structural metrics. The system isolates **Total Generations** directly alongside **Total Unlinked Media** (orphan images, scripts, or video structures lacking active connections to an entity, character, or scene asset), allowing users to clean up or re-link assets to maintain tight asset hierarchies.
* **Weekly Production Agenda:** The UI provides an un-cluttered, time-slotted, responsive weekly agenda layout displaying processing states, distribution paths, and publication schedules across networks at a glance.
* **Omni-Channel Live Feed Telemetry:** Aggregates remote analytical endpoints natively into a clean dashboard interface, providing central tracking of global views, subscriber counts, and fulfillment results without needing to switch accounts.

---

## 🧱 2. Technology Stack Summary

### 💻 2.1 Client Application (Frontend)
- **Framework**: React 18 (Functional Components, Hooks)
- **Language**: TypeScript (Strict Typings)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (React-Redux)
- **Routing**: React Router DOM (v6)
- **Real-Time updates**: SignalR Client (`@microsoft/signalr`)
- **Styling**: Tailwind CSS + CSS Modules
- **Authentication**: OIDC/PKCE client (`react-oidc-context` / `oidc-client-ts`)

### ⚙️ 2.2 Services & API (Backend)
- **Framework**: ASP.NET Core 9.0 (Web API & Razor Pages)
- **Object Mapping**: AutoMapper
- **Validation**: FluentValidation
- **Message Broker**: MassTransit with RabbitMQ
- **Caching**: StackExchange.Redis Cache provider
- **OR/M & Database**: Entity Framework Core with Microsoft SQL Server

### 🔑 2.3 Identity & Auth Server
- **Framework**: OpenIddict (OAuth2 + OpenID Connect protocol server)
- **Identity Manager**: ASP.NET Core Identity with Razor Page templates

---

## 🛠️ 3. Local Setup Prerequisites

Ensure you have the following installed on your machine:
1. **.NET 9.0 SDK**: [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **Node.js (v20+)** & npm: [Download here](https://nodejs.org)
3. **SQL Server**: LocalDB or Docker instance
4. **Redis Server**: Ports `6379`
5. **RabbitMQ**: Ports `5672` (AMQP) & `15672` (Management Console)

---

## 🚀 4. Quick-Start Commands

You can run the entire ecosystem either using Docker Compose or locally via the CLI.

### Option A: Run via Docker Compose (Recommended)
This starts all databases, brokers, caches, and the 3 applications with a single command:
```bash
docker compose up --build
```
- **Web App**: http://localhost:5173
- **API Swagger**: http://localhost:5000/swagger
- **Identity Server**: http://localhost:5145
- **RabbitMQ Dashboard**: http://localhost:15672 (guest/guest)

### Option B: Local CLI Execution
Run each service individually. Make sure SQL Server, Redis, and RabbitMQ are running locally first.

1. **Database Migration Setup**:
   ```bash
   # Run Identity database migrations
   dotnet ef database update --project VidiMetrics.IdentityServer
   
   # Run API Core database migrations
   dotnet ef database update --project VidiMetrics.DataAccess --startup-project VidiMetrics.API
   ```

2. **Start the Identity Server**:
   ```bash
   cd VidiMetrics.IdentityServer
   dotnet run
   # Server runs on: http://localhost:5145
   ```

3. **Start the API Server**:
   ```bash
   cd VidiMetrics.API
   dotnet run --launch-profile "https"
   # Server runs on: https://localhost:7264 (HTTP fallback: http://localhost:5000)
   ```

4. **Start the React Frontend**:
   ```bash
   cd VidiMetrics.Web
   npm install
   npm run dev
   # Site runs on: http://localhost:5173
   ```

---

## 📋 Environment Variables & Configuration

Below is the configuration mapping for the three applications:

### 1. Frontend (`VidiMetrics.Web/.env`)
| Key | Type | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | URL | Target backend API host URL | `https://localhost:7264` |
| `VITE_API_NGROK_URL` | URL | Optional Ngrok proxy tunnel url | `https://truantly-toothiest-shenita.ngrok-free.dev` |
| `VITE_IDENTITY_SERVER_URL` | URL | OIDC identity provider endpoint URL | `http://localhost:5145` |
| `VITE_IDENTITY_CLIENT_ID` | String | Client identifier registered in OpenIddict | `vidimetrics_web_client` |
| `VITE_GOOGLE_CLIENT_ID` | String | Client credential key for Google Auth integration | `951906220760-p7fc...` |
| `VITE_TIKTOK_CLIENT_KEY` | String | Client credential key for TikTok API integration | `sbawwaaq7voe7i1vho` |

### 2. Backend API (`VidiMetrics.API/appsettings.json`)
| JSON Path / Env Key | Type | Description | Default / Example Value |
| :--- | :---: | :--- | :--- |
| `ConnectionStrings:DefaultConnection` | String | SQL Server database connection string | `Server=localhost;Database=VidiMetricsDb;...` |
| `ConnectionStrings:RedisConnection` | String | Redis cache broker connection address | `localhost:6379` |
| `FrontendSettings:BaseUrl` | URL | Allowed origin path for CORS validation | `http://localhost:5173` |
| `IdentityServerSettings:BaseUrl` | URL | Target OpenIddict authority issuer endpoint URL | `http://localhost:5145` |
| `RabbitMQ:Host` | String | MassTransit RabbitMQ host connection address | `localhost` |
| `ApisSettings:Pollinations:BaseUrl` | URL | Pollinations AI generation service URL | `https://gen.pollinations.ai` |
| `ApisSettings:Pollinations:ApiKey` | String | Bearer authorization API Key for AI service | `""` (Empty string) |

### 3. Identity Server (`VidiMetrics.IdentityServer/appsettings.json`)
| JSON Path / Env Key | Type | Description | Default / Example Value |
| :--- | :---: | :--- | :--- |
| `ConnectionStrings:DefaultConnection` | String | SQL Server database connection string | `Server=localhost;Database=VidiMetricsIdentityServerDb;...` |
| `RabbitMQ:Host` | String | MassTransit RabbitMQ host connection address | `localhost` |
| `IdentityServer:Clients:0:ClientId` | String | Primary SPA application client identifier | `vidimetrics_web_client` |
| `IdentityServer:Clients:0:BaseUrl` | URL | Redirect/CORS URL for SPA application | `http://localhost:5173` |
| `ApiEndpoints:VidiMetricsApi` | URL | Downstream Core API application URL | `https://localhost:7264` |
