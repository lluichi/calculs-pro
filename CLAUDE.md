# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Càlculs Pro is an educational math game web application for Catalan-speaking children to practice arithmetic operations. Users configure game parameters (operation type, digit count, decimals), answer generated problems, and compete on global leaderboards.

## Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Tech Stack

- **Frontend:** React 19 with Vite 7
- **Styling:** Tailwind CSS 4 (Vite plugin integration)
- **Backend:** Cloudflare Workers (serverless functions)
- **Database:** Cloudflare D1 (SQLite) for global rankings
- **Deployment:** Cloudflare Pages (CI/CD from git)

## Architecture

### Application State Machine (App.jsx)

The app uses 4 states: `INICIAL` → `JUGANT` → `REVISAT` → `CONFIGURANT`

### Key Data Flow

1. **Configuration** persists in localStorage: operation type (`tipus`), digit counts (`xifres1`, `xifres2`), decimal settings, number of operations
2. **operations.js** generates math problems based on config, validates user answers with floating-point tolerance
3. **scoring.js** calculates difficulty level (Fàcil/Mig/Difícil/Expert) and scores (0-3000+ points) based on accuracy, operation complexity, and time
4. **ranking.js** handles API calls to `/api/rankings` for global leaderboards

### Backend API

Single endpoint at `functions/api/rankings.js`:
- `GET /api/rankings?nivell=Fàcil` - Fetch top 100 rankings by level
- `POST /api/rankings` - Submit new ranking entry

### Database Schema (schema.sql)

Table `rankings` stores: name, score, level, operation type, correct/total counts, time, digit configuration

## Code Conventions

- All UI text is in Catalan
- Operation types: `sumes`, `restes`, `multiplicacions`, `divisions`, `arrels`
- Difficulty levels: `Fàcil`, `Mig`, `Difícil`, `Expert`
- Decimal separator: both `.` and `,` accepted in user input
- Mobile-first responsive design using Tailwind breakpoints (`sm:`)
