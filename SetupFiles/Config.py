import pyautogui
import os
import json
from pathlib import Path
import subprocess
import AhkSettings

def set_settings():
    settingsPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    with open(settingsPath + '\\Settings.txt', 'r') as f:
        data = json.load(f, strict=False)
    return data

def reset_settings():
    directoryPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    defaultSettings = {"itemsToDrop": "add here seperate by ;",
                       "delayBeforeStarting": 4,
                       "escapeKey": "esc",
                       "delayBeforeDrop": 60,
                       "programLoc": directoryPath,
                       "requiredFilesLoc": "SetupFiles",
                       "autoClickShortcut": "^O",
                       "autoMoveShortcut": "^W",
                       "autoEShortcut": "^E",
                       "otherInvSearchX": 1269,
                       "otherInvSearchY": 184,
                       "otherInvDropAllX": 1473,
                       "otherInvDropAllY": 189,
                       "acceptX": 789,
                       "acceptY": 596}

    with open(directoryPath + '\\Settings.txt', 'w') as f:
        json.dump(defaultSettings, f)

        set_bats(directoryPath, "autoDrop", 1)
        set_bats(directoryPath, "autoW", 2)
        set_bats(directoryPath, "autoE", 6)
        set_bats(directoryPath, "resetSettings", 4)


def start_ahk(directoryPath):
    resetAhk = directoryPath + "\\StartAhk.bat"
    subprocess.call([rf'{resetAhk}'])

def set_bats(directoryPath, fileName, value):

    file = f'{directoryPath}\\{fileName}.bat'

    f = open(file, "w")

    f.write(f'python.exe {file} {value}')
    f.close()