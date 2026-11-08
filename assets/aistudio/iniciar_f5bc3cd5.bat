@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ========================================
echo   WineBOX.Clinic - Servidor
echo  ========================================
echo.
echo  Iniciar servidor...
echo.
node foro\server.js
pause
