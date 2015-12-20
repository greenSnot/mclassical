#建立代码仓库
```
mkdir ~/gitGarage/some
```

```
cd ~/gitGarage/some
```

```
git init
```

```
git config receive.denyCurrentBranch ignore
```

```
git config --global user.name 'p'
```

```
git config --global user.email 'p'
```

###clone仓库
```
cd ~
git clone ssh://root@IP/~/gitGarage/some/.git
```

#Mongodb replset
###创建目录
```
sudo mkdir -p /data/replset/main
```

```
sudo mkdir -p /data/replset/r0
```

```
sudo mkdir -p /data/replset/r1
```

```
sudo mkdir -p /data/replset/key
```

```
sudo mkdir -p /data/replset/log
```
###创建KEY
```
sudo echo "replset1 key" > /data/replset/key/r0
sudo echo "replset1 key" > /data/replset/key/r1
```
####600，防止其它程序改写此KEY
```
sudo chmod 600 /data/replset/key/r*
```

```
echo 'xxxxxx' | sudo mongod --dbpath=/data/db --replSet replset1 --keyFile /data/replset/key/main --port 27017
```

```
echo 'xxxxxx' | sudo mongod --dbpath=/data/replset/r0 --replSet replset1 --keyFile /data/replset/key/r0 --port 28010
```

```
echo 'xxxxxx' | sudo mongod --dbpath=/data/replset/r1 --replSet replset1 --keyFile /data/replset/key/r1 --port 28011
```
