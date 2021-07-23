import pyautogui, keyboard
import time
import os
import sys
import json
from pathlib import Path
import time
import Config

def auto_click_drop(json):
    time.sleep(json['delayBeforeStarting'])

    while True:
        count = 0
        while count < json["clicksBeforeDrop"]:
            pyautogui.click()
            count +=1

        #searches what to throw away in the inventory
        pyautogui.press('f')
        # reads each item to drop
        items = json["itemsToDrop"].split(';')
        for item in items:
            #moves to "other" search bar and writes
            pyautogui.moveTo(json["otherInvSearchX"], json["otherInvSearchY"], duration=1,
                             tween=pyautogui.easeInQuad)
            pyautogui.click()
            pyautogui.write(item, interval=0.05)
            #drop all
            pyautogui.moveTo(json["otherInvDropAllX"], json["otherInvDropAllY"], duration=1,
                             tween=pyautogui.easeInQuad)
            pyautogui.click()
            #click accept
            pyautogui.moveTo(json["acceptX"], json["acceptY"], duration=1,
                             tween=pyautogui.easeInQuad)
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

    settingsPath = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))
    with open(settingsPath + '\\Settings.txt', 'w') as f:
        json.dump(data, f)