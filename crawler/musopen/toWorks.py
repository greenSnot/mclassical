import sys
import socket
socket.setdefaulttimeout( 30 ) 
sys.path.append('..')
from utils import *

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
con.mclassical.authenticate('r','r')
db=con.mclassical

dbComposers=db.musopen_composers;
dbWorks=db.SCMD_works;
composers_len=int(db.musopen_composers.count())
for i in range(0,composers_len):
    composer=dbComposers.find({})[i]
    for work in composer['works']:
        work['composer_id']=composer['_id']
        work['composer_name']=composer['name']
        work['references']=[
                {
                    'name':'Musopen',
                    'url':'https://musopen.org'+work['sheet_url']
                    }
        ]
        dbWorks.insert(work)
