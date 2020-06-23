#!/bin/sh

gameName="$1"

echo setting up ${gameName}...

perl -pi -e 's/game/'${gameName}'/g' ./package.json

perl -pi -e 's/Game/'${gameName}'/g' ./views/header.pug

rm ./README.md

echo installing packages and deleting script and README

npm install

rm ./setup.sh

echo setup completed. Use `npm run dev` to start game
