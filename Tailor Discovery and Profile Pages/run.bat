@echo off
cd /d "%~dp0"
title Tailor Discovery - http://localhost:5176
if not exist "node_modules" (
    echo Pehli baar - npm install ho raha hai...
    call npm install
    echo.
)
echo Starting... Open http://localhost:5176
echo.
call npm run dev
pause
