import BaseHTTPServer
import CGIHTTPServer
import cgitb; cgitb.enable()  ## This line enables CGI error reporting
from urlparse import urlparse,parse_qs
import threading
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer ,BaseHTTPRequestHandler
import sys
sys.path.append('..')
from utils import *
from urllib import unquote
 
local_path='./resources_zips/'

class handler(CGIHTTPServer.CGIHTTPRequestHandler):
    def handle_one_request(self):
        """Handle a single HTTP request.
 
        You normally don't need to override this method; see the class
        __doc__ string for information on how to handle specific HTTP
        commands such as GET and POST.
 
        """
        try:
            self.raw_requestline = self.rfile.readline(65537)
            if len(self.raw_requestline) > 65536:
                self.requestline = ''
                self.request_version = ''
                self.command = ''
                self.send_error(414)
                return
            if not self.raw_requestline:
                self.close_connection = 1
                return
            if not self.parse_request():
                # An error code has been sent, just exit
                return
            mname = 'do_' + self.command
            if not hasattr(self, mname):
                self.send_error(501, "Unsupported method (%r)" % self.command)
                return
            method = getattr(self, mname)
            print "before call do_Get"
            method()
            print "after call do_Get"
            if not self.wfile.closed:
                self.wfile.flush() #actually send the response if not already done.
            print "after wfile.flush()"
        except socket.timeout, e:
            #a read or a write timed out.  Discard this connection
            self.log_error("Request timed out: %r", e)
            self.close_connection = 1
            return
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
handler.cgi_directories = ['./']
class ThreadingHTTPServer(ThreadingMixIn,HTTPServer):
    pass
 
    
if __name__ == '__main__':
    serveraddr = ('',9000)
    ser = ThreadingHTTPServer(serveraddr,handler)
    ser.serve_forever()
    sys.exit(0)
