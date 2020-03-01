#!/usr/bin/bash
git fetch && git pull origin master

rm -f yarn.lock
yarn install

npm start