@echo off
REM ========================================
REM Skating Results Uploader
REM ========================================
REM Create a shortcut to this file on your desktop for easy access!

echo.
echo ========================================
echo   Skating Results Uploader
echo ========================================
echo.
echo Target: https://su-pisteet.kikka.re
echo.

REM Change to the script directory
cd /d "%~dp0"

REM Run the PowerShell script with default values
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0Query-And-Post-Results.ps1"

echo.
echo ========================================
echo.

REM Check if the script succeeded
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Results uploaded.
    echo.
    echo View at: https://su-pisteet.kikka.re
) else (
    echo ERROR! Something went wrong.
    echo Check the error messages above.
)

echo.
rem echo Press any key to close...
rem pause >nul

