import sys
import socket
socket.setdefaulttimeout( 30 ) 
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
db=con.mclassical

shards=1
total=0
dbMusopen=db.musopen_composers

def MusopenDownloader(index):
    global total
    composer=dbMusopen.find({'downloaded':{'$exists':False}})[index]
    works=composer['works']
    for i in works:
        work=i
        if not ('resources' in work.keys()):
            continue
        for j in work['resources']:
            url=j['url']
            download(url,'./pdfs/'+sha1(url),proxy_url="http://localhost:8787",timeout=600)
            print 'downloaded '+url+' '+sha1(url)+' '+composer['name']

    dbMusopen.update({'_id':composer['_id']},{'$set':{'downloaded':True}})
    print str(index)+'/'+str(total)+' '+composer['name']

def worker(pid,startIndex,endIndex):
    global total
    total=dbMusopen.find({'downloaded':{'$exists':False}}).count()
    while total:
        MusopenDownloader(int(float(pid)/float(shards)*total))
        total=total-1

if __name__ == "__main__":
    total=dbMusopen.find({'downloaded':{'$exists':False}}).count()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
