@echo off
REM Personal Financial Tracker Setup Script for Windows

echo.
echo ========================================
echo Personal Financial Tracker Setup
echo ========================================
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo Backend setup complete!
echo.

REM Setup Frontend
cd ..\frontend
echo Setting up Frontend...

npm install

echo Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
echo 2. Frontend: cd frontend && npm run dev
echo.
