# ChloeBot.js

이 repo는 `discord.net`을 이용해 만든 `ChloeBot.net`가 원인을 알 수 없는 소켓에러로 정상 동작이 불가해 마이그레이션 용도로 작성했습니다.

이곳에서는 `ChloeBot.net`에서 제공한 일반 사용자용 명령어를 제공하지 않습니다.

실행 시 Docker 사용을 권장합니다.

이때 `token`을 url로 받는 경우 [이곳](https://github.com/level120/ChloeBot.js/blob/master/Core/core.js#L30)을 변경해야 합니다.

### Usage

```sh
$ sudo docker build --no-cache --tag chloe:latest Dockerfile
$ sudo docker run -d --name chloebot chloe:latest
$ sudo docker cp BOT_TOKEN chloebot:/ChloeBot.js  # token을 web에서 가져올 경우 생략가능
$ sudo docker restart chloebot
```