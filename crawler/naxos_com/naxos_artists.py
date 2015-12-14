import os
from threading import Lock, Thread
import threadpool
import time
import sys
import urllib2
import hashlib
from pymongo import MongoClient
import json
import re
import demjson
import socket
from bs4 import BeautifulSoup
socket.setdefaulttimeout( 40 ) 

from Queue import Queue
from time import sleep

reload(sys) 
sys.setdefaultencoding('utf8') 

con=MongoClient()
db=con.mclassical

q = Queue()
NUM =3

def sha1(a):
    m2=hashlib.sha1()
    m2.update(a)
    return m2.hexdigest()

def getHtml(url):
    hash=sha1(url)
    filename='../htmls/'+hash
    if os.path.isfile(filename):
        print 'exist@@@@'
        return open(filename)
    url=url.replace(' ','%20')
    fetch=False
    html=''
    while not fetch:
        try:
            html=urllib2.urlopen(url).read()
            fetch=True
        except Exception as err:
            print 'TIMEOUT '+url
    fileObj=open(filename,'w',-1)
    fileObj.write(html)
    fileObj.close()
    return html

def getSoup(url):
    #print url
    return BeautifulSoup(getHtml(url))

url='http://www.naxos.com/nwgenrelist.asp?genre=Classical%20Music&workcat=Ballet&p_id=Q'
url='http://www.naxos.com/nwgenrelist.asp?genre=Classical%20Music&workcat=Chamber%20Music&p_id=S'
url='http://www.naxos.com/nwgenrelist.asp?genre=Classical%20Music&workcat=Choral%20-%20Secular&p_id='
prefix='http://www.naxos.com'
content=getSoup(url)
#content=BeautifulSoup(open('./naxos.html'))

urls=[]
firstCategory=content.select('.content td')

count=0
def extract(content):
    trs=content.select('table[width="90%"] tr')
    for i in range (2,len(trs)):
        try:
            a=trs[i].select('a')[0]
            name=a.contents[0]
            url=a.attrs['href']
            id=trs[i].select('td')[1].contents[0]
            data={'name':name,'url':url,'id':id}
            db.naxos.update({'id': id}, {'$setOnInsert': data}, True)
        except Exception as err:
            print err
            print 'ERROR OCCUR'
            continue
        #print name
        #print url
        #print id

def extractAlphabet(content):
    pages=content.select('td[valign="top"] td[align="center"] a')
    firstInPages=True
    if len(pages):
        #page 1,2,3,4,5...
        for l in range (0,len(pages)/2):
            print 'page'+str(l)
            if not firstInPages:
                extract(getSoup(prefix+pages[l].attrs['href']))
            else:
                extract(content)
                firstInPages=False
                l=l-1
    else:
        extract(content)


def extractCategory(content):
    alphabet=content.select('.content-title td a')
    if len(alphabet)>0:
        firstInAlphabet=True
        #0-9 A B ... Z
        for k in range(0,len(alphabet)):
            print 'alphbet'+str(k)
            if not firstInAlphabet:
                content=getSoup(prefix+alphabet[k].attrs['href'])
            else:
                firstInAlphabet=False
                k=k-1
            extractAlphabet(content)
    else:
        extract(content)

def extractAlbums(content):
    for i in range(2,len(firstCategory)):
        categorys=firstCategory[i].select('a')
        firstInCategory=True
        #Ballet, Chamber Music...
        for j in range(0,len(categorys)):
            print 'categorys'+str(j)
            if not firstInCategory:
                content=getSoup(prefix+categorys[j].attrs['href'])
            else:
                firstInCategory=False
                j=j-1
            extractCategory(content)
        break #only in ClassicalMusic
#extractAlbums(content)

def nameSwap(name):
    if name.find(',')>=0:
        pre=name[:name.find(',')].strip()
        name=name[name.find(',')+1:].strip()+' '+pre
    return name

