FROM ubuntu:18.04
FROM openjdk:11
RUN apt-get update && apt-get -y install curl xz-utils wget git sudo build-essential
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt update && sudo apt install yarn
RUN sudo apt-get -y install libsecret-1-dev
RUN apt-get -y install ruby ruby-dev zlib1g-dev
RUN sudo apt-get -y install software-properties-common
RUN sudo add-apt-repository ppa:linuxuprising/java
RUN sudo apt update
RUN echo "oracle-java11-installer shared/accepted-oracle-license-v1-1 select true" | sudo debconf-set-selections
RUN sudo apt -y install oracle-java11-set-default-local
RUN apt-get update 
#RUN gem update --system 
#RUN gem install nokogiri
#RUN gem install solargraph 
RUN mkdir -p /home/project && mkdir -p /home/theia
RUN apt-get update 
WORKDIR /home/theia
RUN git clone https://github.com/genlike/pub.git
RUN sudo yarn --cache-folder ./ycache && sudo rm -rf ./ycache
WORKDIR /home/theia/pub
#RUN ls
RUN yarn --scripts-prepend-node-path
RUN NODE_OPTIONS="--max_old_space_size=8192" sudo yarn theia build
EXPOSE $PORT
