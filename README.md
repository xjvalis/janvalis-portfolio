# Janvalis Portfolio

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/xjvalis/janvalis-portfolio.git
cd janvalis-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your actual credentials:

```bash
cp .env.example .env.local
```

You'll need to configure:
- **EmailJS credentials**: Get your Service ID, Template ID, and API keys from [EmailJS](https://www.emailjs.com)
- **Contact email**: The email where you want to receive contact form messages
- **Admin password**: A secure password for the admin panel

### 4. Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building

```bash
npm run build
```

## Deployment

This project is configured to run on Vercel with serverless functions.

### Before deploying:

1. Go to your Vercel project settings
2. Add the environment variables from `.env.local` to the Vercel environment
3. Make sure your Vercel project is connected to this GitHub repository

### Deploy

```bash
npm run build
git push origin main
```

Vercel will automatically deploy on push to main branch.

## Features

- Portfolio with project showcase
- Admin panel for managing projects and settings
- Contact form with email notifications
- Responsive design
- Dark theme

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Vercel Serverless Functions
- **Email**: EmailJS
- **Routing**: React Router
- **State Management**: TanStack Query
