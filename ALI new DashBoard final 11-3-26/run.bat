@echo off
cd /d "%~dp0"
title ALI Dashboard - http://localhost:8002
echo Starting ALI Dashboard... Open http://localhost:8002
echo (Port 8000 Django backend ke liye use hota hai)
echo.
call npx -y http-server -p 8002
pause
