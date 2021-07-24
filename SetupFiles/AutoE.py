import pyautogui, keyboard
import time
import os

# holds down shift+w until exit key is detected, then exit program
def auto_e(data):
    # exits the program if the esc key is detected
    #keyboard.hook(exit_on_key(data["escapeKey"]))

    delay = data["delayBeforeStarting"]

    time.sleep(delay)
    cont = True
    while cont:
        if keyboard.is_pressed(data["escapeKey"]):
            cont = False
        pyautogui.press("e")
        if keyboard.is_pressed(data["escapeKey"]):
            cont = False

    os._exit(1)