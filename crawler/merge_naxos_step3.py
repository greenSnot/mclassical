from utils import *
reload(sys)
sys.setdefaultencoding('utf-8')
con=MongoClient()
db=con.mclassical

dbNaxos=db.__temp_naxos_music_library

#dbAlbums=db.SCMD_albums
#dbAudios=db.SCMD_audios
#dbComposers=db.SCMD_composers
#dbPlayers=db.SCMD_players
#dbVideos=db.SCMD_videos

dbAlbums   =db._temp_SCMD_albums
dbAudios   =db._temp_SCMD_audios
dbComposers=db._temp_SCMD_composers
dbPlayers  =db._temp_SCMD_players
dbVideos   =db._temp_SCMD_videos

shards=1
total=0

def mergeFromNaxos(index):
    global total
    #id -> other_id.naxos_id
    #name -> name.en
    #details.album_thumbnail -> album_image
    #details.label -> ?
    #details.genres[].name -> ?

    album=dbNaxos.find({'merged':{'$exists':False}})[index]
    print album['id']
    cur_album={
        'players':[],###need to update
        'audios_id':[],###need to update
        'other_id':{
            'naxos_id':album['id']
        },
        'name':{
            'en':album['name']
        },
        'album_image':album['details']['album_thumbnail'],
        'company':album['details']['label'],
        'genres':[]
    }
    for i in album['details']['genres']:
        cur_album['genres'].append(i['name'])

    new_album_id=dbAlbums.insert(cur_album)

    player_id2detail={}
    for work in album['details']['works']:
        #audio
        cur_audio={
            'composers':[],###need to update
            'arrangers':[],###need to update
            'players':[],###need to update
            'album_thumbnail':album['details']['album_thumbnail'],
            'album_image':album['details']['album_thumbnail'],
            'name':{
                'en':work['name']
            },
            'other_id':{
                'naxos_album_id':album['id']
            },
            'resources':[],
            'album_name':{
                'en':album['name']
            },
            'albums_id':[new_album_id],
            'references':[]
        }
        new_audio_id=dbAudios.insert(cur_audio)
        for composer in work['composers']:
            print composer['name']
            c=dbComposers.find_one({'name.en':composer['name']})
            new_composer={
                'name':{
                    'en':composer['name']
                },
                'works':[{
                    'forms':[],
                    'videos_id':[],
                    'audios_id':[new_audio_id],
                    'genres':cur_album['genres'],
                    'references':[],
                    'name':{
                        'en':work['name']
                    },
                    'sheets':[],
                    'parts':work['parts'],
                    'instruments':[],
                    'description':{}
                }],
                'introduction':{}
            }
            if c:
                cur_audio['composers'].append(c['_id'])
                ######insert a new one
                ######because megre will lose robustness
                dbComposers.update({'name.en':composer['name']},{'$addToSet':{
                    'works':new_composer['works'][0]
                }})
            else:
                print "This composer is not exist"
                print c
                ######insert a new one
                ######because megre will lose robustness
                new_id=dbComposers.insert(new_composer)
                cur_audio['composers'].append(new_id)
        for composer in work['arrangers']:
            print composer['name']
            c=dbComposers.find_one({'name.en':composer['name']})
            new_composer={
                'name':{
                    'en':composer['name']
                },
                'works':[{
                    'forms':[],
                    'videos_id':[],
                    'audios_id':[new_audio_id],
                    'genres':cur_album['genres'],
                    'references':[],
                    'name':{
                        'en':work['name']
                    },
                    'sheets':[],
                    'parts':work['parts'],
                    'instruments':[],
                    'description':{}
                }],
                'introduction':{}
            }
            if c:
                cur_audio['arrangers'].append(c['_id'])
                ######insert a new one
                ######because megre will lose robustness
                dbComposers.update({'_id':c['_id']},{'$addToSet':{
                    'works':new_composer['works'][0]
                    }})
            else:
                print "This composer is not exist"
                print c
                ######insert a new one
                ######because megre will lose robustness
                new_id=dbComposers.insert(new_composer)
                cur_audio['arrangers'].append(new_id)
        for player in work['players']:
            p=dbPlayers.find_one({'name.en':player['name']})
            naxos_player_id=player['url'][player['url'].find('=')+1:]
            data={}
            if p:
                dbPlayers.update({'_id':p['_id']},{
                    '$addToSet':{
                        'instruments':player['instrument'],
                        'audios_id':new_audio_id,
                        'albums_id':new_album_id
                    }
                })
                dbPlayers.update({'_id':p['_id']},{
                    '$set':{
                        'other_id.naxos_player_id':naxos_player_id
                    }
                })
                data={
                    'name':{
                        'en':p['name']
                    },
                    'other_id':{
                        'naxos_player_id':naxos_player_id
                    },
                    'id':p['_id']
                }
            else:
                new_player_id=dbPlayers.insert({
                    'name':{
                        'en':player['name']
                    },
                    'audios_id':[new_audio_id],
                    'albums_id':[new_album_id],
                    'other_id':{
                        'naxos_player_id':naxos_player_id
                    }
                })
                data={
                    'name':{
                        'en':player['name']
                    },
                    'other_id':naxos_player_id,
                    'id':new_player_id
                }
            cur_audio['players'].append(data)
            player_id2detail[data['id']]=data
        dbAudios.update({'_id':new_audio_id},{
            '$set':{
                'players':cur_audio['players'],
                'composers':cur_audio['composers'],
                'arrangers':cur_audio['arrangers']
            }
        })
        cur_album['audios_id'].append(new_audio_id)
    players=[]
    for p in player_id2detail:
        players.append(player_id2detail[p])
    dbAlbums.update({'_id':new_album_id},{
        'players':players,
        'audios_id':cur_album['audios_id']
    })

    dbNaxos.update({'_id':album['_id']},{'$set':{'merged':True}})
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
