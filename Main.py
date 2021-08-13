import os
import sys
import json
import keyboard
import subprocess
from pathlib import Path
import SetupFiles.Config
import SetupFiles.AhkSettings
import SetupFiles.AutoClickerDrop
import SetupFiles.AutoMoveForward
import SetupFiles.AutoE
import OCR.StayingAlive
import OCR.TribeLogsOcr
import time

#exits program
def exit_on_key(keyname):
    """ Create callback function that exits current process when the key with
        the given name is pressed.
    """

    def callback(event):
        if event.name == keyname:
            os._exit(1)
    return callback

def run_option(data, option):
    directoryPath = os.path.abspath(os.path.join(os.path.dirname(__file__)))
    if option == "1":
        SetupFiles.AutoClickerDrop.auto_click_drop(data)
    elif option == "2":
        SetupFiles.AutoMoveForward.move_forward(data)
    elif option == "3":
        SetupFiles.AutoClickerDrop.change_mouse_pos_auto_click_drop(data)
    elif option == "4":
        SetupFiles.Config.reset_settings()
    elif option == "5":
        data = SetupFiles.Config.set_settings()
        SetupFiles.AhkSettings.start_ahk(data)
    elif option == "6":
        SetupFiles.AutoE.auto_e(data)
    elif option == "7":
        OCR.StayingAlive.change_mouse_pos_staying_alive(data)
    elif option == "8":
        OCR.StayingAlive.start_staying_alive(data)
    elif option == "9":
        OCR.TribeLogsOcr.ChangeTribeLogLoc(data)
    elif option == "10":
        OCR.TribeLogsOcr.SaveSSTribeLog(data)
    elif option == "11":
        OCR.TribeLogsOcr.TribeLogLogging(data)
    elif option == "12":
        keyboard.hook(exit_on_key(data["escapeKey"]))
        while True:
            OCR.TribeLogsOcr.SaveSSTribeLog(data)
            OCR.TribeLogsOcr.TribeLogLogging(data)
            time.sleep(15)
    elif option == "99":
        os._exit(1)
    elif option == "0":
        print("Exiting")
    else:
        print("Invalid input. Please try again")
    print(f"\n\n* * * done * * * \n\n")



# to see if it's user run or script run
n = len(sys.argv)
data = SetupFiles.Config.set_settings()

run_option(data, "11")
exit(0)
if n == 1:

    var = "-1"
    while var != "0":
        # reloads the data
        data = SetupFiles.Config.set_settings()
        #user input
        var = input(f"Please enter a number and press the enter key: (esc key to exit program)\n"
                    f" 1 - Start the auto-clicker \n"
                    f" 2 - Start the autoMoveForward\n"
                    f" 3 - Change the auto-clicker mouse location for drop \n"
                    f" 4 - Reset All Settings \n"
                    f" 5 - Start Ahk\n"
                    f" 6 - Start auto \"e\"\n"
                    f" 7 - Configure Staying Alive\"e\"\n"
                    f" 8 - Start Staying Alive\"e\"\n"
                    f" 0 - exit \n ")
        run_option(data, var)

    # run explict option
else:
    run_option(data, sys.argv[1])

exit(1)

