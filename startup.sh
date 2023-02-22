#!/bin/sh
/home/theia/ls/asl/bin/start-asl-ls-itlingo --port 3011 & cd /home/theia/pub/browser-app && yarn theia start --no-cluster  --plugins=local-dir:../plugins --hostname 0.0.0.0 --port $PORT 


#& /home/theia/ls/rsl/bin/start-ls-itlingo --port 6008 
#& 