# ChloeBot.js

This is a notification bot when the official site update by a new post.

* Crawling time: 30s
* Target site: <https://soulworker.game.onstove.com>
* Target board: Notice, Update, Event, GM Magazine

---

# Local Machine

### How to install

* It needs a Node 10 or newer(Dockerfile used with v12).
* Install `yarn` package manager(NPM didn't test currently).
* Install dependency packages by `yarn install` command

### How to run

* Run Chloe bot by `npm start` command

### Set token for a Discord bot

1. Please create a new file and named by `bot.token`.
2. Insert token context to file(Do not insert carriage return, only one line need).

**Example**

[bot.token] - It's ok
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

[Bot.token] - filename is not lowercase
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ

```
file contents contain carriage returns and fail.

---

# Docker Container

This dockerfile automatically run when container starting.

So it needs `bot.token` file to run, this provides two methods to set token.

1. When using the web: Please [change this](https://github.com/level120/ChloeBot.js/blob/master/Core/core.js#L30), replace FTP to web download.
2. When using FTP: Please [change this](https://github.com/level120/ChloeBot.js/blob/master/Core/ftp.js#L6), IP address, port, and others).

! Token file doesn't contain any carriage return or white space.

### Usage

```sh
$ sudo docker build --no-cache --tag chloe:latest Dockerfile # Build dockerfile
$ sudo docker run -d --name chloebot chloe:latest # Container creation and running
$ sudo docker cp bot.token chloebot:/ChloeBot.js  # Setting token for discord
$ sudo docker restart chloebot
```