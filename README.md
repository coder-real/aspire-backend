# Aspire Backend

Express + TypeScript API for the Aspire school management platform.

## Local setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Create a local PostgreSQL database named `aspire_dev`
5. Run `psql aspire_dev < docs/schema.sql` to initialise the schema
6. `npm run dev`

API runs at `http://localhost:4000`  
Health check: `GET http://localhost:4000/api/v1/health`

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/`    |
| `npm start`     | Run compiled production build    |

## Linked repos

- Frontend: [aspire-frontend](https://github.com/coder-real/aspire-frontend)
