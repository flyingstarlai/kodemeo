## Kodemeo Frontend

### This project is a Vite + React + TypeScript application for the Kodemeo platform.

## Prerequisites

```
Node.js v16+

bun

Git
```

## Initial Setup

Clone the repository
```
git clone https://github.com/flyingstarlai/kodemeo.git
cd kodemeo
```
## Install dependencies (pick one)
```
bun install
```

## Environment variables

Copy .env.example to .env:

```
cp .env.example .env
```
Edit .env and set:
```
VITE_API_URL=http://localhost:3000
```

## Running in Development

```
bun run dev
```
## Folder Structure
 
```
src/
├── assets/           # images, fonts, templates
├── components/       # shared UI components
├── features/         # feature-specific hooks, types, utils
├── routes/           # TanStack Router file-based routes
├── stores/           # Zustand or other stores
├── lib/              # utility functions, API client
├── App.tsx           # root component
├── main.tsx          # Vite entry
└── index.css         # global styles
```
## Troubleshooting


Docker env: if running in Docker, pass VITE_API_URL via build.args or .env.production.


### Happy coding! 🐱‍💻