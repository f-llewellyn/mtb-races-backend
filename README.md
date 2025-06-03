# 🚵‍♂️ MTB Races Backend

> A lightning-fast Node.js backend service that scrapes and aggregates mountain bike race information from across the web.

[![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791.svg)](https://www.postgresql.org/)

## 🎯 Current Sources

-   **SI Entries**

## ✨ Features

-   🕷️ **Smart Web Scraping** - Automated race information extraction from SI Entries
-   🚀 **RESTful API** - Clean, fast endpoints for aggregated race data
-   🧪 **Comprehensive Testing** - Extensive test suite with Vitest
-   🐳 **Docker Ready** - Containerized development and testing environments

## 🛠 Prerequisites

-   **Node.js** v24+
-   **pnpm** package manager
-   **Docker** & Docker Compose

## 🚀 Quick Start

### 1. Clone & Configure

```bash
git clone <repository-url>
cd mtb-races-backend

# Generate environment file
cp .sample.env .env
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Spin Up Database

```bash
docker compose -f docker-compose-develop.yml up
```

### 4. Launch Development Server

```bash
pnpm dev
```

### 5. Production Build

```bash
pnpm build
pnpm start
```

## 🧪 Running Tests

### Setup Test Environment

```bash
# Start test database
docker compose -f docker-compose-test.yml up

# Create test environment file
cp .sample.env .env.test
```

### Run Test Suite

```bash
pnpm test
```

> 💡 **Note:** Migrations are automatically applied to the test database when running tests.

## 🗄️ Database Management

### Generate New Migration

```bash
pnpm migrate:generate
```

### Apply Migrations

```bash
# Manual application
pnpm migrate:up

# Or start dev server (auto-applies migrations)
pnpm dev
```

## 🛣️ API Endpoints

| Endpoint            | Method | Description                                |
| ------------------- | ------ | ------------------------------------------ |
| `/api/races`        | GET    | 📋 Fetch upcoming mountain bike races      |
| `/api/races/scrape` | GET    | 🔄 Trigger fresh scrape of SI Entries data |
| `/health`           | GET    | ❤️ Service health check                    |

## 🏗️ Tech Stack

| Category             | Technology           |
| -------------------- | -------------------- |
| **Runtime**          | Node.js + TypeScript |
| **Framework**        | Express.js           |
| **Database**         | PostgreSQL           |
| **Testing**          | Vitest               |
| **Scraping**         | Puppeteer            |
| **Containerization** | Docker               |

## 📁 Project Architecture

```
src/
  ├── 🚀 index.ts          # Application entry point
  ├── 📱 apps/             # Feature modules
  │   └── races/           # Race endpoints & services
  ├── 📚 lib/              # Shared libraries
  │   ├── scrapers/        # Web scraping implementations
  │   └── utils/           # Utility functions
  ├── 🗄️ db/               # Database configuration
  ├── 🏷️ types/            # TypeScript definitions
  └── 📋 enums/            # Shared enumerations
test/                      # 🧪 Test suite (mirrors src/)
```

---

<div align="center">
  <p><strong>Built with ❤️ for the mountain biking community</strong></p>
</div>
