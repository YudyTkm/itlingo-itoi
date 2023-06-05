prevPort=$PORT
export PORT=7070
cd /home/theia/ide
npx tinylicious@latest &
export PORT=$prevPort 
cd /home/theia/ide/browser-app
yarn theia start --no-cluster  --plugins=local-dir:../plugins --hostname 0.0.0.0 --port $PORT 