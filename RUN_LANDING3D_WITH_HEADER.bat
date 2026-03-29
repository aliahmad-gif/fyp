@echo off
chcp 65001 >nul
title LandingPage3D + Header
cd /d "%~dp0"

echo.
echo ============================================
echo   Sirf LandingPage3D + Header run ho raha hai
echo ============================================
echo   Open: http://localhost:5177
echo ============================================
echo.

start "" "%~dp0Figma Design for Frontend\run.bat"
timeout /t 4 /nobreak >nul
start http://localhost:5177

echo Browser khul gaya. Agar nahi khula to khud open karein: http://localhost:5177
echo.
pause
