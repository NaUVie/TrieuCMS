@echo off
title TrieuCMS Launcher

echo ==============================================================
echo             TRIEU CMS - KHOI DONG HE THONG
echo ==============================================================
echo.
echo  Dang khoi chay du an... Vui long khong dong cua so nay.
echo.
echo  [+] Dang mo Backend (ASP.NET Core)...
echo  [+] Dang mo Frontend (ReactJS)...
echo.
echo ==============================================================

:: Khoi chay Backend o cua so cmd moi
start "Backend - ASP.NET Core Web API" cmd /k "cd CMS.Backend && echo [BACKEND] Dang khoi chay dotnet run... && dotnet run --launch-profile https"

:: Khoi chay Frontend o cua so cmd moi
start "Frontend - ReactJS" cmd /k "cd cms.frontend && echo [FRONTEND] Dang khoi chay npm start... && npm start"

echo.
echo  Ca 2 dich vu dang duoc khoi dong trong cac cua so rieng biet!
echo  - Swagger Backend: https://localhost:7226/swagger
echo  - Giao dien Frontend: http://localhost:3000
echo.
echo  Nhan phim bat ky de thoat...
pause > nul
