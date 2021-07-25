@ECHO OFF

::see if python is already installed
call python -V

if %ERRORLEVEL% == 0 goto :next
goto :install

:install
	(
		cd %~dp0
		ECHO Installing Required Programs
		SetupFiles\Programs\AutoHotkey_1.1.33.09_setup
		SetupFiles\Programs\python-3.9.6.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
		
		call SetupFiles\pythonLibs.bat
		echo.
		echo.
		::reset to default settings. Then change the default position for the autoclicker to drop
		python SetupFiles\Main.py 4
		python SetupFiles\Main.py 3
		goto :endofscript
	)

:next
	(
		python SetupFiles\Main.py 
	)


:endofscript

echo "Script complete"