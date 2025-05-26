# MTB Races Backend

A Node.js backend service that scrapes and aggregates mountain bike race information from various sources.

## Current Sources

-   SI Entries

## Features

-   Scrapes race information from SI Entries
-   RESTful API endpoints for race data
-   TypeScript support
-   Express.js server

## Prerequisites

-   Node.js (v24)
-   pnpm package manager

## Setup

1. Clone the repository

2. Generate `.env` file from `.sample.env`

```bash
cp .sample.env .env
```

3. Install dependencies:

```bash
pnpm install
```

4. Create Docker container for PostgreSQL:

```bash
docker compose -f docker-compose-develop.yml up
```

5. Start the development server:

```bash
pnpm dev
```

6. For production, build and start:

```bash
pnpm build
pnpm start
```

## Database Migrations

To generate a migration after updating the DB schema, run:

```bash
pnpm migrate-generate
```

After checking the generated migration in the `drizzle` folder, apply the migration by running:

```bash
pnpm migrate-up
```

OR run the dev server which will automatically apply the migrations:

```bash
pnpm dev
```

## API Endpoints

### GET `/api/races`

Returns a list of upcoming mountain bike races.

### GET `/api/races/scrape`

Triggers a new scrape of race data from SI Entries.

### GET `/health`

Health check endpoint.

## Development

The project uses:

-   TypeScript for type safety
-   Express.js for the web server
-   Puppeteer for web scraping
-   Nodemon for development auto-reload
-   Drizzle for database migrations

## Project Structure

```
src/
  ├── index.ts      # Application entry point
  ├── apps/         # Feature modules
  │   └── races/    # Race-related endpoints and services
  ├── lib/          # Shared libraries
  │   └── scrapers/ # Web scraping implementations
  │   └── utils/    # Utility functions
  ├── types/        # TypeScript type definitions
  ├── enums/        # Shared enums
```
