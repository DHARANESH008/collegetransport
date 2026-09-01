@echo off
cd /d "%~dp0frontend"
echo Starting React Vite Frontend on http://localhost:5173 ...
call npm run dev
pause
