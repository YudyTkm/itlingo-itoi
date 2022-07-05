FROM node:current
FROM openjdk:11
RUN apt-get update && apt-get -y install curl xz-utils wget git sudo build-essential
WORKDIR /home
RUN git clone https://github.com/genlike/workspace-orchestrator.git
WORKDIR /home/workspace-orchestrator
RUN npm install

EXPOSE $PORT
#EXPOSE 3000/tcp
