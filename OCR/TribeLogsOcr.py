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


# https://techtutorialsx.com/2019/04/13/python-opencv-converting-image-to-black-and-white/

def createDb():
    # ODB settings

    driver = "SQL Server"
    server = "DESKTOP-HESFTCJ"
    db = "ArkData"
    user = "local123"
    password = "local123"

    # creating connection Object which will contain SQL Server Connection
    sql_conn = pyodbc.connect('driver={%s};server=%s;database=%s;trusted_connection=yes' % (driver, server, db))
    cursor = sql_conn.cursor()

    # Processing Query
    cursor.execute('''

           CREATE TABLE Category
           (
            CategoryId int IDENTITY(1,1) PRIMARY KEY,
            CategoryName nvarchar(100)           
           );

		 	   CREATE TABLE TribeLogsVal
           (
           TribeLogsValId int IDENTITY(1,1) PRIMARY KEY,
           InGameDay nvarchar(500),
           Msg nvarchar(500),
           CategoryId int FOREIGN KEY REFERENCES Category(CategoryId),
		   Ts datetime
           );

        INSERT INTO Category (CategoryName)
            VALUES ('froze'),
                 ('starved'),
                 ('tamed'),
                 ('added'),
                 ('killed'),
                 ('destroyed'),
                 ('misc');
           ''')
    # Committing any pending transaction to the database.
    sql_conn.commit()
    # closing connection
    sql_conn.close()


def saveData(text):
    print('saving')
    # ODB settings

    driver = "SQL Server"
    server = "DESKTOP-HESFTCJ"
    db = "ArkData"
    user = "local123"
    password = "local123"

    # creating connection Object which will contain SQL Server Connection
    sql_conn = pyodbc.connect('driver={%s};server=%s;database=%s;trusted_connection=yes' % (driver, server, db))
    cursor = sql_conn.cursor()

    # Processing Query
    # splits each entry to day
    text = text.lower()
    text = text.split("day")
    categories = ['destro', 'illed', 'starved', 'tamed', 'added', 'froze']

    # get default cate
    cursor.execute("select CategoryId from Category where CategoryName LIKE (?)", 'misc')
    exists = cursor.fetchone()
    defaultId = exists[0]
    categ = ""
    categId = ""
    # print(f'text is {text} \n\n\n\n')
    # goes through each line and matches it to the first category found
    for x in text:
        # print(f'x is {x} \n\n\n\n')
        categ = ""
        categId = ""

        # adds the entry to the tribe log and the categoryId
        # how many semi colons
        n = 3
        groups = x.split(':')
        datasplit = ':'.join(groups[:n]), ':'.join(groups[n:])

        # date should only be 16 length ie. ' 10095, 19:21:48' and msg should be greater than 5
        if len(datasplit) >= 2:
            date = datasplit[0]
            entry = datasplit[1]

        # print(f'checking {date} \n\n\n {entry}')

        # print(f'date is {len(date)} {date} and entry is {len(entry)} : {entry}')
        if len(date) != 16 or len(entry) < 5:
            continue

        for cat in categories:
            if cat in entry:
                cat = f'%{cat}%'
                cursor.execute("select CategoryId from Category where CategoryName LIKE (?)",
                               cat)  # check to see if record exists
                exists = cursor.fetchone()
                if exists is not None:
                    categ = cat
                    categId = exists[0]
                    break
        if len(categ) == 0:
            categId = defaultId

        # print(f'adding {date} \n\n\n {entry}')
        # checks to see if the entry has already been added or not
        # OCR is finnicky so the game day or msg has to match and the category id
        cursor.execute("select * from TribeLogsVal where (InGameDay = (?) or Msg = (?)) AND CategoryId = (?)",
                       date, entry, categId)  # check to see if record exists
        exists = cursor.fetchone()

        if exists is None:
            cursor.execute(
                "INSERT INTO TribeLogsVal (InGameDay, Msg, CategoryId, DiscordBot, Ts) VALUES (?,?,?,?,?)",
                date, entry, categId, 0, datetime.now())
            # Committing any pending transaction to the database.
    sql_conn.commit()
    # closing connection
    sql_conn.close()

    print('finished')


# saves in txt
def addText(text):
    outfile = "./text.txt"
    f = open(outfile, "a")
    # text = text.splitlines()
    f.writelines("Data Extracted from next page starts now.")
    f.write(text)
    f.close()


def tribeLogLogging(data):
    print('processing image')
    # time.sleep(data['delayBeforeStarting'])
    # pyautogui.press('l')
    # time.sleep(1)
    # pyautogui.press('l')

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
    # cv2.imshow("purple_to_white", image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # print(pytesseract.image_to_string(image))

    text = str(pytesseract.image_to_string(image))

    # print(text)
    saveData(text)


def changeTribeLogLoc(data):
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


def saveTribeLogLoc(data):
    print('taking screenshot')
    x1 = data["tribeLogx1"]
    y1 = data["tribeLogy1"]
    x2 = data["tribeLogx2"]
    y2 = data["tribeLogy2"]
    myScreenshot = pyautogui.screenshot(region=(x1, y1, x2, y2))
    now = datetime.now().strftime("%Y-%m-%d %H%M%S")
    pathName = f'{data["programLoc"]}\\{data["tribeLogLoc"]}\\{now}.png'
    myScreenshot.save(pathName)
