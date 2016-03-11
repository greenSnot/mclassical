#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='mclassical/crawler/naxos_music_library/resources_zips/'
local_path='./resources_zips/'
temp_path='~/'
if __name__=='__main__':
    @timeout(20)
    def getRemoteFilesSum():
        print 'getRemoteFilesSum'
        res=int(os.popen('ssh root@mclassicalUSA "ls -l '+path+' |grep \'^-\'|wc -l"').read())
        print res
        return res
    @timeout(20)
    def getRemoteFiles():
        print 'getRemoteFilesFiles'
        return split(os.popen('ssh root@mclassicalUSA "ls '+path+'"').read().strip(),'\n')
    @timeout(20)
    def getRemoteMd5(filename):
        print 'getRemoteMd5'
        return split(os.popen('ssh root@mclassicalUSA "md5sum '+path+filename+'"').read(),' ')[0]
    @timeout(200)
    def scpRemote(filename):
        print 'scpRemote'
        print os.popen('scp root@mclassicalUSA:'+path+filename+' '+temp_path)
    @timeout(20)
    def rmRemote(filename):
        print 'rmRemote'
        print os.popen('ssh root@mclassicalUSA "rm '+path+filename+'"')
    def setTimeoutRepeat(fun,**kwargs):
        fetch=False
        while not fetch:
            try:
                res=fun(**kwargs)
                fetch=True
            except Exception:
                print 'TIMEOUT ERROR'
        return res


    while True:
        files_sum=setTimeoutRepeat(getRemoteFilesSum)
        if files_sum>0:
            files=setTimeoutRepeat(getRemoteFiles)
            print files
            for filename in files:
                while int(os.popen('ls '+local_path+' |wc -l').read())>100:
                    print 'waitting'
                    time.sleep(600)
                md5=setTimeoutRepeat(getRemoteMd5,filename=filename)

                fetch=False
                while not fetch:
                    print('downloading '+filename)
                    setTimeoutRepeat(scpRemote,filename=filename)
                    if md5==split(os.popen('md5sum '+temp_path+filename).read(),' ')[0]:
                        setTimeoutRepeat(rmRemote,filename=filename)
                        os.popen('mv '+temp_path+filename+' '+local_path)
                        fetch=True
                        print 'done '+filename
                    else:
                        print('error')
                        os.popen('rm '+temp_path+filename)
                        print 'md5 error retrying'
        time.sleep(600)
