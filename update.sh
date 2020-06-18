#!/usr/bin/bash
git fetch && git pull

rm -f yarn.lock
yarn install

npm start