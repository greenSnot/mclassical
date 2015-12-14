建立代码仓库
====================
mkdir ~/gitGarage/some
cd ~/gitGarage/some
git init
git config receive.denyCurrentBranch ignore

git config --global user.name 'p'
git config --global user.email 'p'

clone仓库
=================
cd ~
git clone ssh://root@IP/~/gitGarage/some/.git
