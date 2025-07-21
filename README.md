# 🚵‍♂️ MTB Races Backend

> A lightning-fast Node.js backend service that scrapes and aggregates mountain bike race information from across the web.

[![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791.svg)](https://www.postgresql.org/) ![Code Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

## 🎯 Current Sources

- **SI Entries**
- **British Cycling**

## ✨ Features

- 🕷️ **Smart Web Scraping** - Automated race information extraction from SI Entries
- 🚀 **RESTful API** - Clean, fast endpoints for aggregated race data
- 🧪 **Comprehensive Testing** - Extensive test suite with Vitest
- 🐳 **Docker Ready** - Containerized development and testing environments

## 🛠 Prerequisites

- **Node.js** v24+
- **pnpm** package manager
- **Docker** & Docker Compose

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

### 3. Spin Up Development Environment

```bash
docker compose -f docker-compose-develop.yml up
```

### 4. Start Development Server

```bash
pnpm dev
```

## 🌐 Production

### Start Production Server

```bash
pnpm start
```

## 🧪 Running Tests

### 1. Setup Test Environment

```bash
# Start test database
docker compose -f docker-compose-test.yml up

# Create test environment file
cp .sample.env .env.test
```

### 2. Run Test Suite

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

## ⚒️ Jobs

| Queue Name         | Schedule            | Description                          |
| ------------------ | ------------------- | ------------------------------------ |
| `SI_SCRAPER_QUEUE` | 00:00 every monday  | 📋 Scrape races from SI Entries      |
| `BC_SCRAPER_QUEUE` | 00:00 every tuesday | 📋 Scrape races from British Cycling |

## 🏗️ Tech Stack

| Category             | Technology           |
| -------------------- | -------------------- |
| **Runtime**          | Node.js + TypeScript |
| **Framework**        | Express.js           |
| **Database**         | PostgreSQL           |
| **Scheduling**       | pg-boss              |
| **Testing**          | Vitest               |
| **Scraping**         | Puppeteer            |
| **Containerization** | Docker               |
| **Hosting**          | Azure                |

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
