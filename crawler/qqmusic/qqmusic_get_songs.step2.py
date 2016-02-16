import sys
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
con.mclassical.authenticate('r','r',mechanism='SCRAM-SHA-1')
db=con.mclassical

shards=16

dbQQMusic=db.qqmusic_albums

albums=dbQQMusic.find({'details':{'$exists':False}},{'id':1,'mid':1})
total=dbQQMusic.find({'details':{'$exists':False}},{'id':1,'mid':1}).count()
def getDetails(index):
    album=albums[index]
    mid=album['mid']
    id=album['id']
    url='http://i.y.qq.com/v8/fcg-bin/fcg_v8_album_detail_cp.fcg?tpl=20&albummid='+mid+'&play=0'
    content=getHtml(url,cachePath='./htmls_details/')
    try:
        content=content[content.find('	songList :')+12:content.find('cdNum : ')-5]
        content=json.loads(content)
    except Exception as err:
        #copyright issues
        print 'copyright issues '+album['mid']
        dbQQMusic.remove({'mid':album['mid']})
        return
    content=jsonHtmlDecode(content)
    dbQQMusic.update({'id':id},{'$set':{'details':content}})
    print 'Done: '+str(album['mid'])

def worker(pid,startIndex,endIndex):
    global total
    total=dbQQMusic.find({'details':{'$exists':False}},{'id':1,'mid':1}).count()
    while total>0:
        total=dbQQMusic.find({'details':{'$exists':False}},{'id':1,'mid':1}).count()
        print 'Left: '+str(total)
        getDetails(int(float(pid)/float(shards)*total))

def clear():
    dbQQMusic.update({'details':{'$exists':True}},{'$unset':{'details':{'$exists':True}}},False,True)

if __name__ == "__main__":
    clear()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
