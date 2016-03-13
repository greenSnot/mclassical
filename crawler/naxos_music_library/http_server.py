import BaseHTTPServer
import CGIHTTPServer
import os
import cgitb; cgitb.enable()  ## This line enables CGI error reporting
from urlparse import urlparse,parse_qs
 
local_path='resources_zips/'
server = BaseHTTPServer.HTTPServer
class handler(CGIHTTPServer.CGIHTTPRequestHandler):
    def do_POST(self):
        cmds=parse_qs(urlparse(self.path).query)
        print cmds
        if cmds.get('rm'):
            os.popen('rm '+local_path+cmds.get('rm')[0])
            print 'ok'
server_address = ("", 9000)
handler.cgi_directories = ["./"]
 
httpd = server(server_address, handler)
httpd.serve_forever()
