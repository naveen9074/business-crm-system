@echo off
title AI-CRM Platform Launcher
color 0A

echo =========================================
echo     AI-CRM Platform - Starting Up...
echo =========================================
echo.

:: ---- Start Backend ----
echo [1/2] Starting Backend Server...
cd /d "%~dp0backend"

:: Activate virtual environment
call venv\Scripts\activate

:: Start backend in a new window
start "Backend - FastAPI" cmd /k "call venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Backend started at http://localhost:8000
echo.

:: ---- Start Frontend ----
echo [2/2] Starting Frontend...
cd /d "%~dp0frontend"

:: Start frontend in a new window
start "Frontend - React" cmd /k "npm run dev"

echo Frontend started at http://localhost:5173
echo.

:: ---- Open Browser ----
timeout /t 4 /nobreak >nul
echo Opening browser...
start http://localhost:5173

echo.
echo =========================================
echo  Both servers are running!
echo  Frontend : http://localhost:5173
echo  Backend  : http://localhost:8000
echo  API Docs : http://localhost:8000/docs
echo =========================================
echo.
echo Close the Backend and Frontend windows to stop the app.
pause
