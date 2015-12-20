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
from bs4 import BeautifulSoup
socket.setdefaulttimeout( 25 ) 

from Queue import Queue
from time import sleep

reload(sys) 
sys.setdefaultencoding('utf8') 

con=MongoClient()
db=con.mclassical

qqmusic_albums=db.qqmusic_albums.find().sort('id');
db_len=db.qqmusic_albums.find().count();
    
def remove(filename):
    if os.path.isfile(filename):
        os.remove(filename)
    
def write(filename,content,a=False):
    type='w'
    if a:
        type='a'
    fileObj=open(filename,type,-1)
    fileObj.write(content)
    fileObj.close()

def download(url,filename):
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
            #if err.tostring().find('404')>0:
            #    return False
            return False
            time.sleep(1)

def worker(pid,startIndex,endIndex):
    print str(startIndex)+' '+str(endIndex)
    while startIndex<endIndex:
        index=startIndex
        album=qqmusic_albums[index]
        songs=album['details']
        print 'pid:'+str(pid)
        for i in range(0,len(songs)):
            songid=str(songs[i]['songid'])
            filename='m4a/downloading_'+songid;
            if os.path.isfile('m4a/'+songid+'.m4a'):
                print songid+' is downloaded'
                continue
            if os.path.isfile(filename):
                print songid+' is downloading'
                continue
            write(filename,'')
            if not download('http://ws.stream.qqmusic.qq.com/'+songid+'.m4a?fromtag=46','m4a/'+songid+'.m4a'):
                continue
            remove(filename)
            print "worker "+str(pid)+' '+songid
        startIndex=startIndex+1

if __name__ == "__main__":

    shards=3
    db_len=50000
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*db_len),int(float(i+1)/float(shards)*db_len)))
        p.start()

    print("The number of CPU is:" + str(multiprocessing.cpu_count()))
    for p in multiprocessing.active_children():
        print("child   p.name:" + p.name + "\tp.id" + str(p.pid))
    print "END!!!!!!!!!!!!!!!!!"
