##################################
#           CLEAR RUBBISH
#db.qqmusic_albums.update({'inited':true},{'$unset':{'inited':{'$exists':true}}},false,true)
#dbQQMusic.update({},{'$unset':{'inited':{'$exists':True}}},False,True)
##################################

from utils import *
reload(sys)
sys.setdefaultencoding('utf-8')
con=MongoClient()
db=con.mclassical

dbQQMusic=db.qqmusic_albums
dbNaxos=db.naxos_music_library

dbAlbums=db.SCMD_albums
dbAudios=db.SCMD_audios
dbComposers=db.SCMD_composers
dbPlayers=db.SCMD_players
dbVideos=db.SCMD_videos

shards=1
total=0

def mergeFromQQMusic(index):
    global total
    albums=dbQQMusic.find({'inited':{'$exists':False}})
    curAlbum=albums[index]
    audios=curAlbum['details']
    curAlbumId=str(curAlbum['id'])
    curAlbumMid=curAlbum['mid']

    album={
        'name':{},
        'publication_time':curAlbum['pub_time'],
        'album_thumbnail':'http://i.gtimg.cn/music/photo/mid_album_90/'+curAlbumMid[-2]+'/'+curAlbumMid[-1]+'/'+curAlbumMid+'.jpg',
        'album_image':'http://i.gtimg.cn/music/photo/mid_album_300/'+curAlbumMid[-2]+'/'+curAlbumMid[-1]+'/'+curAlbumMid+'.jpg',
        'references':[{
            'name':'QQMusic',
            'url':'http://y.qq.com/#type=album&mid='+curAlbumMid
        }],
        'players':[],
        'audios_id':[],
        'other_id':{
            'qqmusic_album_id':curAlbumId,
            'qqmusic_album_mid':curAlbumMid
        }
    }
    if hasChinese(curAlbum['name']):
        album['name']['cn']=curAlbum['name']
    else:
        album['name']['en']=curAlbum['name']

    audiosId={}
    audioPlayersMap={}
    time.clock()
    for j in audios:
        id=str(j['songid'])
        mid=j['songmid']
        audiosId[id]=True
        audio={
            'players':[],
            'album_name':album['name'],
            'album_image':album['album_image'],
            'album_thumbnail':album['album_thumbnail'],
            'name':{},
            'other_id':{
                'qqmusic_song_id':id,
                'qqmusic_album_id':album['other_id']['qqmusic_album_id'],
                'qqmusic_song_mid':mid,
                'qqmusic_album_mid':album['other_id']['qqmusic_album_mid']
            },
            'references':[{
                'name':'QQMusic',
                'url':'http://y.qq.com/#type=song&mid='+mid
            }],
            'resource':[{
                'quality':'low',
                'type':'m4a',
                'url':'http://ws.stream.qqmusic.qq.com/'+id+'.m4a?fromtag=46'
            }]
        }
        if hasChinese(j['songname']):
            audio['name']['cn']=j['songname']
        else:
            audio['name']['en']=j['songname']
        for k in j['singer']:
            curPlayer={
                'other_id':{
                    'qqmusic_player_id':k['id'],
                    'qqmusic_player_mid':k['mid']
                },
                'name':{}
            }
            if hasChinese(k['name']):
                curPlayer['name']['cn']=k['name']
            else:
                curPlayer['name']['en']=k['name']
            #####
            up=dbPlayers.update({'other_id.qqmusic_player_id':k['id']},{'$setOnInsert':curPlayer},True)
            if up['updatedExisting']==False:
                curPlayer['id']=up['upserted']
            else:
                curPlayer['id']=dbPlayers.find_one({'other_id.qqmusic_player_id':k['id']})['_id'];
            #curPlayer['id']=dbPlayers.insert(curPlayer)
            #######no safe#######################

            audio['players'].append(curPlayer)
            if not (curPlayer['id'] in audioPlayersMap.keys()):
                audioPlayersMap[curPlayer['id']]=curPlayer

        #up=dbAudios.update({'other_id.qqmusic_song_id':id},{'$setOnInsert':audio},True)
        #if up['updatedExisting']==False:
        #    audio['id']=up['upserted']
        #else:
        #    audio['id']=dbAudios.find_one({'other_id.qqmusic_song_id':id})['_id']
        audio['id']=dbAudios.insert(audio)
        #######no safe#######################

        album['audios_id'].append(audio['id'])

    for k in audioPlayersMap:
        album['players'].append(audioPlayersMap[k])
    #up=dbAlbums.update({'other_id.qqmusic_album_id':curAlbumId},{'$setOnInsert':album},True)
    #if up['updatedExisting']==False:
    #    album['id']=up['upserted']
    #else:
    #    album['id']=dbAlbum.find_one({'other_id.qqmusic_album_id':curAlbumId})['_id']
    album['id']=dbAlbums.insert(album);
    ##########no safe#####################
    for j in album['players']:
        dbPlayers.update({'_id':j['id']},{
            '$addToSet':{
                'albums_id':album['id'],
                'audios_id':{
                    '$each':album['audios_id']
                }
            }
        })
    for j in album['audios_id']:
        dbAudios.update({'_id':j},{
            '$addToSet':{
                'albums_id':album['id']
            }
        })
    dbQQMusic.update({'mid':curAlbumMid},{'$set':{'inited':True}})
    print 'update Albums '+curAlbumId+' '+str(index)+'/'+str(total)

def worker(pid,startIndex,endIndex):
    global total
    total=dbQQMusic.find({'inited':{'$exists':False}}).count()
    while total:
        mergeFromQQMusic(int(float(pid)/float(shards)*total))
        total=total-1

if __name__ == "__main__":
    total=dbQQMusic.find({'inited':{'$exists':False}}).count()
    for i in range(0,shards):
        p=multiprocessing.Process(target = worker, args = (i,int(float(i)/float(shards)*total),int(float(i+1)/float(shards)*total)))
        p.start()
