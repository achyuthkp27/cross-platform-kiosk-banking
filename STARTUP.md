# Development Startup Guide

Quick reference for starting the Kiosk Banking application in different modes.

## Quick Start

### Option 1: Full Stack (Real API)

```bash
# Terminal 1 - Start Backend API
cd backend && mvn spring-boot:run

# Terminal 2 - Start Frontend (Real Mode)
EXPO_PUBLIC_DATA_MODE=REAL npm run web
```

### Option 2: Frontend Only (Mock Data)

```bash
# No backend needed
EXPO_PUBLIC_DATA_MODE=MOCK npm run web
```

---

## Frontend Commands

| Mode | Command | Description |
|------|---------|-------------|
| **Mock** | `EXPO_PUBLIC_DATA_MODE=MOCK npm run web` | Uses local mock data, no backend needed |
| **Real** | `EXPO_PUBLIC_DATA_MODE=REAL npm run web` | Connects to backend API at localhost:8080 |

## Backend Commands

| Command | Description |
|---------|-------------|
| `cd backend && mvn spring-boot:run` | Start Spring Boot on port 8080 |
| `cd backend && mvn clean install` | Build the project |
| `cd backend && mvn test` | Run tests |

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8081 |
| Backend API | http://localhost:8080 |

## Prerequisites

Before starting in **REAL** mode:

1. PostgreSQL must be running: `pg_isready`
2. Database must exist: `psql -U postgres -d kiosk_db -c "\dt"`
3. See `backend/db/README.md` for database setup

## Stop Services

- Frontend: `Ctrl+C` in terminal
- Backend: `Ctrl+C` in terminal
