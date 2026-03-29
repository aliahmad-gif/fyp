@echo off
chcp 65001 >nul
title FYP - Run All Projects
cd /d "%~dp0"

echo.
echo ============================================
echo   FYP - Sab projects start ho rahe hain...
echo ============================================
echo.

start "1 - 3D Landing Page" "%~dp03d landing page\run.bat"
timeout /t 2 /nobreak >nul

start "2 - ALI Dashboard" "%~dp0ALI new DashBoard final 11-3-26\run.bat"
timeout /t 2 /nobreak >nul

start "3 - Login Firebase" "%~dp0login.sign with firebase\run.bat"
timeout /t 2 /nobreak >nul

start "4 - Measurement" "%~dp0measurement module\run.bat"
timeout /t 2 /nobreak >nul

start "5 - Tailor Discovery" "%~dp0Tailor Discovery and Profile Pages\run.bat"
timeout /t 2 /nobreak >nul

start "6 - Figma Design" "%~dp0Figma Design for Frontend\run.bat"
timeout /t 2 /nobreak >nul

start "7 - Django Backend" "%~dp0django backend\run.bat"

echo.
echo ============================================
echo   Browser me ye links open karein:
echo ============================================
echo   3D Landing:     http://localhost:5173
echo   Django Backend: http://localhost:8000  (Figma isi se connect hota hai)
echo   ALI Dashboard:  http://localhost:8002
echo   Login:          http://localhost:5174
echo   Measurement:    http://localhost:5175
echo   Tailor:         http://localhost:5176
echo   Figma:          http://localhost:5177
echo ============================================
echo.
pause
