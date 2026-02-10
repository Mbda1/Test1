# Starter Environment and Codebase

This repository now includes a clean starter Node.js codebase with environment-based configuration and tests.

## 1) Create a new environment

Copy the example environment file:

```bash
cp .env.example .env
```

Update values in `.env` as needed.

## 2) Run the project

```bash
npm start
```

The server exposes:

- `/` — basic app status text
- `/health` — JSON health endpoint

## 3) Run tests

```bash
npm test
```

## Project structure

- `src/config.js` — centralized environment/config parsing
- `src/index.js` — HTTP server bootstrap
- `tests/*.test.js` — Node test suite
