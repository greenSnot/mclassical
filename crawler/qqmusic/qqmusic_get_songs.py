import os
from threading import Lock, Thread
import threadpool
import time
import sys
import urllib2
from pymongo import MongoClient
import json
import re
import demjson
import socket
socket.setdefaulttimeout( 30 ) 

from Queue import Queue
from time import sleep

con=MongoClient()
db=con.mclassical

q = Queue()
NUM =48

albums=db.qqmusic_albums.find({'details':{'$exists':False}},{'id':1,'mid':1})
totle=db.qqmusic_albums.find({'details':{'$exists':False}},{'id':1,'mid':1}).count()
def getDetails(cursor):
    album=albums[cursor]
    mid=album['mid']
    id=album['id']
    url='http://i.y.qq.com/v8/fcg-bin/fcg_v8_album_detail_cp.fcg?tpl=20&albummid='+mid+'&play=0'
    fetch=False
    while not fetch:
        try:
            content= urllib2.urlopen(url)
            content=content.read()
            fetch=True
        except Exception as err:
            print 'TIMEOUT RETRYING...'+str(cursor)
            fetch=False
    
    try:
        content=content[content.find('	songList :')+12:content.find('cdNum : ')-5]
        content=json.loads(content)
        fetch=True
    except Exception as err:
        #copyright issues
        print "db.getCollection('qqmusic_albums').remove({mid:'"+album['mid']+"'});"
        fetch=False
    if fetch==False:
        return
    db.qqmusic_albums.update({'id':id},{'$set':{'details':content}})
    print 'FINISH:'+album['id']+' '+str(cursor)+'/'+str(totle)

def do_somthing_using(i):
    getDetails(i)
def working():
    while True:
        arguments = q.get()
        do_somthing_using(arguments)
        q.task_done()
for i in range(NUM):
    t = Thread(target=working)
    t.setDaemon(True)
    t.start()
for cursor in range(0,totle,1):
    q.put(cursor)
q.join()

sys.exit(0)
