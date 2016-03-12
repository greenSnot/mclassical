#-*-coding:utf-8-*-
import sys
sys.path.append('..')
from utils import *

path='/data/mclassical/crawler/naxos_music_library/resources_zips/'
local_dir_sum=0
local_path='./slipper'+str(local_dir_sum)+'/'
while True:
    files_sum=int(os.popen('ssh root@mclassicalSGP "ls -l '+path+' |grep \'^-\'|wc -l"').read())
    if files_sum>0:
        files=split(os.popen('ssh root@mclassicalSGP "ls '+path+'"').read().strip(),'\n')
        print files
        for filename in files:
            md5=split(os.popen('ssh root@mclassicalSGP "md5sum '+path+filename+'"').read(),' ')[0]
            createDir(local_path)
            fetch=False
            while not fetch:
                os.popen('scp root@mclassicalSGP:'+path+filename+' '+local_path)
                if md5==split(os.popen('md5sum '+local_path+filename).read(),' ')[0]:
                    os.popen('ssh root@mclassicalSGP "rm '+path+filename+'"')
                    fetch=True
                    print 'done '+filename
                else:
                    os.popen('rm '+local_path+filename)
                    print 'md5 error retrying'
                if int(os.popen('ls '+local_path+' |wc -l').read())>500:
                    local_dir_sum=local_dir_sum+1
                    local_path='./slipper'+str(local_dir_sum)+'/'
    time.sleep(600)
