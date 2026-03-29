@echo off
title Figma Design - LandingPage3D + Sab Pages
cd /d "%~dp0"
echo.
echo Figma Design (LandingPage3D + Cart, Discovery, Measurement, Product, Profile) start ho raha hai...
echo Browser me open karein: http://localhost:5177
echo.
start "" "%~dp0Figma Design for Frontend\run.bat"
timeout /t 3 /nobreak >nul
start http://localhost:5177
echo.
pause
