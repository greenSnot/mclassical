import sys
import socket
socket.setdefaulttimeout( 30 ) 
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
db=con.mclassical
dbQQMusic=db.qqmusic_test

def getAlbums(startIndex,endIndex):
    if startIndex==0:
        startIndex=1
    for i in range(startIndex,endIndex,1):
        print 'loading '+str(i)+'/'+str(endIndex)
        content=getHtml('http://sns.music.qq.com/fcgi-bin/albumlist/fcg_album_list.fcg?inter=0&lang=0&type=0&index=0&quality=0&sort=1&pagenum='+str(i)+'&pagesize=30&otype=json&callback=MusicJsonCallback&_=0.8246259882580489&g_tk=938407465&loginUin=0&hostUin=0&format=jsonp&inCharset=GB2312&outCharset=utf-8&notice=0&platform=yqq&jsonpCallback=MusicJsonCallback&needNewCode=0',ua={
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept-Language':'zh-CN,zh;q=0.8,zh-TW;q=0.6',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive',
            'Host':'sns.music.qq.com',
            'Pragma':'no-cache',
            'Upgrade-Insecure-Requests':'1',
            'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
        })
        print str(startIndex)+'/'+str(endIndex)
        content=content.replace('MusicJsonCallback(','')
        content=content.replace('\n)','')
        albums=text2json(content)['root']['albumlist']
        for j in range(0,len(albums)):
            albums[j]=albums[j]['album']
            ##########PopMusic/ModernMusic Filter
            ######0 unknown 2 classical 9 pure music
            if not(albums[j]['genre']=='0' or albums[j]['genre']=='2' or albums[j]['genre']=='9'):
                continue
            ###############
            for k in albums[j].keys():
                albums[j][k]=html2text(albums[j][k])
            dbQQMusic.update({
                'id':str(albums[j]['id'])
            },{
                '$setOnInsert':albums[j]
                #'$set':albums[j]
            },True)

def worker(pid,startIndex,endIndex):
    getAlbums(startIndex,endIndex)

if __name__ == "__main__":

    shards=3
    db_len=int(775848/30)
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*db_len),int(float(i+1)/float(shards)*db_len)))
        p.start()

