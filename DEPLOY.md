# 🚀 Deployment Guide: Netlify + Render Showcase

This guide provides step-by-step instructions to deploy the **Atomic NFV Orchestration Tool** for a live showcase.

-   **Frontend:** Deployed to **Netlify** (static SPA hosting).
-   **Backend:** Deployed to **Render** (Node.js web service).

---

## 1. Backend Deployment (Render)

Render allows you to deploy the Node.js backend on a free instance. We have configured a `render.yaml` Blueprint file, which makes setup automatic.

### Option A: Deploy via Blueprint (Recommended)
1. Push your repository to GitHub or GitLab.
2. Log in to [Render](https://dashboard.render.com/).
3. Click **New** > **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` configuration:
    - Service Name: `sdn-orchestration-backend`
    - Run root: `Backend/`
    - Env variables: `MOCK_DATA=true` (runs statelessly in-memory, avoiding the need for database setup).
6. Click **Apply**.
7. Once deployed, note down your backend URL (e.g., `https://sdn-orchestration-backend.onrender.com`).

### Option B: Manual Web Service Setup
If you prefer not to use blueprints:
1. Click **New** > **Web Service**.
2. Connect your repository.
3. Configure the following settings:
    - **Name:** `sdn-orchestration-backend`
    - **Root Directory:** `Backend`
    - **Language/Runtime:** `Node`
    - **Build Command:** `npm install && npm run build`
    - **Start Command:** `npm start`
4. Add the following **Environment Variables** in the service settings:
    - `MOCK_DATA` = `true`
    - `JWT_SECRET` = `your-custom-jwt-secret-key`
5. Click **Deploy Web Service**.

---

## 2. Frontend Deployment (Netlify)

Netlify serves the compiled React single-page application.

1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Connect your GitHub repository.
4. Netlify will read the root `netlify.toml` file automatically and configure:
    - **Base directory:** `Frontend`
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`
5. **Configure Redirect/Proxy:**
    - To connect the frontend to your Render backend, open `netlify.toml` (in your repository root and `Frontend/` folder) or `Frontend/public/_redirects`.
    - Replace the placeholder URLs (`https://YOUR-RENDER-BACKEND-URL.onrender.com`) with your actual Render backend URL (e.g., `https://sdn-orchestration-backend.onrender.com`).
    - Commit and push the changes. Netlify will trigger a new build.
6. Once deployed, you will get a Netlify URL (e.g., `https://atomic-platform.netlify.app`).

---

## 3. Resilient Showcase Experience

To ensure a seamless experience for visitors:
-   **Render Free-Tier Spin Down:** Render's free tier spins down web services after 15 minutes of inactivity. The first visitor will experience a cold-start delay of ~50 seconds.
-   **Local Fallback Auth:** The frontend is optimized to handle this delay. If a user registers or logs in while the Render backend is sleeping, the frontend will automatically catch the timeout/failure and complete the authentication using **browser-local storage**. The visitor can explore the dashboard instantly!
