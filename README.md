# MD Baku Web Platform

A modern, full-stack web application built with **Next.js (App Router)** and **TypeScript**. This repository contains the source code for the MD Baku public platform, featuring a dynamic frontend, multi-language support, and an integrated administration dashboard.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)

## 🚀 Features

* **Next.js App Router:** Built using the latest React Server Components architecture.
* **Admin Dashboard:** Dedicated interface (`/admin`) for content management and system administration.
* **Localization System:** Custom language priority logic and multi-language support.
* **Secure Proxy:** Integrated `proxy.ts` for handling API requests and avoiding CORS issues.
* **Modern UI:** Responsive design with optimized CSS/PostCSS architecture.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/)
* **Language:** TypeScript
* **Styling:** PostCSS / CSS Modules
* **Linting:** ESLint
* **Package Manager:** NPM

## 📂 Project Structure

```bash
├── app/            # App Router pages, layouts, and API routes
├── components/     # Reusable UI components
├── lib/            # Business logic and utility functions
├── public/         # Static assets
├── proxy.ts        # Custom API proxy configuration
├── next.config.ts  # Next.js configuration
└── ...config files

