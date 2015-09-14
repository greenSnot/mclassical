export MCLASSICAL_SERVER_NAME="HK"
export MCLASSICAL_PORT=2999
/root/zips/nvm/nvm.sh

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use v0.10
git pull
pm2 restart 0
