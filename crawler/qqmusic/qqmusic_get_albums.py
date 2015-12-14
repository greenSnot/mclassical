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

from Queue import Queue
from time import sleep

con=MongoClient()
db=con.mclassical

q = Queue()
NUM = 4

start_page=20;
end_page=2000;

if len(sys.argv)>1:
    start_page=int(sys.argv[1])
if len(sys.argv)>2:
    end_page=int(sys.argv[2])

def exist(id):
    r=db.qqmusic_albums.find_one({"id":id})
    if r:
        return True
    else:
        return False
def extract(i):
    path='qqmusic_albums/'
    content=open(path+str(i)+'.txt').read()

    content=content[21:content.find(']',-30,-1)+1]
    content=content.replace('"album":{','')
    content=content.replace('}}]','}]')
    content=content.replace('}},{"','},{"')

    content=content.replace('\\"','"')
    content=content.replace('\\"','"')
    content=content.replace("\\'","'")
    content=content.replace("\\ "," ")

    content=content.replace('"','\\"')
    def convert(a,b):
        return a.replace(b.replace('"','\\"'),b)
    content=convert(content,'{"area":"')
    content=convert(content,'","genre":"')
    content=convert(content,'","id":"')
    content=convert(content,'","index":"')
    content=convert(content,'","language":"')
    content=convert(content,'","mid":"')
    content=convert(content,'","name":"')
    content=convert(content,'","pub_time":"')
    content=convert(content,'","singer_area":"')
    content=convert(content,'","singer_id1":"')
    content=convert(content,'","singer_mid1":"')
    content=convert(content,'","singer_name":"')
    content=convert(content,'","singer_other_name":"')
    content=convert(content,'","singer_type":"')
    content=convert(content,'","song_num":"')
    content=convert(content,'"},{')
    content=content.replace('\\"}]','"}]')

    try:
        content=json.loads(content)
        #content=demjson.decode(content)
    except Exception as err:
        print err
        print 'error in '+str(i)
        sys.exit(0)

    for j in content:
        db.qqmusic_albums.update({"id":j['id']},{'$setOnInsert':j},True)
    print "SAVED:"+str(i)

def do_somthing_using(i):
    if os.path.isfile('qqmusic_albums/'+str(i)+'.txt'):
        print 'Existing:'+str(i)
        extract(i)
        return
    os.system('phantomjs phantom_qqmusic_albums.js '+str(i))
    print 'Finish:'+str(i)+' '+str(start_page)+'/'+str(end_page)
def working():
    while True:
        arguments = q.get()
        do_somthing_using(arguments)
        q.task_done()
for i in range(NUM):
    t = Thread(target=working)
    t.setDaemon(True)
    t.start()
for i in range(start_page,end_page,1):
    q.put(i)
q.join()

sys.exit(0)
#for i in range(1,10,1):
#    os.system('phantomjs ph_qqmusic.js '+str(i))


for i in range(start_page,end_page,1):
    if os.path.isfile('qqmusic_albums/'+str(i)+'.txt'):
        print 'Existing:'+str(i)
        start_page=i
    else:
        break;

indexes = []
for i in range(start_page,end_page,1):
    indexes.append(i)
 
def myRequest(i):
    if os.path.isfile('qqmusic_albums/'+str(i)+'.txt'):
        print 'Existing:'+str(i)
        return
    os.system('phantomjs phantom_qqmusic_albums.js '+str(i))
    print 'Finish:'+str(i)+' '+str(start_page)+'/'+str(end_page)
 
def timeCost(request, n):
  print "Elapsed time: %s" % (time.time()-start)
 
start = time.time()
pool = threadpool.ThreadPool(10)
reqs = threadpool.makeRequests(myRequest, indexes, timeCost)
[ pool.putRequest(req) for req in reqs ]
pool.wait()
