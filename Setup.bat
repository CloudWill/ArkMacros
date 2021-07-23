@ECHO OFF

::see if python is already installed
call python -V

if %ERRORLEVEL% == 0 goto :next
goto :install

:install
	(
		cd %~dp0
		ECHO Installing Required Programs
		SetupFiles\Programs\AutoHotkey_1.1.32.00_setup
		SetupFiles\Programs\python-3.8.2.exe InstallAllUsers=0 Include_launcher=0 Include_test=0 SimpleInstall=1 SimpleInstallDescription="Just for me, no test suite."

		ECHO installing required dependencies
		python -m pip install --upgrade pip
		pip install pyautogui
		echo.
		echo.
		::reset to default settings. Then change the screenshot size
		python SetupFiles\Main.py 3
		python SetupFiles\Main.py 1
		goto :endofscript
	)

:next
	(
		python SetupFiles\Main.py 
	)


:endofscript

echo "Script complete"