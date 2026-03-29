@echo off
cd /d "%~dp0"
title Login Firebase - http://localhost:5174
if not exist "node_modules" (
    echo Pehli baar - npm install ho raha hai...
    call npm install
    echo.
)
echo Starting... Open http://localhost:5174
echo.
call npm run dev
pause
