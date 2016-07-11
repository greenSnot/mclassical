#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

# Convert pdf to images
#pdf2jpg('input/jotaop41.pdf','output')

origin = cv2.imread('./output/out15.jpg',1)
HEIGHT, WIDTH = origin.shape[:2]

STAFF_HORIZONTAL_TOLERANCE = np.pi/24 # 15 degrees
STAFF_VERTICAL_TOLERANCE = np.pi/24 # 15 degrees

# Erode
kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(8, 3))  
origin = cv2.erode(origin,kernel)  

# Resize
origin = cv2.resize(origin, (int(WIDTH/8), int(HEIGHT/8)))

# Gray
gray = cv2.cvtColor(origin,cv2.COLOR_BGR2GRAY)

imgSplit = cv2.split(origin)
flag,b = cv2.threshold(imgSplit[2],0,255,cv2.THRESH_OTSU) 

element = cv2.getStructuringElement(cv2.MORPH_CROSS,(1,1))
cv2.erode(b,element)

#edges = cv2.Canny(b, 50, 150, apertureSize = 5)

ret,origin = cv2.threshold(origin,247,255,cv2.THRESH_BINARY)
origin = 255 - origin

hough_result = origin.copy()
gray2 = cv2.cvtColor(origin,cv2.COLOR_BGR2GRAY)

lines = cv2.HoughLines(gray2,1,np.pi/180,100)

def draw_line(img,rho,theta,color=(0,0,255)):
    a = np.cos(theta)
    b = np.sin(theta)
    x0 = a*rho
    y0 = b*rho
    x1 = int(x0 + 1000*(-b))
    y1 = int(y0 + 1000*(a))
  
    x2 = int(x0 - 1000*(-b))
    y2 = int(y0 - 1000*(a))
    cv2.line(img,(x1,y1),(x2,y2),color,1)

for line in lines:
    for rho,theta in line:
        #(2,6 <=theta <= 26) or (theta >118 and theta <= 285)
        if - STAFF_HORIZONTAL_TOLERANCE + np.pi/2 <= theta <= np.pi/2 + STAFF_HORIZONTAL_TOLERANCE:
            draw_line(hough_result,rho,theta)
        if - STAFF_VERTICAL_TOLERANCE + np.pi <= theta or theta <= STAFF_VERTICAL_TOLERANCE:
            draw_line(hough_result,rho,theta,(0,255,0))

cv2.imshow('merged',concatImgHorizontal(origin,hough_result))

cv2.waitKey(0)
cv2.destroyAllWindows()
