import sys
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
con.mclassical.authenticate('r','r',mechanism='SCRAM-SHA-1')
db=con.mclassical

shards=8

dbQQMusic=db.qqmusic_albums
dbAudios=db.SCMD_audios
total=0

def clearDownloading():
    filesdir='./m4a';
    files=os.listdir(filesdir)
    for fname in files:
        if fname.find('downloading_')==0:
            remove(filesdir+'/'+fname)
            print 'clear '+fname

def QQMusicDownloader(index):
    global total
    audio=dbAudios.find({'downloaded':{'$exists':False}})[index]
    songid=str(audio['other_id']['qqmusic_song_id'])
    filename='m4a/downloading_'+songid;
    if os.path.isfile('m4a/'+songid+'.m4a'):
        print songid+' is downloaded'
        return
    if os.path.isfile(filename):
        print songid+' is downloading'
        return
    write(filename,'')
    if not download('http://ws.stream.qqmusic.qq.com/'+songid+'.m4a?fromtag=46','m4a/'+songid+'.m4a',forever=False):
        print 'fail in '+str(songid)
        return
    remove(filename)
    dbAudios.update({'_id':audio['_id']},{'$set':{'downloaded':True}},False)
    print "worker "+str(songid)+' '+str(total)
    
def worker(pid,startIndex,endIndex):
    global total
    total=dbAudios.find({'downloaded':{'$exists':False}}).count()
    while total:
        if total<shards*2:
            if pid==0:
                QQMusicDownloader(int(float(pid)/float(shards)*total))
        else:
            #QQMusicDownloader(int(float(pid)/float(shards)*total))
            QQMusicDownloader(int(random.random()*total))
        total=dbAudios.find({'downloaded':{'$exists':False}}).count()

clearDownloading()
if __name__ == "__main__":
    total=dbAudios.find({'downloaded':{'$exists':False}}).count()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
