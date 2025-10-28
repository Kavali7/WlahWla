# Repository Guidelines

## Project Structure & Module Organization
- `backend/` contains the Django services (`config/settings.py`, Celery config, apps: `accounts`, `billing`, `compliance`, `core`, `inventory`, `products`, `reports`). API routing sits in `config/urls.py`; HTML templates live in `billing/templates/`.
- `frontend/` is the Vite + React client (`src/main.tsx`, routes in `src/router.tsx`, feature pages in `src/pages`, reusable UI in `src/components`, shared state in `src/contexts`, utilities in `src/lib`).
- Root orchestration files (`docker-compose.yml`, `.env` samples) coordinate Postgres, Redis, Django, Celery, and the web client.

## Build, Test & Development Commands
- Backend setup: `python -m venv .venv`, `.\.venv\Scripts\activate`, `pip install -r requirements.txt`; run `python manage.py migrate`, then `python manage.py runserver`.
- Background jobs: `celery -A config worker -l info` for workers and `celery -A config beat -l info` for schedulers (run inside the backend virtualenv).
- Frontend: `npm install`, `npm run dev` on port 3000, `npm run build` for production bundles.
- Full stack: `docker compose up --build` at the repo root spins up Postgres, Redis, API, Celery, and frontend.

## Coding Style & Naming Conventions
- Python: PEP 8, 4-space indentation, snake_case functions, PascalCase models/serializers, imports grouped stdlib → third-party → local. Keep settings/Celery tasks idempotent and lean on serializers for validation.
- TypeScript: ES modules with function components. PascalCase components, camelCase hooks/utilities, Tailwind classes grouped logically. Keep API helpers in `src/lib` and shared state in `src/contexts`.

## Testing Guidelines
- Backend: add Django `TestCase` suites per app (e.g., `billing/tests/test_invoices.py`) and run via `python manage.py test`. Mock WhatsApp and PDF output so suites stay deterministic.
- Frontend: introduce Vitest + React Testing Library under `src/__tests__` or colocated `*.test.tsx`. Once scripts exist, expose `npm run test` and target smoke coverage for dashboards and offline queue flows.

## Commit & Pull Request Guidelines
- History currently uses terse French labels (`Tache 15`, `ggggg`). Prefer `scope: summary` such as `billing: enforce invoice numbering`, keeping task IDs where relevant.
- Keep commits focused and include dependent migrations/assets together.
- Pull requests must explain the change, list verification commands, link tasks/issues, and attach UI screenshots or API samples for user-facing updates.

## Environment & Security Notes
- Copy `backend/.env.example` and `frontend/.env.local` instead of committing secrets; supply Postgres/Redis credentials via environment variables or compose overrides.
- Ensure data migrations stay reversible; document manual steps in pull requests and store fixtures only when necessary.
