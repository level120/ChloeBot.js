FROM node:12

RUN apt-get update && \
	apt-get install -y git &&\
	git clone https://github.com/level120/ChloeBot.js.git

WORKDIR /ChloeBot.js

ENTRYPOINT ["bash", "update.sh"]
