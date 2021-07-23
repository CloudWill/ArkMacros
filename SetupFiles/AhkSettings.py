import os
import subprocess
import json


def create_ahk_file(data):
    f = open(data["programLoc"] + "\\AutoHotKeysSettings.ahk", "w")
    # .ahk file for autohotkey
    f.write(f'{shortcutKey}:: \n run, python.exe "{directoryPath}\\Main.py" 4,,Hide')

    f.close()

def start_ahk(directoryPath):
    resetAhk = directoryPath + "\\StartAhk.bat"
    subprocess.call([rf'{resetAhk}'])

