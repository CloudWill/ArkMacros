import pytesseract
import cv2
import numpy as np

#https://techtutorialsx.com/2019/04/13/python-opencv-converting-image-to-black-and-white/

image_loc = r'D:\OneDrive\Sorted\Programming\Python\Ark Farming\OCR\Images\tribelog4.png'

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

image = cv2.imread(image_loc)

grayImage = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# Define lower and uppper limits of what we call "brown"
lo = np.array([0, 0, 158])
hi = np.array([179, 255, 255])

# Mask image to only selected range
mask = cv2.inRange(hsv, lo, hi)

# Change image to white where we found found the mask

image[mask > 0] = (255, 255, 255)
cv2.imshow("purple_to_white", image)

print(pytesseract.image_to_string(image))
cv2.waitKey(0)
cv2.destroyAllWindows()

