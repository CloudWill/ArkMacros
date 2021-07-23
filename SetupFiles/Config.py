import pyautogui
import os
import json
from pathlib import Path
import subprocess
import AhkSettings

def set_settings():
    settingsPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))
    with open(settingsPath + '\\Settings.txt', 'r') as f:
        data = json.load(f, strict=False)
    return data

def reset_settings():
    directoryPath = os.path.abspath(os.path.join(os.path.dirname(__file__)))
    defaultSettings = {"itemsToDrop": "",
                       "delayBeforeStarting": 3,
                       "clickDelay": 1,
                       "escapeKey": "esc",
                       "clicksBeforeDrop": 5,
                       "programLoc": directoryPath,
                       "autoClickShortcut": "^O",
                       "autoMoveShortcut": "^W",
                       "otherInvSearchX": 1269,
                       "otherInvSearchY": 184,
                       "otherInvDropAllX": 1473,
                       "otherInvDropAllY": 189,
                       "acceptX": 789,
                       "accceptY": 596}

    with open(directoryPath + '\\Settings.txt', 'w') as f:
        json.dump(defaultSettings, f)

def start_ahk(directoryPath):
    resetAhk = directoryPath + "\\StartAhk.bat"
    subprocess.call([rf'{resetAhk}'])


#exits program
def exit_on_key(keyname):
    """ Create callback function that exits current process when the key with
        the given name is pressed.
    """
    def callback(event):
        if event.name == keyname:
            os._exit(1)
    return callback
