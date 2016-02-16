import qiniu
import os
import sys
import time
from time import sleep

q = qiniu.Auth('Ydyi73qwtgToPkCNkmBQzDIWtK1xzW_YN37Xy7TE','SQkOJg-B4JHaETjF5yJCqntsStMfdqi6hrCQCHq6')

def exist(filename):
    return os.path.isfile(filename)
def remove(filename):
    if exist(filename):
        os.remove(filename)

def upload_audios():
    filesdir='../qqmusic/m4a';
    files=os.listdir(filesdir)
    for fname in files:
        if fname.find('downloading_')==0:
            continue
        filename=filesdir+'/'+fname
        print filename
        data=open(filename).read()
        key='qqmusic/'+fname
        token = q.upload_token('audios')
        ret, info = qiniu.put_data(token, key, data)
        if ret is not None:
            print 'success '+fname
            remove(filename)
        else:
            print(info) # error message in info

while True:
    upload_audios()
    print 'finish and watting 10s'
    time.sleep(10)
