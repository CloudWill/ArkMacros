import pytesseract
import cv2
import numpy as np
import pyautogui
import os
from datetime import datetime
import glob
import json
import requests
import re

def SendToServer(text):
    #print(f'sending to Mongo {text}

    # some formatting all new lines
    text = text.lower()
    text = text.split("day")

    jsonArray = []

    categories = ['destro', 'illed', 'starved', 'tamed', 'added', 'froze', 'claimed']

    for x in text:
        category = ""
        jsonString = {}
        # splits on the third ":" which is the Day 10185, 14:59:42: [msg]
        n = 3
        groups = x.split(':')
        datasplit = ':'.join(groups[:n]), ':'.join(groups[n:])

        # date should only be 19 length ie. 'Day 10095, 19:21:48' and msg should be greater than {arbitrary number}
        if len(datasplit) >= 2:
            date = datasplit[0]
            entry = datasplit[1]

        if len(date) != 16 or len(entry) < 5:
            continue

        #more text formatting
        entry = entry.replace("\n", "").replace("\r", "")
        entry = re.sub(' +', ' ', entry)

        for cat in categories:
            if cat in entry:
                category = cat
        #parsing due to inaccuracies of OCR
        if len(category) == 0:
            category = "misc"
        elif category == "illed":
            category = "killed"
        elif  category == "destro":
            category = "destroyed"
        #print(f'\n\n\ncat \n{category} \n date \n{date} \n entry\n {entry} ')
        # add each entry to the json dic

        jsonString["InGameDate"] = f'Day {date}'
        jsonString["Msg"] = entry
        jsonString["Category"] = category
        jsonString["DiscordRead"] = 0
        jsonString["TimeStamp"] = datetime.now().isoformat()
        jsonArray.append(jsonString)


    url = "http://localhost:8005/InsertArkTribeLogs"
    data_json = json.dumps(jsonArray)
    payload = {'ArkMsg': data_json}

    r = requests.post(url, data=payload)
    print('finished')


def TribeLogLogging(data):
    print('processing image')
    #
    # import requests
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

    folder_path = f'{data["programLoc"]}\\{data["tribeLogLoc"]}'
    file_type = '\*png'
    files = glob.glob(folder_path + file_type)
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
    # console command to show all images with different masks
    # cv2.imshow("purple_to_white", image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # print(pytesseract.image_to_string(image))

    text = str(pytesseract.image_to_string(image))

    SendToServer(text)


def ChangeTribeLogLoc(data):
    input("Press Enter after positioning mouse cursor in the top left section of tribe logs")
    x1, y1 = pyautogui.position()

    input("Press Enter after positioning mouse cursor in the bottom right section of tribe logs")
    x2, y2 = pyautogui.position()

    print(f'x1 is {x1} x2 is {y1} x2 is {x2} y2 is {y2}')

    data["tribeLogx1"] = x1
    data["tribeLogy1"] = y1
    data["tribeLogx2"] = x2 - x1
    data["tribeLogy2"] = y2 - y1
    with open(data["programLoc"] + '\\Settings.txt', 'w') as f:
        json.dump(data, f)


def SaveSSTribeLog(data):
    print('taking screenshot')
    x1 = data["tribeLogx1"]
    y1 = data["tribeLogy1"]
    x2 = data["tribeLogx2"]
    y2 = data["tribeLogy2"]
    myScreenshot = pyautogui.screenshot(region=(x1, y1, x2, y2))
    now = datetime.now().strftime("%Y-%m-%d %H%M%S")
    pathName = f'{data["programLoc"]}\\{data["tribeLogLoc"]}\\{now}.png'
    myScreenshot.save(pathName)
