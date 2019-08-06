import sys
import socket
socket.setdefaulttimeout( 30 ) 
from pymongo import MongoClient

reload(sys)
sys.setdefaultencoding('utf-8')

con=MongoClient()
#con.mclassical.authenticate('r','r',mechanism='SCRAM-SHA-1')
con.mclassical.authenticate('r','r')
db = con.mclassical
Works = db.SCMD_works;
works = Works.find();

total = Works.count()
#for i in range(total):
for i in range(10):
  resources = works[i]['resources']
  for j in resources:
    print j['url']