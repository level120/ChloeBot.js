FROM node:10

RUN apt-get update && \
	apt-get install -y git &&\
	git clone https://github.com/level120/ChloeBot.js.git

WORKDIR /ChloeBot.js

RUN bash update.sh

ENTRYPOINT ["/usr/local/bin/npm", "start"]
