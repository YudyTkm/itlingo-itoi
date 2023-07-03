ARG NODE_VERSION=16.16.0
FROM node:${NODE_VERSION}-alpine as base 

RUN apk add --no-cache git openssh bash libsecret 
ENV HOME /home/theia
WORKDIR /home/theia
# COPY --from=0 --chown=theia:theia /home/theia /home/theia

# RUN sudo apt-get install -y g++ gcc make python2.7 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev
RUN apk add --no-cache make pkgconfig gcc g++ python3 libx11-dev libxkbfile-dev libsecret-dev nano
RUN apk add openjdk11-jre dos2unix


# ADD $version.package.json ./package.json
# ARG GITHUB_TOKEN
FROM base as build-ide

ENV THEIA_WEBVIEW_EXTERNAL_ENDPOINT='{{hostname}}'
ENV NODE_OPTIONS "--max-old-space-size=4096"

COPY ide /home/theia/ide
WORKDIR /home/theia/ide

RUN chmod +x gitUtils/cloneScript.sh
RUN chmod +x gitUtils/gitPermissionsFix.sh
#COPY startup.sh .
#RUN chmod +x startup.sh

WORKDIR /home/theia/ide
RUN yarn --scripts-prepend-node-path --cache-folder ./ycache && rm -rf ./ycache
RUN find node_modules/@theia/cli/bin -type f -print0 | xargs -0 dos2unix
# RUN yarn theia build
WORKDIR /home/theia/ide/itlingo-itoi
RUN yarn
WORKDIR /home/theia/ide/browser-app
RUN yarn


FROM base as build-plugins
#Setup language servers folder
RUN npm install -g @vscode/vsce

#Compile ASL extension
WORKDIR /home/theia
COPY plugins/asl-langium /home/theia/asl-langium
RUN chmod +x /home/theia/asl-langium/server/asl/bin/generator.sh
RUN chmod +x /home/theia/asl-langium/server/asl/bin/importer.sh
WORKDIR /home/theia/asl-langium
RUN yarn
RUN vsce package
#RUN cp asl-langium-0.0.1.vsix /home/theia/ide/plugins
#RUN cd .. && rm -rf asl-langium

#Compile RSL extension
WORKDIR /home/theia
COPY plugins/rsl-vscode-extension /home/theia/rsl-vscode-extension
WORKDIR /home/theia/rsl-vscode-extension
RUN yarn
RUN vsce package
#RUN cp rsl-vscode-extension-0.0.1.vsix /home/theia/ide/plugins
#RUN cd .. && rm -rf rsl-vscode-extension

#Compile RSL extension
WORKDIR /home/theia
COPY plugins/vscode-code-annotation /home/theia/vscode-code-annotation
WORKDIR /home/theia/vscode-code-annotation
RUN npm install
RUN vsce package
#RUN cp code-annotation-0.0.2-dev.vsix /home/theia/ide/plugins
#RUN cd .. && rm -rf vscode-code-annotation


RUN mkdir -p /tmp/theia/workspaces/tmp


FROM build-ide as setup-server
COPY --from=build-plugins /home/theia/vscode-code-annotation/code-annotation-0.0.2-dev.vsix /home/theia/ide/plugins
COPY --from=build-plugins /home/theia/rsl-vscode-extension/rsl-vscode-extension-0.0.1.vsix /home/theia/ide/plugins
COPY --from=build-plugins /home/theia/asl-langium/asl-langium-0.0.1.vsix /home/theia/ide/plugins

RUN chmod -R 755 /tmp/vscode-unpacked

EXPOSE $PORT
#EXPOSE 3000

# RUN addgroup theia && \
#    adduser -G theia -s /bin/sh -D theia;
# RUN chmod g+rw /home && \
#    mkdir -p /home/project && \
#    chown -R theia:theia /home/theia && \
#    chown -R theia:theia /home/project;

# ENV SHELL=/bin/bash \
#    THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/ide/plugins

# USER theia

