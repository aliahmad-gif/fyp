@echo off
title Dashboard Local Server
echo Starting Local Server with Node.js...
echo.
echo This window must stay open for the 3D models to work.
echo Open your browser to: http://localhost:8000
echo.
echo Attempting to start with npx http-server...
call npx -y http-server -p 8000

if %errorlevel% neq 0 (
    echo.
    echo Error: Could not start http-server.
    echo Please ensure Node.js is installed.
    pause
)
pause
