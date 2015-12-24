from utils import *
reload(sys)
sys.setdefaultencoding('utf-8')
con=MongoClient()
db=con.mclassical

dbQQMusic=db.qqmusic_v2
dbAlbums=db.SCMD_albums
dbAudios=db.SCMD_audios
dbComposers=db.SCMD_composers
dbPlayers=db.SCMD_players
dbVideos=db.SCMD_videos

def init():
    total=dbQQMusic.find({}).count()
    albums=dbQQMusic.find({})
    for i in range(0,total):
        a=albums[i]
        audios=a['details']
        albumid=str(a['id'])
        mid=a['mid']

        album={
            'name':{},
            'publication_time':a['pub_time'],
            'album_thumbnail':'http://i.gtimg.cn/music/photo/mid_album_90/'+mid[-2]+'/'+mid[-1]+'/'+mid+'.jpg',
            'album_image':'http://i.gtimg.cn/music/photo/mid_album_300/'+mid[-2]+'/'+mid[-1]+'/'+mid+'.jpg',
            'source':[{
                'name':'QQMusic',
                'url':'http://y.qq.com/#type=album&mid='+mid
            }],
            'players':[],
            'audios_id':[],
            'other_id':{
                'qqmusic_album_id':albumid,
                'qqmusic_album_mid':mid
            }
        }
        if hasChinese(a['name']):
            album['name']['cn']=a['name']
        else:
            album['name']['en']=a['name']

        audiosId={}
        allPlayers=[]
        hasAddedPlayer={}
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
                'source':[{
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
            audioPlayersId={}
            for k in j['singer']:
                audioPlayersId[k['id']]=True
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
                audio['players'].append(curPlayer)
                dbPlayers.update({'other_id.qqmusic_player_id':k['id']},{'$setOnInsert':curPlayer},True)
            playerIds=dbPlayers.find({'other_id.qqmusic_player_id':{'$in':audioPlayersId.keys()}},{'_id':True,'other_id.qqmusic_player_id':True})
            for s in range(0,playerIds.count()):
                k=playerIds[s]
                audioPlayersId[k['other_id']['qqmusic_player_id']]=k['_id']
            for k in audio['players']:
                k['id']=audioPlayersId[k['other_id']['qqmusic_player_id']]
                if not k['other_id']['qqmusic_player_id'] in hasAddedPlayer.keys():
                    hasAddedPlayer[k['other_id']['qqmusic_player_id']]=True
                    allPlayers.append(k)
            dbAudios.update({'other_id.qqmusic_song_id':id},{'$setOnInsert':audio},True)
        audiosId=dbAudios.find({'other_id.qqmusic_album_id':albumid},{'_id':True})
        for j in range(0,audiosId.count()):
            k=audiosId[j]
            album['audios_id'].append(k['_id'])
        album['players']=allPlayers
        dbAlbums.update({'other_id.qqmusic_album_id':albumid},{'$setOnInsert':album},True)
        for j in allPlayers:
            dbPlayers.update({'_id':j['id']},{
                '$addToSet':{
                    'albums_id':albumid,
                    'audios_id':{
                        '$each':album['audios_id']
                    }
                }
            })
        print 'update Albums '+albumid
init()
