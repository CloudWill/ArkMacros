import os
import sys
import json
import keyboard
import subprocess
from pathlib import Path
import Config
import AhkSettings
import AutoClickerDrop
import AutoMoveForward

def run_option(data, option):
    directoryPath = os.path.abspath(os.path.join(os.path.dirname(__file__)))
    if option == "1":
        AutoClickerDrop.auto_click_drop(data)
    elif option == "2":
        AutoMoveForward.move_forward(data)
    elif option == "3":
        AutoClickerDrop.change_mouse_pos_auto_click_drop(data)
    elif option == "4":
        Config.reset_settings()
    elif option == "5":
        AhkSettings.start_ahk(data)
    elif option == "0":
        print("Exiting")
    else:
        print("Invalid input. Please try again")
    print(f"\n\n* * * done * * * \n\n")

#gets the data
data = Config.set_settings()

#exits the program if the esc key is detected
keyboard.hook(Config.exit_on_key(data["escapeKey"]))

# to see if it's user run or script run
n = len(sys.argv)
if n == 1:
    var = "-1"
    while var != "0":
        var = input(f"Please enter a number and press the enter key: (esc key to exit program)\n"
                    f" 1 - Start the auto-clicker \n"
                    f" 2 - Start the autoMoveForward\n"
                    f" 3 - Change the auto-clicker mouse location for drop \n"
                    f" 4 - Reset All Settings \n"
                    f" 5 - Start Ahk\n"
                    f" 0 - exit \n ")
        run_option(data, var)

    # run explict option
else:
    run_option(data, sys.argv[1])

exit(1)