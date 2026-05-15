@echo off
title AI-CRM - First Time Setup
color 0B

echo =========================================
echo   AI-CRM Platform - First Time Setup
echo =========================================
echo.
echo This will install everything needed.
echo Please wait, this may take a few minutes...
echo.

:: ---- Backend Setup ----
echo [Step 1/3] Setting up Backend...
cd /d "%~dp0backend"

python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

:: Copy .env if not exists
if not exist .env (
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env file and set your database password!
)

echo Backend setup done!
echo.

:: ---- Frontend Setup ----
echo [Step 2/3] Setting up Frontend...
cd /d "%~dp0frontend"

npm install
echo Frontend setup done!
echo.

:: ---- Done ----
echo [Step 3/3] Setup Complete!
echo.
echo =========================================
echo  Setup finished! Now you can run:
echo  Just double-click  start.bat
echo =========================================
echo.
pause
