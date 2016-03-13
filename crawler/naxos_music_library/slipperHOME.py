#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='/data/mclassical/crawler/naxos_music_library/resources_zips/'
local_dir_sum=0
local_path='./resources_zips'+str(local_dir_sum)+'/'
temp_path='../'
host='mclassicalSGP'
port=9000

def getRemoteFiles():
    print('getRemoteFilesFiles')
    files=split(getHTML(host+':'+port+'?ls=true',{},catche=False),'\n')
    return files

def rmRemote(filename):
    print('rmRemote')
    getHTML(host+':'+port+'?rm='+filename)

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
        download(host+':'+port+'/'+filename,local_path+filename,timeout=400)
        rmRemote(filename)
        print('done '+filename)
        if int(os.popen('ls '+local_path+' |wc -l').read())>500:
            local_dir_sum=local_dir_sum+1
            local_path='./resources_zips'+str(local_dir_sum)+'/'
