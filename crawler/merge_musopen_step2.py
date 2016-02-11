from utils import *
reload(sys)
sys.setdefaultencoding('utf-8')
con=MongoClient()
db=con.mclassical

dbQQMusic=db.qqmusic_albums
dbNaxos=db.naxos_music_library
dbMusopen=db.musopen_composers

dbAlbums=db.SCMD_albums
dbAudios=db.SCMD_audios
dbComposers=db.SCMD_composers
dbPlayers=db.SCMD_players
dbVideos=db.SCMD_videos

shards=1
total=0

def mergeFromMusopen(index):
    global total
    composers=dbMusopen.find({'inited':{'$exists':False}})
    composer=composers[index]
    cur_composer={
            'name':{
                'en':composer['name']
            },
            'introduction':{
                'en':composer['introduction']
            },
            'works':[]
    }
    if composer['introduction']=='N/A' :
        cur_composer['introduction']['en']=''
    works=composer['works']
    for work in works:
        cur_work={
            'name':{
                'en':work['name']
            },
            'forms':[work['form']],
            'genres':[],
            'description':{},
            'instruments':[work['instrument']],
            'references':[{
                'name':'Musopen',
                'url':'https://musopen.org'+work['sheet_url']
            }],
            'sheets':[],
            'audios_id':[],
            'videos_id':[]
        }
        if 'resources' in work.keys():
            for j in range(0,len(work['resources'])):
                cur_sheet={
                    'name':{
                        'en':work['resources'][j]['name']
                    },
                    'instruments':[work['instrument']],
                    'resources':[{
                        'url':work['resources'][j]['url']
                    }]
                }
                cur_work['sheets'].append(cur_sheet)
        cur_composer['works'].append(cur_work)
    dbComposers.insert(cur_composer)
    dbMusopen.update({'_id':composer['_id']},{'$set':{'inited':True}})
    print 'update Composers '+str(index)+'/'+str(total)

def worker(pid,startIndex,endIndex):
    global total
    total=dbMusopen.find({'inited':{'$exists':False}}).count()
    while total:
        mergeFromMusopen(int(float(pid)/float(shards)*total))
        total=total-1

if __name__ == "__main__":
    total=dbMusopen.find({'inited':{'$exists':False}}).count()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
