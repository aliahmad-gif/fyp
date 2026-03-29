@echo off
cd /d "%~dp0"
title Figma Design - http://localhost:5177
if not exist "node_modules" (
    echo Pehli baar - npm install ho raha hai...
    call npm install
    echo.
)
echo Starting... Open http://localhost:5177
echo.
call npm run dev
pause
