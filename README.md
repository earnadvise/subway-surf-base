# Base Runner 🏃‍♂️💨

A fully functional browser-based 3D endless runner game inspired by Subway Surfers, featuring a futuristic cyberpunk neon Base ecosystem theme. Built with React, TypeScript, Tailwind CSS, Vite, and React Three Fiber. Includes Web3 integration using RainbowKit + Wagmi.

## Features

- **3D Endless Runner Gameplay**: Dodge obstacles (Hover trains, Energy barriers, Broken cyber roads) and collect Base coins.
- **Responsive Controls**: Desktop (Arrow keys/WASD) and Mobile (Swipe gestures).
- **Web3 Integrated**: Connect your wallet (MetaMask, Coinbase, etc.) to access the Builder Dashboard.
- **Builder Dashboard**: Enter your Builder Code (`bc_z10us01u`), earn XP, level up your rank, and claim mock NFT rewards.
- **Base Ecosystem Theme**: Neon blue/purple aesthetics, dark mode, and glowing particle effects.
- **AAA Quality UI**: Glassmorphism dashboard, dynamic animations, and responsive layout.

## Tech Stack

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Engine**: React Three Fiber, Three.js
- **State Management**: Zustand
- **Web3**: RainbowKit, Wagmi, Viem
- **Icons**: Lucide React

## Setup & Run Locally

1. **Clone the repository** (or download the files)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Copy the `.env.example` file to `.env` and configure your WalletConnect Project ID:
   ```bash
   cp .env.example .env
   # Edit .env and replace "your_project_id_here" with your actual WalletConnect ID
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. Open your browser to the local server URL provided (usually `http://localhost:5173`).

## Vercel Deployment Instructions

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Ensure the Framework Preset is set to **Vite**.
5. Add the Environment Variable `VITE_WALLETCONNECT_PROJECT_ID` with your project ID.
6. Click **Deploy**.

## Gameplay Controls

### Desktop
- **Left/Right**: Move across the 3 lanes (`Arrow Left/Right` or `A/D`)
- **Jump**: Jump over broken roads/low obstacles (`Arrow Up`, `W`, or `Space`)
- **Slide**: Slide under floating energy barriers (`Arrow Down` or `S`)

### Mobile
- **Swipe Left/Right**: Change lanes
- **Swipe Up**: Jump
- **Swipe Down**: Slide

## Builder Mechanics

1. Connect your Web3 wallet on the landing page.
2. Navigate to the **Builder Hub**.
3. Enter the default Builder Code to verify: `bc_z10us01u`
4. Gain XP by playing the game, collecting coins, and breaking high scores!
