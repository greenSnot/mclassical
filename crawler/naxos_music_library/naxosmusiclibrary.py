#-*-coding:utf-8-*-
import urllib
import cookielib
import os
from threading import Lock, Thread
import threadpool
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
from bs4 import BeautifulSoup
socket.setdefaulttimeout( 25 ) 

from Queue import Queue
from time import sleep

reload(sys) 
sys.setdefaultencoding('utf8') 

con=MongoClient()
db=con.mclassical

jobPool=[]
threadNum=1

cookie= cookielib.CookieJar()
cookie_handler =urllib2.HTTPCookieProcessor(cookie)
proxy_handler = urllib2.ProxyHandler({'http': 'http://127.0.0.1:8787'})

opener = urllib2.build_opener(cookie_handler,proxy_handler)
urllib2.install_opener(opener)

dbNaxos=db.__temp_naxos_music_library
def write(filename,content,a=False):
    type='w'
    if a:
        type='a'
    fileObj=open(filename,type,-1)
    fileObj.write(content)
    fileObj.close()

def split(t,pattern):
    s=t[:]
    pattern_len=len(pattern)
    res=[]
    while s.find(pattern)>=0:
        res.append(s[:s.find(pattern)])
        s=s[pattern_len+s.find(pattern):]
    res.append(s)
    return res

def nameSwap(name):
    if name.find(',')>=0:
        pre=name[:name.find(',')].strip()
        name=name[name.find(',')+1:].strip()+' '+pre
    return name

def sha1(a):
    m2=hashlib.sha1()
    m2.update(a)
    return m2.hexdigest()

