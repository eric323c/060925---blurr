# Blurr Messaging Platform

This repository hosts the initial project setup for **Blurr**, a progressive web app (PWA) messaging platform. The app is designed to work seamlessly on desktop and mobile devices, including iPhones via Vercel deployment.

## Project Structure

- `frontend/` – Next.js project containing the PWA client.
- `backend/`  – Express server skeleton for API and real-time messaging.

Both folders contain their own `package.json` files but dependencies are not installed in this environment.

## Getting Started

1. Install Node.js (v18 or later recommended).
2. Install dependencies in each folder:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. To run the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd ../backend
   npm start
   ```
4. The application can be deployed to Vercel. Adjust environment variables in `vercel.json` as needed.

## PWA Features

The `frontend` app includes a `manifest.json` and simple service worker setup for offline support and installation on mobile devices.

