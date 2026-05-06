# Copilot Instructions for Personal Financial Tracker

## Project Overview
This is a full-stack Personal Financial Tracker application built with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy
- **Features**: Authentication, multi-account support, transaction tracking, budgets, savings goals, bilingual UI

## Development Workflow

### Frontend Development
- All React components are in `frontend/src/components` and `frontend/src/pages`
- Tailwind CSS is used for styling
- react-i18next handles internationalization
- API calls go through `frontend/src/services/api.js`
- State management uses React hooks and context

### Backend Development
- FastAPI routes are organized in `backend/app/routes/`
- Database models are in `backend/app/models/`
- Pydantic schemas are in `backend/app/schemas/`
- JWT authentication is handled in `backend/app/core/security.py`
- SQLAlchemy ORM manages database operations

## Common Tasks

### Add a New API Endpoint
1. Create/update a route file in `backend/app/routes/`
2. Add Pydantic schema in `backend/app/schemas/`
3. Ensure authentication using `get_current_user` dependency
4. Register the router in `backend/app/main.py`

### Add a New Frontend Feature
1. Create component in `frontend/src/components/` or page in `frontend/src/pages/`
2. Add API service method in `frontend/src/services/api.js`
3. Use `useTranslation()` hook for i18n support
4. Add translations in `frontend/src/locales/en.json` and `ar.json`

### Add Translations
1. Add English text in `frontend/src/locales/en.json`
2. Add Arabic translation in `frontend/src/locales/ar.json`
3. Use in components: `const { t } = useTranslation()` then `t('key.path')`

## Database Schema
- **users**: User accounts with email, hashed password, language preference
- **accounts**: Multiple account types per user (cash, bank, credit card, savings)
- **transactions**: Income/expense transactions linked to accounts and categories
- **budgets**: Monthly budget limits per category with spending tracking
- **goals**: Savings goals with target amounts and deadlines

## Authentication Flow
1. User registers/logs in → `POST /auth/register` or `POST /auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token included in Authorization header for protected routes
5. Backend verifies token via `get_current_user` dependency

## RTL/Bilingual Implementation
- Language stored in user profile and browser
- `dir="rtl"` set on HTML element for Arabic
- CSS uses logical properties (inset-inline, etc.) for RTL compatibility
- Numbers and dates formatted with `Intl` API for locale-specific display
- IBM Plex Sans fonts loaded from Google Fonts

## Performance Notes
- Frontend uses lazy loading for routes (ready to implement)
- Backend queries optimized with proper filtering and indexing
- React components memoized where necessary
- API calls debounced in search/filter operations

## Security Reminders
- Always hash passwords with bcrypt (backend handles this)
- Validate all user inputs on both frontend and backend
- Use HTTPS in production
- Rotate SECRET_KEY in production
- Implement rate limiting for auth endpoints
- Keep dependencies updated regularly
