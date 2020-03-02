# ChloeBot.js

This is a notification bot for the Soulworker(KR) when official site update by new post.

* Crawling time: 30s
* Target site: <https://soulworker.game.onstove.com>
* Target board: Notice, Update, Event, GM Magazine

---

# Local Machine

* It need a Node 10 or newer(Dockerfile used with v12).
* Install a `yarn` package manager.
* `yarn install` and `npm start` to run.

---

# Docker Container

This dockerfile automatically run when container starting.

So it need `bot.token` file to run, this provide two method to set token.

1. When use web: Please [change this](https://github.com/level120/ChloeBot.js/blob/master/Core/core.js#L30), replace ftp to web download.
2. When use ftp: Please [change this](https://github.com/level120/ChloeBot.js/blob/master/Core/ftp.js#L6), ip address, port and others).

! Token file don't contains any carriage return or white space.

### Usage

```sh
$ sudo docker build --no-cache --tag chloe:latest Dockerfile # Build dockerfile
$ sudo docker run -d --name chloebot chloe:latest # Container creation and running
$ sudo docker cp bot.token chloebot:/ChloeBot.js  # Setting token for discord
$ sudo docker restart chloebot
```