import BaseHTTPServer
import CGIHTTPServer
import cgitb; cgitb.enable()  ## This line enables CGI error reporting
from urlparse import urlparse,parse_qs
import sys
sys.path.append('..')
from utils import *
from urllib import unquote
 
local_path='./resources_zips/'

server = BaseHTTPServer.HTTPServer
class handler(CGIHTTPServer.CGIHTTPRequestHandler):
    def do_POST(self):
        cmds=parse_qs(urlparse(self.path).query)
        print cmds
        if cmds.get('rm'):
            os.popen('rm '+local_path+unquote(cmds.get('rm')[0]))
            self.send_response(200)
            self.end_headers()
            self.wfile.write('ok')
        elif cmds.get('ls'):
            files=os.popen('ls -s '+local_path).read()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(files)
        print 'ok'
server_address = ("", 9000)
handler.cgi_directories = ['./']
 
httpd = server(server_address, handler)
httpd.serve_forever()
