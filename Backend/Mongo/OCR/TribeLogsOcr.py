import pytesseract
import cv2
import numpy as np
import pyautogui
import json
import os
from datetime import datetime
import json
import glob
import pyodbc
import keyboard
import time
import json
import urllib.request
import requests
#!/usr/bin/python
import sys, getopt

def tribeLogLogging(img_loc):
    print('processing image')
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

    folder_path = f'{img_loc}'
    file_type = '\*png'
    files = glob.glob(folder_path + file_type)
    #get latest file
    image_loc = max(files, key=os.path.getctime)

    # print(f'Image loc is: {image_loc}')

    image = cv2.imread(image_loc)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define lower and uppper limits of what we call "brown"
    loText = np.array([0, 0, 205])
    hiText = np.array([179, 255, 255])

    loDate = np.array([0, 0, 0])
    hiDate = np.array([0, 195, 255])

    # Mask image to only selected range
    mask1 = cv2.inRange(hsv, loText, hiText)
    mask2 = cv2.inRange(hsv, loDate, hiDate)
    mask = mask1 + mask2

    # Change text to white based on mask

    image[mask > 0] = (255, 255, 255)
    # cv2.imshow("purple_to_white", image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # print(pytesseract.image_to_string(image))

    text = str(pytesseract.image_to_string(image))

    print(text)
    #saveData(text)
    #sendToDb(text)

def main(argv):
    argument = ''
    usage = 'usage: script.py -f <sometext>'
    
    # parse incoming arguments
    try:
        opts, args = getopt.getopt(argv,"hf:",["foo="])
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-f", "--foo"):
            argument = arg

    # print output
    print("Start : %s" % time.ctime())
    print('Foo is')
    tribeLogLogging(argument)
    print("End : %s" % time.ctime())

if __name__ == "__main__":
    main(sys.argv[1:])