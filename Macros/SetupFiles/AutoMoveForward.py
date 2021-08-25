import pyautogui, keyboard
import time
import os

# holds down shift+w until exit key is detected, then exit program
def move_forward(data):
    # exits the program if the esc key is detected
    #keyboard.hook(exit_on_key(data["escapeKey"]))

    delay = data["delayBeforeStarting"]

    time.sleep(delay)
    cont = True
    pyautogui.keyDown("w")
    while cont:
        if keyboard.is_pressed(data["escapeKey"]):
            cont = False
    pyautogui.keyUp("w")
    os._exit(1)
