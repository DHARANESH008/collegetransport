@echo off
cd /d "%~dp0backend"
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;C:\Users\dhara\.maven\apache-maven-3.9.6\bin;%PATH%"
echo Starting Spring Boot Backend on http://localhost:8080 ...
call mvn spring-boot:run
pause
