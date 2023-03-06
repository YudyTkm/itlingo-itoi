ARG NODE_VERSION=14.21.3
# FROM node:${NODE_VERSION}-alpine
# RUN apk add --no-cache make pkgconfig gcc g++ python libx11-dev libxkbfile-dev libsecret-dev
# ARG version=latest
# WORKDIR /home/theia



FROM node:${NODE_VERSION}-alpine
# See : https://github.com/theia-ide/theia-apps/issues/34

RUN apk add --no-cache git openssh bash libsecret
ENV HOME /home/theia
WORKDIR /home/theia
# COPY --from=0 --chown=theia:theia /home/theia /home/theia

# RUN sudo apt-get install -y g++ gcc make python2.7 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev
RUN apk add --no-cache make pkgconfig gcc g++ python3 libx11-dev libxkbfile-dev libsecret-dev nano

# ADD $version.package.json ./package.json
# ARG GITHUB_TOKEN
RUN git clone https://github.com/genlike/pub.git
#COPY startup.sh .
#RUN chmod +x startup.sh

#Setup language servers folder
RUN mkdir /home/theia/ls

#Compile ASL extension
WORKDIR /home/theia
RUN git clone https://github.com/genlike/asl-vscode-extension.git
RUN npm install -g @vscode/vsce
WORKDIR /home/theia/asl-vscode-extension
RUN yarn
RUN vsce package
RUN cp asl-langium-0.0.1.vsix /home/theia/pub/plugins
RUN cd .. && rm -rf asl-vscode-extension


#Compile RSL extension
WORKDIR /home/theia
RUN git clone https://github.com/genlike/rsl-vscode-extension.git
RUN npm install -g @vscode/vsce
WORKDIR /home/theia/rsl-vscode-extension
RUN yarn
RUN vsce package
RUN cp rsl-vscode-extension-0.0.1.vsix /home/theia/pub/plugins
RUN cd .. && rm -rf rsl-vscode-extension

WORKDIR /home/theia/pub

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn --scripts-prepend-node-path --cache-folder ./ycache && rm -rf ./ycache
RUN yarn theia build
WORKDIR /home/theia/pub/itlingo-itoi
RUN yarn
WORKDIR /home/theia/pub/browser-app
RUN yarn; exit 0



EXPOSE $PORT
#EXPOSE 3000

RUN addgroup theia && \
   adduser -G theia -s /bin/sh -D theia;
RUN chmod g+rw /home && \
   mkdir -p /home/project && \
   chown -R theia:theia /home/theia && \
   chown -R theia:theia /home/project;

ENV SHELL=/bin/bash \
   THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/pub/plugins
ENV USE_LOCAL_GIT true

USER theia

