import pyautogui, keyboard
import time
import os
import sys
import json
from pathlib import Path
import time
import random
import win32api, win32con


def start_staying_alive(data):
    # exits the program if the esc key is detected
    keyboard.hook(exit_on_key(data["escapeKey"]))

    time.sleep(data['delayBeforeStarting'])

    count = 0
    while True:
        if count > 1080:
            count = 0
        x = count
        y = 0

        print(f'moving {x} {y}')

        win32api.mouse_event(win32con.MOUSEEVENTF_MOVE, x, y, 0, 0)
        count +=50

        time.sleep(1)


def change_mouse_pos_staying_alive(data):
    input("Press Enter after positioning mouse cursor in left side")
    lookLeftX, lookLeftY = pyautogui.position()

    input("Press Enter after positioning mouse cursor in the right side")
    lookRightX, lookRightY = pyautogui.position()

    data["lookRightX"] = lookRightX
    data["lookRightY"] = lookRightY
    data["lookLeftX"] = lookLeftX
    data["lookLeftY"] = lookLeftY

    with open(data["programLoc"] + '\\Settings.txt', 'w') as f:
        json.dump(data, f)


#exits program
def exit_on_key(keyname):
    """ Create callback function that exits current process when the key with
        the given name is pressed.
    """

    def callback(event):
        if event.name == keyname:
            os._exit(1)
    return callback
