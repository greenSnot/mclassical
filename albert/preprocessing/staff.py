#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

#pdf2jpg('input/jotaop41.pdf','output')

origin = cv2.imread('./output/out15.jpg',1)
kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(8, 3))  
height, width = origin.shape[:2]
origin = cv2.erode(origin,kernel)  

origin=cv2.resize(origin, (width/2, height/2))

gray = cv2.cvtColor(origin,cv2.COLOR_BGR2GRAY)

imgSplit = cv2.split(origin)
flag,b = cv2.threshold(imgSplit[2],0,255,cv2.THRESH_OTSU) 

element = cv2.getStructuringElement(cv2.MORPH_CROSS,(1,1))
cv2.erode(b,element)

edges = cv2.Canny(b,150,200,3,5)

ret,origin = cv2.threshold(origin,247,255,cv2.THRESH_BINARY)

hough_result = origin.copy()

lines = cv2.HoughLinesP(edges,1,np.pi/2,2, minLineLength = 19, maxLineGap = 1)

for line in lines:
    for x1,y1,x2,y2 in line:        
        cv2.line(hough_result,(x1,y1),(x2,y2),(255,255,0),1)

cv2.imshow('merged',concatImgHorizontal(origin,hough_result))

cv2.waitKey(0)
cv2.destroyAllWindows()
