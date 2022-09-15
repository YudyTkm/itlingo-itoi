FROM ubuntu:18.04
RUN apt-get update && apt-get -y install curl xz-utils wget git sudo build-essential
RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt update && sudo apt install yarn
RUN sudo apt-get -y install libsecret-1-dev
RUN apt-get -y install ruby ruby-dev zlib1g-dev
# ################################### JAVA
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata curl ca-certificates fontconfig locales \
    && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

# ENV JAVA_VERSION jdk-11.0.11+9

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         ESUM='4966b0df9406b7041e14316e04c9579806832fafa02c5d3bd1842163b7f2353a'; \
         BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.11%2B9/OpenJDK11U-jdk_aarch64_linux_hotspot_11.0.11_9.tar.gz'; \
         ;; \
       armhf|armv7l) \
         ESUM='2d7aba0b9ea287145ad437d4b3035fc84f7508e78c6fec99be4ff59fe1b6fc0d'; \
         BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.11%2B9/OpenJDK11U-jdk_arm_linux_hotspot_11.0.11_9.tar.gz'; \
         ;; \
       ppc64el|ppc64le) \
         ESUM='945b114bd0a617d742653ac1ae89d35384bf89389046a44681109cf8e4f4af91'; \
         BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.11%2B9/OpenJDK11U-jdk_ppc64le_linux_hotspot_11.0.11_9.tar.gz'; \
         ;; \
       s390x) \
         ESUM='5d81979d27d9d8b3ed5bca1a91fc899cbbfb3d907f445ee7329628105e92f52c'; \
         BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.11%2B9/OpenJDK11U-jdk_s390x_linux_hotspot_11.0.11_9.tar.gz'; \
         ;; \
       amd64|x86_64) \
         ESUM='e99b98f851541202ab64401594901e583b764e368814320eba442095251e78cb'; \
         BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.11%2B9/OpenJDK11U-jdk_x64_linux_hotspot_11.0.11_9.tar.gz'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/openjdk.tar.gz ${BINARY_URL}; \
    echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -; \
    mkdir -p /opt/java/openjdk; \
    cd /opt/java/openjdk; \
    tar -xf /tmp/openjdk.tar.gz --strip-components=1; \
    rm -rf /tmp/openjdk.tar.gz;

ENV JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/java/openjdk/bin:$PATH"
CMD ["jshell"]
RUN apt-get update 
# ################################ END JAVA
# RUN gem update --system 
# RUN gem install nokogiri
# RUN gem install solargraph 
RUN mkdir -p /home/project && mkdir -p /home/theia
RUN apt-get update 

WORKDIR /home/theia
RUN git clone https://github.com/genlike/pub.git


#Compile RSL extension
WORKDIR /home/theia
RUN git clone https://github.com/genlike/rsl-vscode-extension.git
RUN chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/org.xtext.itlingo.rsl.ide-1.0.0-SNAPSHOT-ls.jar
RUN chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/start-ls-itlingo
RUN chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/start-ls-itlingo.bat
RUN npm install -g vsce
WORKDIR /home/theia/rsl-vscode-extension
RUN yarn
RUN vsce package
RUN cp rsl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
RUN cd /home/theia && rm -R ./rsl-vscode-extension

#Compile ASL extension
WORKDIR /home/theia
RUN git clone https://github.com/genlike/asl-vscode-extension.git
RUN chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/org.xtext.itlingo.asl.ide-1.0.0-SNAPSHOT-ls.jar
RUN chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/start-ls-itlingo
RUN chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/start-ls-itlingo.bat
WORKDIR /home/theia/asl-vscode-extension
RUN yarn
RUN vsce package
RUN cp asl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
RUN cd .. && rm -R ./asl-vscode-extension




WORKDIR /home/theia/pub


# #RUN rm -R /home/theia/pub/theia-example-extension/node_modules
# #WORKDIR /home/theia/pub/theia-example-extension/
# RUN npm install -g npm@8.19.2
RUN npm install -g socket.io filenamify webpack msgpackr ws
# RUN npm install

RUN sudo yarn --scripts-prepend-node-path --cache-folder ./ycache && sudo rm -rf ./ycache
RUN NODE_OPTIONS="--max_old_space_size=8192" sudo yarn theia build
EXPOSE $PORT
# RUN sudo yarn
# RUN sudo yarn theia build
# EXPOSE 3000/tcp
# EXPOSE 5432
