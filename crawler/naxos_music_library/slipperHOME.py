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
    print files
    files=split(files,'\n')[:-1]
    return files

def rmRemote(filename):
    print('rmRemote')
    getHtml(host+':'+port+'?rm='+quote(filename),{},cache=False)

while True:
    files=getRemoteFiles()
    print(files)
    if len(files)==0:
        print('len 0 waitting')
        time.sleep(60)
        continue
    for filename in files:
        while int(os.popen('ls '+local_path+' |wc -l').read())>100:
            print('waitting')
            time.sleep(60)
        createDir(local_path)
        print quote(filename)
        download(host+':'+port+'/'+remote_path+filename,local_path+filename,timeout=400)
        rmRemote(filename)
        print('done '+filename)
        if int(os.popen('ls '+local_path+' |wc -l').read())>500:
            local_dir_sum=local_dir_sum+1
            local_path='./resources_zips'+str(local_dir_sum)+'/'
