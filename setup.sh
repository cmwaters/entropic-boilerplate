#!/bin/sh

gameName="$1"

echo setting up ${gameName}...

perl -pi -e 's/entropi-boilerplate/'${gameName}'/g' ./package.json

rm ./README.md

npm install

npm run build

echo deleting script and README

rm ./setup.sh

echo setup completed. Use `npm run start` to start game
