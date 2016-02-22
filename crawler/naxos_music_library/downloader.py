#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

#con=MongoClient()
#con.mclassical.authenticate('r','r')
#db=con.mclassical
#dbNaxos=db.__temp_naxos_music_library

cookie= cookielib.CookieJar()
cookie_handler =urllib2.HTTPCookieProcessor(cookie)

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
    #setBasicHeader(req)

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
    
    print content
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

while not login():
    continue
#login Success

download('http://www.naxosmusiclibrary.com/mediaplayer/PlayTrack.asp?id=996648&br=64','./test')

#def worker(pid,startIndex,endIndex):
#    getWorks(startIndex,endIndex)
#    getWorksDetails(startIndex,endIndex)
#
#if __name__ == "__main__":
#
#    getAllComposers()
#    shards=16
#    db_len=composers_len
#    for i in range(0,shards):
#        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*db_len),int(float(i+1)/float(shards)*db_len)))
#        p.start()

sys.exit(0)
