@echo off
setlocal

if "%~1"=="" (
  echo Usage: build-cards.bat ^<locale^>
  echo Example: build-cards.bat en-us
  exit /b 1
)

node "%~dp0scripts\build-cards.js" "%~1"
exit /b %errorlevel%
