import pyautogui, keyboard
import time


# holds down shift+w until exit key is detected, then exit program
def move_forward(json):
    delay = json["delayBeforeStarting"]

    time.sleep(delay)
    pyautogui.keyDown('shift')
    while True:
        pyautogui.press('w')

