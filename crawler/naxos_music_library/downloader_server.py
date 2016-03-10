#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

con=MongoClient('120.24.167.94',27017)
con.mclassical.authenticate('r','r')
db=con.mclassical
dbNaxos=db.naxos_music_library

print dbNaxos.update({'download_status':{'$exists':False}},{'$set':{'download_status':0}},multi=True)
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
    print "error login"
    os.popen('nohup python -u downloader_server.py >>out4.txt &').read()
    sys.exit(0)
    return False

while not login():
    continue
#login Success

def parseInt(num):
    try:
        return int(num)
    except ValueError:
        result = []
        for c in num:
            if not ('0' <= c <= '9'):
                break
            result.append(c)
        if len(result) == 0:
            return 0
        return int(''.join(result))

dir_sum=0
zip_sum=0
zips_path='./resources_zips/'
res_path='./resources'+str(dir_sum)+'/'
def downloadById(album_id,id):
    global lastLoginTime
    global dir_sum
    global zip_sum
    global res_path
    id=str(parseInt(id))
    res_path='./resources'+str(dir_sum)+'/'
    createDir(res_path)
    createDir(res_path+album_id)
    createDir(zips_path)
    files_sum=int(os.popen('ls '+res_path+' |wc -l').read())
    #if files_sum>50:
    #    dir_sum=dir_sum+1
    #    zip_sum=zip_sum+1
    #    os.popen('tar -zcf '+zips_path+str(zip_sum)+'.tar ./resources')
    #    os.popen('rm -f ./resources/*')
    while int(os.popen('ls -l '+zips_path+' |grep \'^-\'|wc -l').read())>50:
        time.sleep(60)
    if time.time()-lastLoginTime>60*5:
        while not login():
            pass
    print 'downloading '+album_id+' '+id
    while not download('http://www.naxosmusiclibrary.com/mediaplayer/PlayTrack.asp?id='+id+'&br=64',res_path+album_id+'/'+id,forever=False):
        while not login():
            pass


albums=dbNaxos.find({'download_status':0})
total=albums.count()
while total>0:
    index=int(random.random()*total)
    print str(index)+'/'+str(total)
    album=albums[index]
    if 'download_status' in album.keys() and album['download_status']>0:
        print 'downloaded album '+album['id']
        continue
    dbNaxos.update({'id':album['id']},{'$set':{'download_status':1}})
    for work in album['details']['works']:
        if 'id' in work.keys():
            downloadById(album['id'],work['id'])
        for part in work['parts']:
            downloadById(album['id'],part['id'])

    print 'tar ing'
    os.popen('tar -zcf '+zips_path+str(album['id'])+'.tar '+res_path+str(album['id']))
    os.popen('rm -rf '+res_path+str(album['id']))

    dbNaxos.update({'id':album['id']},{'$set':{'download_status':2}})
    print 'done album '+album['id']

    total=albums.count()

sys.exit(0)
