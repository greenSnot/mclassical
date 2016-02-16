import sys
import socket
socket.setdefaulttimeout( 30 ) 
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
con.mclassical.authenticate('r','r',mechanism='SCRAM-SHA-1')
db=con.mclassical

shards=1
total=0
dbMusopen=db.musopen_composers

def clearDownloading():
    filesdir='./pdfs';
    files=os.listdir(filesdir)
    for fname in files:
        if fname.find('downloading_')==0:
            remove(filesdir+'/'+fname)
            print 'clear '+fname
clearDownloading()

def MusopenDownloader(index):
    global total
    composer=dbMusopen.find({'downloaded':{'$exists':False}})[index]
    works=composer['works']
    print 'start '+str(index)+'/'+str(total)+' '+composer['name']
    for i in works:
        work=i
        if not ('resources' in work.keys()):
            continue
        for j in work['resources']:
            url=j['url']
            filename='./pdfs/'+sha1(url)
            downloading_filename='./pdfs/downloading_'+sha1(url)
            if exist(filename):
                print 'exist! '+filename
                continue
            if exist(downloading_filename):
                print 'downloading '+filename
                continue

            print 'start downloading '+url
            write(downloading_filename,'')
            download(url,'./pdfs/'+sha1(url),proxy_url="http://localhost:8787",timeout=60)
            remove(downloading_filename)
            ########### safely downloading

            print 'downloaded '+url+' '+sha1(url)+' '+composer['name']

    dbMusopen.update({'_id':composer['_id']},{'$set':{'downloaded':True}})
    print 'finished '+str(index)+'/'+str(total)+' '+composer['name']

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
