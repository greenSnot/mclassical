#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='mclassical/crawler/naxos_music_library/resources_zips/'
local_path='./resources_zips/'
temp_path='~/'
if __name__=='__main__':
    def getRemoteFilesSum():
        return int(os.popen('ssh root@mclassicalUSA "ls -l '+path+' |grep \'^-\'|wc -l"').read())
    def getRemoteFiles():
        return split(os.popen('ssh root@mclassicalUSA "ls '+path+'"').read().strip(),'\n')
    def getRemoteMd5(filename):
        return split(os.popen('ssh root@mclassicalUSA "md5sum '+path+filename+'"').read(),' ')[0]
    def scpRemote(filename):
        os.popen('scp root@mclassicalUSA:'+path+filename+' '+temp_path)
        return True
    def rmRemote(filename):
        os.popen('ssh root@mclassicalUSA "rm '+path+filename+'"')
        return True


    while True:
        files_sum=setTimeoutRepeat(getRemoteFilesSum,20)
        if files_sum>0:
            files=setTimeoutRepeat(getRemoteFiles,20)
            print files
            for filename in files:
                while int(os.popen('ls '+local_path+' |wc -l').read())>100:
                    print 'waitting'
                    time.sleep(600)
                md5=setTimeoutRepeat(getRemoteMd5,20,filename=filename)

                fetch=False
                while not fetch:
                    print('downloading '+filename)
                    setTimeoutRepeat(scpRemote,200,filename=filename)
                    if md5==split(os.popen('md5sum '+temp_path+filename).read(),' ')[0]:
                        os.popen('ssh root@mclassicalUSA "rm '+path+filename+'"')
                        #setTimeoutRepeat(rmRemote,20,filename=filename)
                        fetch=True
                        print 'done '+filename
                    else:
                        print('error')
                        os.popen('rm '+temp_path+filename)
                        print 'md5 error retrying'
        time.sleep(600)
