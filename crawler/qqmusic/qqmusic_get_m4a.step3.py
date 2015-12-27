import sys
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
db=con.mclassical

shards=3

dbQQMusic=db.qqmusic_albums
albums=dbQQMusic.find().sort('id');
total=albums.count();

###################################
###################################
#########Not Complete Yet!#########
###################################
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

    db_len=50000
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
