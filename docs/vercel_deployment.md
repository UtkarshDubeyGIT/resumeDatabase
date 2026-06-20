# Vercel Deployment Guide

## Overview

The Next.js frontend is deployed on Vercel. All `/api/*` requests are proxied to the Render backend via URL rewrites.

## Architecture

```
User ──> Vercel (Next.js) ──rewrite──> Render (Express backend)
           resumint.vercel.app           resumint-backend-j047.onrender.com
```

The Next.js app handles:
- Page routing (App Router)
- Static assets and SSR
- OAuth callback URLs (Google redirects to the Vercel domain)
- All actual API logic is delegated to the Express backend on Render

## vercel.json

The deployment config is at the project root:

```json
{
  "buildCommand": "next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://resumint-backend-j047.onrender.com/api/:path*" }
  ]
}
```

### Key details

- **`framework: "nextjs"`** — Vercel auto-detects Next.js; this explicitly sets the build preset
- **`installCommand: "npm install"`** — Installs dependencies from root `package.json` (shared deps: better-auth client, next-themes, sonner, zod, etc.)
- **`rewrites`** — All `/api/*` requests are forwarded to the Render backend at `https://resumint-backend-j047.onrender.com/api/*`. This means the frontend calls `/api/profile`, `/api/history`, etc. as if they were same-origin, but Vercel proxies them to the backend
- **`outputDirectory: ".next"`** — Standard Next.js output directory

## Environment Variables

Set these in the Vercel dashboard (Settings → Environment Variables):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | The Vercel deployment URL (e.g., `https://resumint.vercel.app`) |
| `BETTER_AUTH_URL` | Must match `NEXT_PUBLIC_APP_URL` (for OAuth callback generation) |
| `BETTER_AUTH_SECRET` | Must match the Render backend's secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (must match backend) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (must match backend) |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENCODE_API_KEY` | API key for the AI provider |

> **Note:** `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `CORS_ORIGIN` on the Render side must match the Vercel domain exactly. If you change the Vercel deployment URL, update both sides.

## Google OAuth Configuration

In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), the Authorized redirect URI must point to the Vercel domain:

```
https://resumint.vercel.app/api/auth/callback/google
```

## Deployment Flow

1. Push to the `main` branch (or connect Vercel to the GitHub repo)
2. Vercel automatically detects the Next.js project, runs `next build`, and deploys
3. The frontend is available at `https://resumint.vercel.app`

## Local Preview

To test the full stack locally:

1. Start the backend: `cd server && npm run dev` (runs on `http://localhost:8080`)
2. Start the frontend: `npm run dev` (runs on `http://localhost:3000`)
3. The Vercel `rewrites` only apply in production; during development, API calls go directly to `http://localhost:8080` (configured via `BETTER_AUTH_URL` in your `.env.local`)

## Troubleshooting

- **API calls returning 404**: Verify the `rewrites` destination URL in `vercel.json` matches the deployed Render URL. Check Render logs to confirm the backend is running.
- **OAuth callback errors**: Ensure `BETTER_AUTH_URL` is set to the Vercel domain (not `localhost` or the Render domain). Verify the Google OAuth redirect URI matches exactly.
- **CORS errors**: The backend's `CORS_ORIGIN` must include the Vercel domain. This is configured in the Render dashboard env vars.
- **Build failures**: Check Vercel build logs. Common issues: missing dependencies, TypeScript errors, or mismatched Next.js versions.
