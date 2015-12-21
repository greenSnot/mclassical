#-*-coding:utf-8-*-
import urllib
import cookielib
import os
from threading import Lock, Thread
import threadpool
import requests
import thread
import random
import time
import sys
import urllib2
import hashlib
from pymongo import MongoClient
import json
import re
import demjson
import socket
import multiprocessing
import HTMLParser
html_parser = HTMLParser.HTMLParser()
from bs4 import BeautifulSoup
socket.setdefaulttimeout( 25 ) 

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

def write(filename,content,append=False):
    type='w'
    if append:
        type='a'
    fileObj=open(filename,type,-1)
    fileObj.write(content)
    fileObj.close()

def download(url,filename,forever=True):
    fetch=False
    data=''
    while not fetch:
        try:
            data=urllib2.urlopen(url).read()
            fetch=True
            with open(filename,'wb') as code:
                code.write(data)
            return True
        except Exception as err:
            print 'Fail to fetch '+url
            if not forever:
                return False
            time.sleep(1)

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
    return BeautifulSoup(content)

def html2text(content):
    return html_parser.unescape(content)

def getHtml(url,data=False,forever=True,cache=True,cachePath='./htmls/'):
    req=urllib2.Request(url)
    hash=sha1(url)
    content=''
    if data!=False:
        postData = urllib.urlencode(data)
        req=urllib2.Request(url,postData)
        hash=hash+sha1(postData)
    if cache and exist(cachePath+hash):
        print 'EXIST '+url+' '+hash
        content=open(cachePath+hash).read()
        return content
    fetch=False
    while not fetch:
        try:
            content=opener.open(req).read()
            fetch=True
        except Exception as err:
            print 'Fail to fetch '+url
            if not forever:
                return False
            time.sleep(1)
    if cache:
        write(cachePath+hash,content)
    return content

