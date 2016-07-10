#-*-coding:utf-8-*-
import urllib
import copy
import cv2
import matplotlib.pyplot as plt
import numpy as np
import cookielib
import os
from threading import Lock, Thread
import threadpool
import subprocess
import StringIO
import gzip
import requests
import thread
import commands
import random
import time
import sys
import urllib2
import hashlib
from pymongo import MongoClient
import json
import re
import demjson
import qiniu
import socket
import multiprocessing
import signal
import HTMLParser
from wand.image import Image
from PyPDF2 import PdfFileReader
html_parser = HTMLParser.HTMLParser()
from bs4 import BeautifulSoup
socket.setdefaulttimeout( 125 ) 

QN = qiniu.Auth('Ydyi73qwtgToPkCNkmBQzDIWtK1xzW_YN37Xy7TE','SQkOJg-B4JHaETjF5yJCqntsStMfdqi6hrCQCHq6')

from Queue import Queue
from time import sleep

reload(sys)
sys.setdefaultencoding('utf8') 

cookie= cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookie))
urllib2.install_opener(opener)

def exist(filename):
    return os.path.isfile(filename)

def remove(filename):
    if exist(filename):
        os.remove(filename)

def createDir(d):
    if not os.path.exists(d):
        os.makedirs(d)

def write(filename,content,append=False):
    type='w'
    if append:
        type='a'
    fileObj=open(filename,type,-1)
    fileObj.write(content)
    fileObj.close()

def split(t,pattern):
    s=t[:]
    pattern_len=len(pattern)
    res=[]
    while s.find(pattern)>=0:
        res.append(s[:s.find(pattern)])
        s=s[pattern_len+s.find(pattern):]
    res.append(s)
    return res

def sha1(a):
    m2=hashlib.sha1()
    m2.update(a)
    return m2.hexdigest()

def bs(content):
    if content==False:
        content=''
    return BeautifulSoup(content)

def html2text(content):
    return html_parser.unescape(content)

def download(url,filename,forever=True,proxy_url=False,timeout=120,ignore_404=False,fails_path=False):
    socket.setdefaulttimeout( timeout) 
    fetch=False
    while not fetch:
        content=''
        if proxy_url!=False:
            try:
                content=requests.get(url, proxies={"http":proxy_url,"https":proxy_url},timeout=timeout)
            except Exception as err:
                print(err)
                print('Fail to fetch '+url)
                if not forever:
                    return False
                print('retrying')
                time.sleep(1)
                continue
            if content.status_code==200:
                content=content.content
                fetch=True
                with open(filename,'wb') as code:
                    code.write(content)
                return True
            else:
                print('Fail to fetch '+url)
                if not forever:
                    return False
                time.sleep(1)
        else:
            try:
                content=urllib2.urlopen(url,timeout=timeout).read()
                fetch=True
                with open(filename,'wb') as code:
                    code.write(content)
                return True
            except urllib2.URLError,e:
                if hasattr(e,'code') and int(e.code)==404:
                    if ignore_404 and fails_path:
                        write(fails_path,url,True) 
                        return True
                    elif raise_404:
                        raise Exception("404 error abort")
                print('Fail to fetch '+url)
                
                if not forever:
                    return False
                print('retrying')
                time.sleep(1)
                continue

def getHtml(url,data=False,forever=True,cache=True,cachePath='./htmls/',ua={},reCache=False,log=True):
    req=urllib2.Request(url)
    hash=sha1(url)
    content=''
    for i in ua.keys():
        req.add_header(i,ua[i])
    if data!=False:
        postData = urllib.urlencode(data)
        req=urllib2.Request(url,postData)
        hash=hash+sha1(postData)
    if cache and exist(cachePath+hash):
        if log:
            print('EXIST '+url+' '+hash)
        content=open(cachePath+hash).read()
        return content
    fetch=False
    while not fetch:
        try:
            content=opener.open(req)
            if 'gzip'==content.headers.get('Content-Encoding'):
                compressedstream = StringIO.StringIO(content.read())
                gzipper = gzip.GzipFile(fileobj=compressedstream)
                content = gzipper.read()
            else:
                content=content.read()
            fetch=True
        except Exception as err:
            if log:
                print(err)
                print('Fail to fetch '+url+' '+hash)
            if hasattr(err,'code') and err.code==404:
                return False
            if not forever:
                return False
            if log:
                print('Reloading')
            time.sleep(1)
    if cache or reCache:
        write(cachePath+hash,content)
    return content

def text2json(text):
    try:
        text=json.loads(text)
    except Exception as err:
        print(err)
    return text

def jsonHtmlDecode(s):
    if isinstance(s,list):
        for i in range(0,len(s)):
            if isinstance(s[i],list) or isinstance(s[i],dict):
                s[i]=jsonHtmlDecode(s[i])
            elif isinstance(s[i],str):
                s[i]=html2text(s[i])
    else:
        for i in s.keys():
            if isinstance(s[i],list) or isinstance(s[i],dict):
                s[i]=jsonHtmlDecode(s[i])
            elif isinstance(s[i],str):
                s[i]=html2text(s[i])
    return s

def isChinese(uchar):
    if uchar >= u'\u4e00' and uchar<=u'\u9fa5':
        return True
    else:
        return False

def hasChinese(s):
    if not isinstance(s, unicode):
        s=unicode(s,'utf-8')
    for i in s:
        if isChinese(i):
            return True
    return False

def hashFile(filename):
    m = hashlib.md5()
    with open(filename, 'rb') as fp: 
        while True:
            blk = fp.read(4096) # 4KB per block
            if not blk: break
            m.update(blk)
    return m.hexdigest()

def pdf2jpg(pdfPath,jpgPath,prefix='out'):
    input1 = PdfFileReader(open(pdfPath, "rb"))
    numPages=input1.getNumPages();
    # Converting first page into JPG
    for i in range (0,numPages):
        with Image(filename=pdfPath+'['+str(i)+']',resolution=200) as img:
             img.save(filename=jpgPath+'/'+prefix+str(i)+".jpg")

def concatImgHorizontal(img1,img2):
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    vis = np.zeros((max(h1, h2), w1+w2,3), np.uint8)
    vis[:h1, :w1,:3] = img1
    vis[:h2, w1:w1+w2,:3] = img2
    return vis
