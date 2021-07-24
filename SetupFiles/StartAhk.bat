@ECHO OFF

cd %~dp0

:: the path to the AutoHotkey.exe to be used:
@set AHK_PATH=%PROGRAMFILES%\AutoHotkey\AutoHotkey.exe

:: the (relative or absolute) path to the script to be launched:
@set SCRIPT_PATH=.\AutoHotKeysSettings.ahk

START "" "%AHK_PATH%" "%SCRIPT_PATH%"

exit