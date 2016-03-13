#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *
from urllib import unquote
import re
from urllib import quote

remote_path='resources_zips/'
local_dir_sum=0
local_path='./resources_zips'+str(local_dir_sum)+'/'
temp_path='../'
host='http://mclassicalSGP'
port='9000'


def getRemoteFiles():
    print('getRemoteFilesFiles')
    files=getHtml(host+':'+port+'?ls=true',{},cache=False)
    files=split(files,'\n')[1:-2]
    res=[]
    for i in files:
        t=split(i,' ')
        if len(t)==3:
            res.append({'size':int(t[1])/2,'name':t[2]})
        else:
            res.append({'size':int(t[0])/2,'name':t[1]})
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
        timeout=int(f['size']/200)+10
        filename=f['name']
        while int(os.popen('ls '+local_path+' |wc -l').read())>100:
            print('waitting')
            time.sleep(60)
        createDir(local_path)
        print filename
        print timeout
        download(host+':'+port+'/'+remote_path+filename,local_path+filename,timeout=timeout)
        rmRemote(filename)
        print('done '+filename)
        if int(os.popen('ls '+local_path+' |wc -l').read())>500:
            local_dir_sum=local_dir_sum+1
            local_path='./resources_zips'+str(local_dir_sum)+'/'
