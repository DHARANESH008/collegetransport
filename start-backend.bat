@echo off
title Spring Boot Backend Server
cd /d "%~dp0backend"
echo ===================================================
echo   Starting Smart College Transport Backend Server
echo ===================================================
call .\mvnw.cmd spring-boot:run
pause
