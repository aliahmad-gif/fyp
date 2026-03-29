@echo off
cd /d "%~dp0"
title Django Backend - http://localhost:8000
echo Django Backend (Figma frontend isi port pe connect hota hai)
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python installed nahi hai. https://python.org se install karein.
    pause
    exit /b 1
)

echo Dependencies check kar rahe hain...
pip install -r requirements.txt -q
if errorlevel 1 (
    echo pip install fail. Manually run: pip install -r requirements.txt
    pause
    exit /b 1
)

echo.
echo Starting Django... Frontend: http://localhost:5177  Backend API: http://localhost:8000
echo.
call python manage.py runserver 8000
pause
