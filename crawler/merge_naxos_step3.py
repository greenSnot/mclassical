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

def mergeFromNaxos(index):
    global total
    #id -> other.naxos_id
    #name -> name.en
    #details.album_thumbnail -> album_image
    #details.label -> ?
    #details.genres[].name -> ?

    album=dbNaxos.find({'merged':{'$exists':False}})[index]
    for work in album['details']['works']:
        #audio
        cur_audio={
            'composers':[],
            'arrangers':[],
            'players':[],
            'album_thumbnail':album['details']['album_thumbnail'],
            'album_image':album['details']['album_thumbnail'],
            'name':{
            },
            'other_id':{
                'naxos_album_id':album['id']
            },
            'resources':[],
            'album_name':{
                'en':album['name']
            },
            'albums_id':[],
            'references':[]
        }


    dbNaxos.update({'_id':composer['_id']},{'$set':{'merged':True}})
    print 'update Naxos '+str(index)+'/'+str(total)

def worker(pid,startIndex,endIndex):
    global total
    total=dbNaxos.find({'merged':{'$exists':False}}).count()
    while total:
        mergeFromNaxos(int(float(pid)/float(shards)*total))
        total=total-1

if __name__ == "__main__":
    total=dbNaxos.find({'merged':{'$exists':False}}).count()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
