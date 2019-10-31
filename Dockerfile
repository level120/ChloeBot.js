FROM node:10

RUN apt-get update && \
	apt-get install -y git &&\
	git clone https://github.com/level120/ChloeBot.js.git

WORKDIR /ChloeBot.js

ENTRYPOINT ["/usr/bin/bash", "update.sh"]
