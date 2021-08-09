import pyautogui
import os
import json
from pathlib import Path
import subprocess
import SetupFiles.AhkSettings

def set_settings():
    settingsPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    with open(settingsPath + '\\Settings.txt', 'r') as f:
        data = json.load(f, strict=False)
    return data

def reset_settings():
    directoryPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    requiredFilesLoc = "SetupFiles"
    tribeLogLoc = "ocr/images"
    defaultSettings = {"itemsToDrop": "[add here, multiple items are separated by ;]",
                       "delayBeforeStarting": 3,
                       "escapeKey": "esc",
                       "delayBeforeDrop": 30,
                       "programLoc": directoryPath,
                       "requiredFilesLoc": requiredFilesLoc,
                       "autoClickShortcut": "^O",
                       "autoMoveShortcut": "^W",
                       "autoEShortcut": "^E",
                       "otherInvSearchX": 1269,
                       "otherInvSearchY": 184,
                       "otherInvDropAllX": 1473,
                       "otherInvDropAllY": 189,
                       "acceptX": 789,
                       "acceptY": 596,
                       "tribeLogx1": 789,
                       "tribeLogy1": 596,
                       "tribeLogx2": 789,
                       "tribeLogy2": 596,
                       "tribeLogLoc": tribeLogLoc
                       }

    with open(directoryPath + '\\Settings.txt', 'w') as f:
        json.dump(defaultSettings, f)

        SetupFiles.AhkSettings.start_ahk(defaultSettings)
        set_bats(directoryPath, "autoDrop", 1)
        set_bats(directoryPath, "autoW", 2)
        set_bats(directoryPath, "autoE", 6)
        set_bats(directoryPath, "resetSettings", 4)
        set_bats(directoryPath, "autoDropCalibration", 3)


def start_ahk(directoryPath):
    resetAhk = directoryPath + "\\StartAhk.bat"
    subprocess.call([rf'{resetAhk}'])

def set_bats(directoryPath, fileName, value):

    file = f'{directoryPath}\\{fileName}.bat'

    f = open(file, "w")

    f.write(f'python.exe \"{directoryPath}\\Main.py" {value}')
    f.close()

def exit_script():
    pyautogui.press("esc")