albums=db.naxos.find({'info':{'$exists':False}}).sort('id')
albumsLen=db.naxos.find({'info':{'$exists':False}}).count()
def extractAlbumDetails(startAt,endAt):
    for i in range(startAt,endAt+1):
        album=albums[i]
        print 'START '+str(i)+'/'+str(albumsLen)+' '+album['id']
        content=getSoup(prefix+album['url'])

        albumInfo={
                'catalogueNo':'',
                'barcode':'',
                'physicalRelease':''
        }

        productDetails=content.select('.style5 p')
        for j in range(0,len(productDetails)):
            tstr=productDetails[j].select('strong')
            if len(tstr)==0:
                continue
            tstr=tstr[0].prettify()
            if tstr.find('Author(s)')>=0:
                albumInfo['authors']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['authors'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Arranger(s)')>=0:
                albumInfo['arrangers']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['arrangers'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Lyricist(s)')>=0:
                albumInfo['lyricists']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['lyricists'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Composer(s)')>=0:
                albumInfo['composers']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['composers'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Conductor(s)')>=0:
                albumInfo['conductors']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['conductors'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Ensemble(s)')>=0:
                albumInfo['ensembles']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['ensembles'].append({
                        'name':details[k].contents[0],
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Readers(s)')>=0:
                albumInfo['readers']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['readers'].append({
                        'name':nameSwap(details[k].contents[0]),
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Label')>=0:
                albumInfo['labels']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['labels'].append({
                        'name':details[k].contents[0],
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Genre')>=0:
                albumInfo['genres']=[]
                details=productDetails[j].select('a')
                for k in range(0,len(details)):
                    albumInfo['genres'].append({
                        'name':details[k].contents[0],
                        'url':details[k].attrs['href']
                    })
            elif tstr.find('Catalogue No:')>=0:
                albumInfo['catalogueNo']=productDetails[j].select('strong')[0].contents[0][14:].strip()
            elif tstr.find('Barcode')>=0:
                albumInfo['barcode']=productDetails[j].select('strong')[0].contents[0][14:].strip()
            elif tstr.find('Physical Release')>=0:
                albumInfo['physicalRelease']=productDetails[j].prettify()[60:-6].strip()

        supplies=content.select('table[width="95%"] a')
        if len(supplies)>0:
            albumInfo['supplies']=[]
        for j in range(0,len(supplies)):
            albumInfo['supplies'].append({
                'url':supplies[j].attrs['href']
            })

        contentStr=content.prettify()
        if contentStr.find('Total Playing Time')>=0:
            totalPlayingTimeIndex=contentStr.find('Total Playing Time')+37
            totalPlayingTime=contentStr[totalPlayingTimeIndex:totalPlayingTimeIndex+8]
            albumInfo['totalPlayingTime']=totalPlayingTime
        albumInfo['img']=content.select('.shadow img')[0].attrs['src']

        worksStr=content.select('table[align="left"]')[1].prettify()
        worksStr=worksStr[worksStr.find('<p '):-82]

        worksSoup=BeautifulSoup(worksStr)
        composers=worksSoup.select('.composers')
        worknames=worksSoup.select('.works')
        performers=worksSoup.select('.performers')
        works=[]
        for j in range(0,len(worknames)):
            tstr=worknames[j].prettify()
            workname=tstr[tstr.find('</a>')+6:tstr.find('</div>')-1]
            works.append({'name':workname})
        for j in range(0,len(composers)):
            works[j]['composers']=[]
            names=composers[j].select('a')
            #each composer
            for k in range(0,len(names)):
                name=''
                url=''
                try:
                    name=nameSwap(names[k].contents[0].strip())
                    url=names[k].attrs['href']
                except Exception as err:
                    print err
                    print 'ERROR'
                works[j]['composers'].append({
                    'name':name,
                    'url':url
                })
        for j in range(0,len(performers)):
            works[j]['performer']=[]
            performerDetails=performers[j].select('a')
            #each performer
            for k in range(0,len(performerDetails)):
                name=''
                url=''
                instrument=''
                try:
                    name=nameSwap(performerDetails[k].contents[0].strip())
                    parent=performerDetails[k].parent()[0].prettify()
                    url=performerDetails[k].attrs['href']
                    instrument=parent[parent.find('</a>')+4:-1].strip()
                except Exception as err:
                    print err
                    print 'ERROR'
                works[j]['performer'].append({
                    'name':name,
                    'url':url,
                    'instrument':instrument
                });
        for j in range(0,len(works)):
            details=worksStr[worksStr.find('<div class="performers" id="performers_'+str(j+1)+'"'):worksStr.find('<div class="performers" id="performers_'+str(j+2)+'"')]
            details=BeautifulSoup(details).select('b')
            works[j]['parts']=[]
            for k in range(0,len(details)):
                time=details[k].parent.prettify()
                time=time[-15:-7].strip()
                works[j]['parts'].append({'partName':details[k].contents[0].strip(),'time':time})


        db.naxos.update({
            'id':album['id']
        },{
            '$set':{
                'info':albumInfo,
                'works':works
            }
        })

def startMultiplyExtractor(startAt,endAt):
    def do_somthing_using(i):
        extractAlbumDetails(i,i)
    def working():
        while True:
            arguments = q.get()
            do_somthing_using(arguments)
            q.task_done()
    for i in range(NUM):
        t = Thread(target=working)
        t.setDaemon(True)
        t.start()
    for cursor in range(startAt,endAt,1):
        q.put(cursor)
    q.join()

startMultiplyExtractor(0,albumsLen)
