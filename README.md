# MTB Races Backend

A Node.js backend service that scrapes and aggregates mountain bike race information from various sources.

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
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. For production, build and start:

```bash
pnpm build
pnpm start
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
