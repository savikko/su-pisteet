@echo off
REM Simple batch file to run the query with default values
REM Just double-click this file to run!

echo.
echo Starting Skating Results Query...
echo ========================================
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0Query-And-Post-Results.ps1"

echo.
echo ========================================
echo Done! Check https://su-pisteet.kikka.re
echo.
pause

