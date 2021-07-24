import pyautogui, keyboard
import time
import os
import sys
import json
from pathlib import Path
import time
import Config

def auto_click_drop(data):
    # exits the program if the esc key is detected
    keyboard.hook(exit_on_key(data["escapeKey"]))

    time.sleep(data['delayBeforeStarting'])

    while True:

        t_end = time.time() + data["delayBeforeDrop"]

        while time.time() < t_end:
            pyautogui.click()


        #searches what to throw away in the inventory
        pyautogui.press('f')
        # reads each item to drop
        items = data["itemsToDrop"].split(';')
        for item in items:

            #moves to "other" search bar and writes
            pyautogui.moveTo(data["otherInvSearchX"], data["otherInvSearchY"], 0.2, pyautogui.easeInOutQuad)
            pyautogui.click()
            pyautogui.write(item, interval=0.05)
            #drop all
            pyautogui.moveTo(data["otherInvDropAllX"], data["otherInvDropAllY"], 0.2, pyautogui.easeInOutQuad)
            pyautogui.click()
            #click accept
            pyautogui.moveTo(data["acceptX"], data["acceptY"], 0.2, pyautogui.easeInOutQuad)
            pyautogui.click()
        pyautogui.press('f')

def change_mouse_pos_auto_click_drop(data):
    input("Press Enter after positioning mouse cursor in the \"Other\" search bar")
    otherInvSearchX, otherInvSearchY = pyautogui.position()

    input("Press Enter after positioning mouse cursor in the \"Other\" drop all button")
    otherInvDropAllX, otherInvDropAllY = pyautogui.position()

    input("Press Enter after positioning mouse cursor in the \"Accept\" button")
    acceptX, acceptY = pyautogui.position()

    data["otherInvSearchX"] = otherInvSearchX
    data["otherInvSearchY"] = otherInvSearchY
    data["otherInvDropAllX"] = otherInvDropAllX
    data["otherInvDropAllY"] = otherInvDropAllY
    data["acceptX"] = acceptX
    data["acceptY"] = acceptY

    settingsPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
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