headers={
        'Host':'www.naxosmusiclibrary.com',
        'Proxy-Connection':'keep-alive',
        'Pragma':'no-cache',
        'Cache-Control':'no-cache',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language':'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        'Accept-Encoding':'gzip, deflate',
        'Upgrade-Insecure-Requests':'1',
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
}
def setBasicHeader(req):
    #req.add_header('Connection','keep-alive')
    #req.add_header('Content-Length','119')
    #req.add_header('Content-Type','application/x-www-form-urlencoded')
    #req.add_header('Origin','http://www.naxosmusiclibrary.com')
    req.add_header('Host','www.naxosmusiclibrary.com')
    req.add_header('Proxy-Connection','keep-alive')
    req.add_header('Pragma','no-cache')
    req.add_header('Cache-Control','no-cache')
    req.add_header('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
    req.add_header('Accept-Language','zh-CN,zh;q=0.8,zh-TW;q=0.6')
    req.add_header('Accept-Encoding','gzip, deflate')
    #req.add_header('Referer','http://www.naxosmusiclibrary.com/recentadditions.asp')
    req.add_header('Upgrade-Insecure-Requests','1')
    req.add_header('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36')
    return req

lastLoginTime=0
loginLock=False
def login():
    global cookie 
    global lastLoginTime
    global loginLock
    loginLock=True
    cookie.clear_session_cookies()
    cookie.clear()

    fetch=True
    try:
        t=opener.open('http://www.naxosmusiclibrary.com/home.asp?rurl=%2Fdefault%2Easp')
    except Exception as err:
        print err
        print 'Fail to fetch home'
        fetch=False
    if not fetch:
        return False
    print 'Fetch home'

    loginUrl = "http://www.naxosmusiclibrary.com/action.Login.asp"
    loginData= {
        'mins15_preview':'true',
        'page_name':'Login',
        'L_Code':'',
        'item_code2':'',
        'newQuery':'New',
        'MemberFull':'',
        'link2':'',
        'forgotpass':'',
        'USERNAME':'',
        'PASSWORD':''
        }
    postData = urllib.urlencode(loginData)
    
    req = urllib2.Request(loginUrl, postData)
    setBasicHeader(req)

    content=''
    fetch=True
    try:
        content=opener.open(req).read()
    except Exception as err:
        print err
        print 'Fail to fetch login'
        fetch=False
    if not fetch:
        return False
    
    #for i in cookie:
    #    print i.name+':'+i.value

    if content.find('Featured Additions are a selection of albums recently added to Naxos Music Library and updated weekly. The thumbnail images of album covers allow easy viewing, listening, and access to album inf')>0:
        print 'Login Success'
        lastLoginTime=time.time()
        loginLock=False
        return True
    write('naxos_error.html',content)
    #ingore Error
    #print 'INGORE ERROR'
    #return True
    return False

#getDetails
# 426 classicalMusic
# id 36 ballet
# id 54 chamberMusic
# id 200 choralSacred
# id 201 choralSecular
# id 29 concertos
# id 213 crossOver
# id 58 FilmAndTV
# id 204 HistoricalDocument
# id 60 Instrumental
# id 203 Interview
# id 191 Musicals
# id 207 NatureSounds
# id 211 Opera
# id 212 Operatta
# id 53 Orchestral
# id 216 Orchestral Backing Tracks
# id 205 RadioShow
# id 206 SpokenCommentary
# id 55 Vocal
# id 214 vocalEnsemble
# id 208 windEnsemble/BandMusic

#http://www.naxosmusiclibrary.com/browsesearch.asp?genreid=426&CategoryID=36

def getAllAttrs(obj):
    strAttrs = ''
    for o in dir(obj): 
        strAttrs =strAttrs + o + ' := ' + str(getattr(obj,o)) + '\n'
    return strAttrs;

def soup(url,data=False,cover=False):
    global lastLoginTime
    global loginLock
    req=urllib2.Request(url)
    hash=sha1(url)
    if data!=False:
        postData = urllib.urlencode(data)
        req=urllib2.Request(url,postData)
        hash=sha1(postData)
    req=setBasicHeader(req)
    content=''
    filename='../htmls/'+hash
    if (not cover) and os.path.isfile(filename):
        if data!=False:
            print 'EXIST page '+str(data['pageNo'])+' in category '+str(data['categoryId'])+' HASH: '+hash
        else:
            print 'EXIST '+url+' HASH: '+hash
        content=open(filename)
    else:
        print 'not exist'
        #htmlfetch=False
        #while not htmlfetch:
        #    try:
        #        #login expired?
        #        if time.time()-lastLoginTime>10*60:
        #            if loginLock:
        #                print 'LoginLocking'
        #                while loginLock:
        #                    time.sleep(1)
        #            else:
        #                print 'ReLogin'
        #                while not login():
        #                    print 'Fail ReLogin'
        #        #for i in cookie:
        #        #    print i.name+':'+i.value
        #        #getAllAttrs(req)
        #        content=opener.open(req).read()
        #        #content=urllib2.urlopen(req)
        #        htmlfetch=True
        #    except Exception as err:
        #        print '#####################'
        #        print err
        #        if data!=False:
        #            print '#Fail : page '+str(data['pageNo'])+' in category '+str(data['categoryId'])
        #        else:
        #            print '#Fail '+url
        #        print '#####################'
        #write(filename,content)
        #sys.exit(0)
    return BeautifulSoup(content)

def initDirectoryExtractor():
    global jobPool
    cid=[36,54,200,201,29,213,58,204,60,203,191,207,211,212,53,216,205,206,55,214]
    for index in range(0,len(cid),1):
        url='http://www.naxosmusiclibrary.com/browsesearch.asp?genreid=426&CategoryID='+str(cid[index])
        content=soup(url)
        totalPage=content.select('#divPageNo2')[0].contents[0]
        totalPage=int(totalPage[totalPage.find(' of')+3:].strip())
        for j in range(1,totalPage+1,1):
            jobPool.append({'cid':cid[index],'page':j})
        print 'INIT :'+str(index+1)+'/'+str(len(cid))

def extractDirectory(cid,page):
    postData={
            'pageNo':page,
            'pageSize':15,
            'Sort':'CatalogueName ASC',
            'genreId':426,
            'languageId':'EN',
            'alpha':'All',
            'categoryId':cid
    }
    content=soup('http://www.naxosmusiclibrary.com/BrowseSearchRender.asp',postData)
    tracks=content.select('table[cellpadding="5"] td[width="800px"] a')
    if len(tracks)==0:
        print content
        print '????'
        sys.exit(0)
    for i in range(0,len(tracks)):
        name=tracks[i].contents[0]
        url=tracks[i].attrs['href']
        id=tracks[i].parent.attrs['id'][4:]
        dbNaxos.update({
            'id':id
        },{
            '$setOnInsert':{
                'id':id,
                'name':name,
                'url':url
            }
        },True)
    print 'Finish category '+str(cid)+' page:'+str(page)

def startMultiplyDirectoryExtractor(startIndex):
    global jobPool
    while len(jobPool):
        data=jobPool.pop()
        extractDirectory(data['cid'],data['page'])

startIndex=0
if len(sys.argv)>1:
    startIndex=int(sys.argv[1])

albums=dbNaxos.find({'details':{'$exists':False}},{'id':1}).sort('id')
albums_len=dbNaxos.find({'details':{'$exists':False}},{'id':1}).count()

def initAlbumExtractor():
    global jobPool
    for i in range(0,albums_len,1):
        jobPool.append({'index':i})
    print 'INIT ALBUMEXTRACTOR FINISH'

def extractAlbum(index):
    album=albums[index]
    #album['id']='ZZT031101.3'
    soupurl='http://www.naxosmusiclibrary.com/catalogue/item.asp?'+urllib.urlencode({'cid':str(album['id'])})
    content=soup(soupurl)

    contentStr=content.prettify()

    albumInfo=content.select('#left-sidebar b')
    if len(albumInfo)==0:
        print 'NOTAVAILABLE index '+str(index)+' album '+str(album['id'])
        #DELETE AND RELOAD

        #fn= '../htmls/'+sha1(soupurl)
        #if os.path.isfile(fn):
        #  os.remove(fn)
        #extractAlbum(index)
        return
    data={}
    data['works']=[]
    maincontent=contentStr[:]
    maincontent=maincontent[maincontent.find('<td align="left" id="mainbodycontent"'):maincontent.find('<div id="tooltip"')]
    splitByComposer=split(maincontent,'<div class="composerheader">')[1:]

    print len(splitByComposer)
    for i in range(0,len(splitByComposer)):
        composers=BeautifulSoup(splitByComposer[i][:splitByComposer[i].find('</div')]).select('a')
        curComposers=[]
        for j in range(0,len(composers)):
            originName=composers[j].contents[0].strip()
            composerName=nameSwap(originName)
            composerUrl=composers[j].attrs['href']
            parent=composers[j].parent.prettify()
            nameIndex=parent.find(originName)
            parent=parent[nameIndex:parent.find('<br/>',nameIndex)]
            curData={
                    'name':composerName,
                    'url':composerUrl
            }
            #Not a composer
            if parent.find('lyricist\n </i>')>=0:
                curData['type']='lyricists'
            elif parent.find('arranger\n </i>')>=0:
                curData['type']='arrangers'
            else:
                curData['type']='composers'
            curComposers.append(curData)
        curPlayers=[]
        worksInComposer=split(splitByComposer[i],'<b>')[1:]
        for j in range(0,len(worksInComposer)):
            #####If contains artists
            if j==0 and worksInComposer[j].find('<div id="trackartists_')>=0:
                tempindex=worksInComposer[j].find('<div id="trackartists_')
                players=split(worksInComposer[j][tempindex:worksInComposer[j].find('</div>',tempindex)+6],'<a href=')[1:]
                for k in range(0,len(players)):
                    try:
                        p=players[k]
                        playerName=nameSwap(p[p.find('">')+2:p.find('</a>')].strip())
                        playerUrl=p[1:p.find('">')].strip()
                        instrument=''
                        instrument=(p[p.find('</a>')+22:p.find('<br/>')+1]).strip()
                        if instrument.find(','):
                            instrument=instrument[:instrument.find(',')]
                        instrument=instrument.strip()
                        curPlayers.append({
                            'name':playerName,
                            'url':playerUrl,
                            'instrument':instrument
                        })
                    except Exception as err:
                        print err
                        print 'error in players'
            workName=worksInComposer[j][:worksInComposer[j].find('</b>')].strip()
            curWork={'name':workName,'composers':[],'arrangers':[],'lyricists':[],'parts':[],'players':curPlayers}
            for k in range(0,len(curComposers)):
                curWork[curComposers[k]['type']].append({
                    'name':curComposers[k]['name'],
                    'url':curComposers[k]['url']
                })

            partsInWork=split(worksInComposer[j],'»')[1:]
            for k in range(0,len(partsInWork)):
                partName=partsInWork[k][:partsInWork[k].find('</td>')].strip()
                divIndex=partName.find('<div')
                if divIndex>=0:
                    partName=partName[:divIndex].strip()
                curWork['parts'].append({'name':partName})
            data['works'].append(curWork)

    for j in range(0,len(albumInfo)):
        type=albumInfo[j].contents[0]
        if type=='Also:' or type=='Buy and Download' or type=='Distribution Notes:'or type=='Album Information' or type =='Reader(s):' or type=='Author(s):':
            continue
        elif type=='Genre':
            keyname='genres'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':details[k].contents[0],
                    'url':details[k].attrs['href']
                })
        elif type=='Category':
            keyname='categories'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':details[k].contents[0],
                    'url':details[k].attrs['href']
                })
        elif type=='Composer(s):':
            keyname='composers'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':nameSwap(details[k].contents[0]),
                    'url':details[k].attrs['href']
                })
        elif type=='Arranger(s):':
            keyname='arrangers'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':nameSwap(details[k].contents[0]),
                    'url':details[k].attrs['href']
                })
        elif type=='Artist(s):':
            keyname='artists'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':nameSwap(details[k].contents[0]),
                    'url':details[k].attrs['href']
                })
        elif type=='Label:':
            data['label']=albumInfo[j].parent.prettify()[142:-8].strip()
        elif type=='Catalogue No.:':
            data['catelogueNo']=album['id']
        elif type=='Lyricist(s):':
            keyname='lyricists'
            details=albumInfo[j].parent.select('a')
            data[keyname]=[]
            for k in range(0,len(details)):
                data[keyname].append({
                    'name':nameSwap(details[k].contents[0]),
                    'url':details[k].attrs['href']
                })
        else:
            print "!!!!!!!!!!!!!!!!!!!!"
            print type
            write('naxos_unknow.html',content.prettify(),True)

    payments=content.select('#paymentLinks li')
    data['payments']=[]
    for k in range(0,len(payments)):
        curPayment={}
        if not('data-linktype' in payments[k].attrs.keys()):
            curPayment['data-externalid']=payments[k].attrs['data-externalid']
            curPayment['data-linktype']='other'
        else:
            for l in payments[k].attrs.keys():
                if l=='class':
                    continue
                curPayment[l]=payments[k].attrs[l]
        data['payments'].append(curPayment)
    album_thumbnail=content.select('#left-sidebar .shadow img')
    if len(album_thumbnail)>0:
        data['album_thumbnail']=album_thumbnail[0].attrs['src']
    album_image=content.select('#left-sidebar .hires')
    if len(album_image)>0:
        data['album_image']=album_image[0].attrs['href']

    if len(data['works'])==0:
        print 'no works '+album['id']
        return

    dbNaxos.update({
        'id':album['id']
    },{
        '$set':{
            'details':data
        }
    })
    print album['id']


def startMultiplyAlubmExtractor(startIndex=0):
    global jobPool
    total=len(jobPool)
    def working( threadName ):
        while len(jobPool):
            data=jobPool.pop()
            print threadName+'INDEX Album '+str(data['index'])+'/'+str(total)
            extractAlbum(data['index'])
    for i in range(0,threadNum):
       thread.start_new_thread( working, ("Thread-"+str(i), ) )

#while not login():
#    continue
#login Success

#initDirectoryExtractor()
#startMultiplyDirectoryExtractor(startIndex)

initAlbumExtractor()
startMultiplyAlubmExtractor(startIndex)

#remove albums which not exist details
#dbNaxos.remove({'details':{$exists:false}})
while 1:
   pass
