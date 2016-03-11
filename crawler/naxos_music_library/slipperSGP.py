#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='mclassical/crawler/naxos_music_library/resources_zips/'
local_path='./resources_zips/'
temp_path='~/'
if __name__=='__main__':
    def handler(signum,frame):
        raise AssertionError
    while True:
        files_sum=int(os.popen('ssh root@mclassicalUSA "ls -l '+path+' |grep \'^-\'|wc -l"').read())
        if files_sum>0:
            files=split(os.popen('ssh root@mclassicalUSA "ls '+path+'"').read().strip(),'\n')
            print files
            for filename in files:
                while int(os.popen('ls '+local_path+' |wc -l').read())>100:
                    print 'waitting'
                    time.sleep(600)
                md5=False
                while not md5:
                    try:
                        signal.signal(signal.SIGALRM,handler)
                        signal.alarm(20)
                        md5=split(os.popen('ssh root@mclassicalUSA "md5sum '+path+filename+'"').read(),' ')[0]
                        signal.alarm(0)
                    except AssertionError:
                        print 'md5sum time out'
                        continue
                fetch=False
                while not fetch:
                    print('downloading '+filename)
                    try:
                        signal.signal(signal.SIGALRM,handler)
                        signal.alarm(600)
                        os.popen('scp root@mclassicalUSA:'+path+filename+' '+temp_path)
                        signal.alarm(0)
                    except AssertionError:
                        print 'scp time out'
                        continue
                    if md5==split(os.popen('md5sum '+temp_path+filename).read(),' ')[0]:
                        os.popen('ssh root@mclassicalUSA "rm '+path+filename+'"')
                        os.popen('mv '+temp_path+filename+' '+local_path)
                        fetch=True
                        print 'done '+filename
                    else:
                        print('error')
                        os.popen('rm '+temp_path+filename)
                        print 'md5 error retrying'
        time.sleep(600)
