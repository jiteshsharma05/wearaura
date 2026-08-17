@echo off
title WearAura Dev Server
color 0A
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       WearAura Dev Server            ║
echo  ║     http://localhost:3000            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  Starting development server...
echo.
cd /d "C:\Users\user 1\Projects\wearaura"
start "" http://localhost:3000
npm run dev
pause
