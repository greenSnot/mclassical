#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='mclassical/crawler/naxos_music_library/resources/'
local_path='~/Downloads/'
while True:
    files_sum=int(os.popen('ssh root@mclassicalUSA "ls -l '+path+' |grep \'^-\'|wc -l"').read())
    if files_sum>0:
        files=split(os.popen('ssh root@mclassicalUSA "ls '+path+'"').read().strip(),'\n')
        print files
        for filename in files:
            md5=split(os.popen('ssh root@mclassicalUSA "md5sum '+path+filename+'"').read(),' ')[0]
            fetch=False
            while not fetch:
                os.popen('scp root@mclassicalUSA:'+path+filename+' '+local_path)
                if md5==split(os.popen('md5sum '+local_path+filename).read(),' ')[0]:
                    os.popen('ssh root@mclassicalUSA "rm '+path+filename+'"')
                    fetch=True
                    print 'done '+filename
                else:
                    print 'md5 error retrying'
    time.sleep(600)
