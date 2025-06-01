# MTB Races Backend

A Node.js backend service that scrapes and aggregates mountain bike race information from various sources.

## Current Sources

-   SI Entries

## Features

-   Scrapes race information from SI Entries
-   Exposes aggregated race data through RESTful API endpoints-

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

## Running Tests

1. First create a docker container for the test the following command:

```bash
docker compose -f docker-compose-test.yml up
```

1. Then create a `.env.test` file from `.sample.env`, ensuring to set the `DATABASE_URL` to point to the test database:

```bash
cp .sample.env .env.test
```

3. Then run the tests using:

```bash
pnpm test
```

#### NOTE: All migrations will be applied to the test database automatically when running tests.

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

Triggers a new scrape of race data from SI Entries and saves to a databse.

### GET `/health`

Health check endpoint.

## Development

The project uses:

-   TypeScript
-   Node.js
-   Express.js
-   PostgreSQL
-   Docker
-   Vitest
-   Puppeteer

## Project Structure

```
src/
  ├── index.ts      # Application entry point
  ├── apps/         # Feature modules
  │   └── races/    # Race-related endpoints and services
  ├── lib/          # Shared libraries
  │   └── scrapers/ # Web scraping implementations
  │   └── utils/    # Utility functions
  ├── db/           # Database configuration
  ├── types/        # TypeScript type definitions
  ├── enums/        # Shared enums
test/               # Test files mirroring src structure
```
