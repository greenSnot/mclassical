#########################
# NOTICE:
# 1) "works.name" in composers may be duplicated (cause different instrument ,different form ...)
# 2) "works" in composers may be empty
# 3) "parts" , "pdf" in composers.works and composers.works.parts may be empty
# 4) "url" in databases is helpless just for debugging
#########################

import sys
import socket
socket.setdefaulttimeout( 30 ) 
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
db=con.mclassical

#find works,introduction and work details of each composer by composers.works_url
dbComposers=db.composers_test;
composers_len=int(db.composers_test.count())
#len=4315

#get all composers name and its works_url
###########################
def getAllComposers():
    if composers_len>0:
        print 'Collection composers have been built'
        return
    url='https://musopen.org/sheetmusic/'
    soup = bs(getHtml(url,cache=False))
    composers=[]
    for i in range(65+32,32+65+26,1):
        source=soup.select('div [id="'+chr(i)+'-composer"] a')
        for j in range(0,len(source),1):
            url=source[j].attrs['href']
            name=html2text(source[j].attrs['title'])
            composers.append({"name":name,"url":url})
    for i in range(0,len(composers),1) :
        dbComposers.save(composers[i]);
    print 'composers Builded'
############################

###following index is failed to fetch (404 ERROR)
#1637
#1790
#######################################
def getWorks(startIndex,endIndex):
    for cursor in range(startIndex,endIndex,1):
        #if cursor==1637 or cursor==1790:
        #    continue
        composer=dbComposers.find().sort('name')[cursor]
        print 'index:'+str(cursor)+'/'+str(composers_len)
        print(composer['name']+'=================')
        cur_page=1
        pages=1
        while cur_page<=pages:
            soup=bs(getHtml('https://musopen.org'+composer['url']+'?page='+str(cur_page)))
            composer_name=composer['name']
            introduction=soup.select('.description p')
            if len(introduction)>0:
                introduction=html2text(introduction[0].contents[0])
            else:
                introduction='N/A'
            dbComposers.update(
                {
                    'name':composer_name
                },{
                    '$set':{
                        'works':[],
                        'introduction':introduction
                    }
                }
            );
        
            th_names=soup.select('.table-striped th a')
            for x in range(0,len(th_names),1):
                th_names[x]=th_names[x].contents[0];
            trs=soup.select('.table-striped tbody tr');
            for j in range(0,len(trs),1):
                work_name=html2text(str(trs[j].select('a')[0].contents[0]).strip())
                work_url=trs[j].select('a')[0].attrs["href"]

                row=trs[j].select('td');
                work_form='N/A';
                work_period='N/A';
                work_instrument='N/A';
                for iter in range (1,len(th_names),1):
                    if len(row[iter].contents)>0:
                        tname=html2text(th_names[iter].strip())
                        content=html2text(row[iter].contents[0].strip())
                        if tname=="Form":
                            work_form=content
                        elif tname=="Instrument":
                            work_instrument=content
                        elif tname=="Period":
                            work_period=content
        
                dbComposers.update(
                    {
                        'name':composer_name
                    },{
                        '$addToSet':{
                            'works':{
                                '$each':[{
                                    'name':work_name,
                                    'sheet_url':work_url,
                                    'form':work_form,
                                    'period':work_period,
                                    'instrument':work_instrument
                                }]
                            }
                        }
                    }
                );
                #print work_name
                #print '-FORM:'+work_form
                #print '-PERIOD:'+work_period
                #print '-INSTRUMENT:'+work_instrument
                #print work_url
                #print work_instrument
            pages=soup.select('.pagination-centered .page');
            if len(pages)>0:
                pages=int(pages[-1].contents[0])
            else :
                pages=1
        
            print str(cur_page)+'/'+str(pages)
            cur_page=cur_page+1
########################

#########################

def getWorksDetails(startIndex,endIndex):
    works=dbComposers.find({},{'name':1,'works':1}).sort('name')
    for cursor in range(startIndex,endIndex,1):
        cur_works=works[cursor]
        composer_name=cur_works['name']
        print 'details:'+str(cursor)+'/'+str(composers_len)
        if not ('works' in cur_works.keys()):
            print 'no works'
            continue
        cur_works=cur_works['works']
        for j in range(0,len(cur_works),1):
            work_name=cur_works[j]['name']
            work_url=cur_works[j]['sheet_url']
            url_prefix='https://musopen.org'
            print str(cursor)+'/'+str(composers_len)+' '+str(j)
    
            soup=bs(getHtml(url_prefix+work_url))
            trs=soup.select('.table.music tbody tr')
            for k in range(0,len(trs),1):
                title=html2text(str(trs[k].select('.title')[0].contents[0]).strip())
                downloads=trs[k].select('.download-music')
                pdf=''
                if len(downloads)>0 :
                    pdf=trs[k].select('.download-music')[0].attrs['href']
                else:
                    print "DOWNLOAD-DISABLED#######################"
                    continue
                dbComposers.update({
                    'name':composer_name,
                    'works.sheet_url':work_url
                },{
                    '$addToSet':{
                        'works.'+str(j)+'.resources':{
                            'name':title,
                            'type':'pdf',
                            'url':pdf
                        }
                    }
                })
    
#96488
#######################

def worker(pid,startIndex,endIndex):
    getWorks(startIndex,endIndex)
    getWorksDetails(startIndex,endIndex)

if __name__ == "__main__":

    getAllComposers()
    shards=16
    db_len=composers_len
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*db_len),int(float(i+1)/float(shards)*db_len)))
        p.start()

sys.exit(0)
