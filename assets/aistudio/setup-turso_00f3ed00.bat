@echo off
chcp 65001 >nul
echo.
echo  ========================================
echo   WineBOX.Clinic - Setup Turso
echo  ========================================
echo.
echo  Este script cargara los datos en tu base de datos Turso.
echo.
node setup-turso.js
pause
