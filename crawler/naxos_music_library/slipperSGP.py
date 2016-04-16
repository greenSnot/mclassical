#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *
from urllib import unquote
import re
from urllib import quote

remote_path=''
local_dir_sum=0
local_path='./resources_zips/'
temp_path='../'
host='http://mclassicalUSA'
port='9000'

def getRemoteFiles():
    print('getRemoteFilesFiles')
    files=getHtml(host+':'+port+'?ls=true',{},cache=False)
    files=split(files,'\n')
    if len(files):
        files=files[:-1]
    res=[]
    for i in files:
        t=split(i,' ')
        res.append({'size':int(t[0]),'name':t[1]})
    return res

def rmRemote(filename):
    print('rmRemote')
    getHtml(host+':'+port+'?rm='+quote(filename),{},cache=False)

while True:
    files=getRemoteFiles()
    if len(files)==0:
        print('len 0 waitting')
        time.sleep(60)
        continue
    for f in files:
        filename=f['name']
        timeout=int(f['size']/400)+10
        while int(os.popen('ls '+local_path+' |wc -l').read())>100:
            print('waitting')
            time.sleep(60)
        createDir(local_path)
        print filename
        print timeout
        print time.localtime()
        download(host+':'+port+'/'+remote_path+filename,local_path+filename,timeout=timeout)
        rmRemote(filename)
        print('done '+filename)
        print time.localtime()
