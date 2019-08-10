import os
import qiniu
QN = qiniu.Auth('Ydyi73qwtgToPkCNkmBQzDIWtK1xzW_YN37Xy7TE','SQkOJg-B4JHaETjF5yJCqntsStMfdqi6hrCQCHq6')

def printFiles(path):
    files=os.listdir(path)
    for i in files:
        filename=path+'/'+i
        if os.path.isdir(filename):
            printFiles(filename)
        else:
            print filename
            data=open(filename).read()
            token = QN.upload_token('mclassical')
            ret, info = qiniu.put_data(token, filename, data)
            if ret is not None:
                print 'success '+filename
            else:
                print(info) # error message in info
            
printFiles('pdfjs')
