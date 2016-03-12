#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='/data/mclassical/crawler/naxos_music_library/resources_zips/'
local_dir_sum=0
local_path='./resources_zips'+str(local_dir_sum)+'/'
temp_path='../'
host='root@mclassicalSGP'

def getRemoteFilesSum(seconds):
    print('getRemoteFilesSum')
    cmd='ssh '+host+' "ls -l '+path+' |grep \'^-\'|wc -l"'
    return int(sub(cmd,seconds))

def getRemoteFiles(seconds):
    print('getRemoteFilesFiles')
    cmd='ssh '+host+' "ls '+path+'"'
    return split(sub(cmd,seconds),'\n')[:-1]

def getRemoteMd5(filename,seconds):
    print('getRemoteMd5')
    cmd='ssh '+host+' "md5sum '+path+filename+'"'
    return split(sub(cmd,seconds),' ')[0]

def scpRemote(filename,seconds):
    print('scpRemote')
    cmd='scp '+host+':'+path+filename+' '+temp_path
    return sub(cmd,seconds)

def rmRemote(filename,seconds):
    print('rmRemote')
    cmd='ssh '+host+' "rm '+path+filename+'"'
    return sub(cmd,seconds)

while True:
    files_sum=setTimeoutRepeat(getRemoteFilesSum,seconds=5)
    if files_sum>0:
        print(files_sum)
        files=setTimeoutRepeat(getRemoteFiles,seconds=5)
        print(files)
        for filename in files:
            while int(os.popen('ls '+local_path+' |wc -l').read())>100:
                print('waitting')
                time.sleep(60)
            md5=setTimeoutRepeat(getRemoteMd5,filename=filename,seconds=10)
            createDir(local_path)

            fetch=False
            while not fetch:
                print('downloading '+filename)
                setTimeoutRepeat(scpRemote,filename=filename,seconds=320)
                if md5==split(os.popen('md5sum '+temp_path+filename).read(),' ')[0]:
                    os.popen('mv '+temp_path+filename+' '+local_path)
                    setTimeoutRepeat(rmRemote,filename=filename,seconds=10)
                    fetch=True
                    print('done '+filename)
                else:
                    print('error')
                    os.popen('rm '+temp_path+filename)
                    print('md5 error retrying')
                if int(os.popen('ls '+local_path+' |wc -l').read())>500:
                    local_dir_sum=local_dir_sum+1
                    local_path='./resources_zips'+str(local_dir_sum)+'/'
    time.sleep(60)
