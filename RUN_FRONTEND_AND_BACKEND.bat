@echo off
chcp 65001 >nul
title FYP - Frontend + Backend
cd /d "%~dp0"

echo.
echo ============================================
echo   Backend (Django) + Frontend (Figma) run ho rahe hain
echo ============================================
echo.

echo Pehle Backend start ho raha hai (Django - port 8000)...
start "Django Backend" "%~dp0django backend\run.bat"
timeout /t 5 /nobreak >nul

echo Ab Frontend start ho raha hai (Figma - port 5177)...
start "Figma Frontend" "%~dp0Figma Design for Frontend\run.bat"
timeout /t 4 /nobreak >nul

echo.
echo ============================================
echo   Backend API:  http://localhost:8000
echo   Frontend:     http://localhost:5177
echo ============================================
echo Browser me http://localhost:5177 open karein.
echo.
pause
