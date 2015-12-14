创建目录
[root@localhost ~]# mkdir -p /data/replset/main
[root@localhost ~]# mkdir -p /data/replset/r0
[root@localhost ~]# mkdir -p /data/replset/r1
[root@localhost ~]# mkdir -p /data/replset/key
[root@localhost ~]# mkdir -p /data/replset/log
创建KEY
[root@localhost ~]# echo "replset1 key" > /data/replset/key/r0
[root@localhost ~]# echo "replset1 key" > /data/replset/key/r1
[root@localhost ~]# chmod 600 /data/replset/key/r*  //600，防止其它程序改写此KEY

echo 'xxxxxx' | sudo mongod --dbpath=/data/db --replSet replset1 --keyFile /data/replset/key/main --port 27017
echo 'xxxxxx' | sudo mongod --dbpath=/data/replset/r0 --replSet replset1 --keyFile /data/replset/key/r0 --port 28010
echo 'xxxxxx' | sudo mongod --dbpath=/data/replset/r1 --replSet replset1 --keyFile /data/replset/key/r1 --port 28011

