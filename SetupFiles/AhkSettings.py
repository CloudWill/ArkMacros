import os
import subprocess
import json


def create_ahk_file(data):
    f = open(data["programLoc"] +"\\" + data["requiredFilesLoc"] + "\\AutoHotKeysSettings.ahk", "w")
    # .ahk file for autohotkey
    autoClickSc = data["autoClickShortcut"]
    autoMoveSc = data["autoMoveShortcut"]
    docLoc = data["programLoc"] + "\\" + data["requiredFilesLoc"]
    f.write(f'{autoClickSc}:: \n run, python.exe "{docLoc}\\Main.py" 1,,Hide\n'
            f'return\n\n'
            f'{autoMoveSc}:: \n run, python.exe "{docLoc}\\Main.py" 2,,Hide'
            f'{autoESc}:: \n run, python.exe "{docLoc}\\Main.py" 6,,Hide')
    f.close()

def start_ahk(data):
    create_ahk_file(data)
    resetAhk = data["programLoc"] + "\\SetupFiles\\StartAhk.bat"
    subprocess.call([rf'{resetAhk}'])

