#!/bin/sh

COFFEE="node_modules/.bin/coffee"
GIT_HASH=`git rev-parse --short HEAD`
LATEST=version/latest

mkdir -p build/builds.framerjs.com
$COFFEE scripts/site.coffee build
cp -R extras/builds.framerjs.com/static build/builds.framerjs.com/static
mkdir -p build/builds.framerjs.com/$LATEST
cp build/*.js build/builds.framerjs.com/$LATEST
cp build/*.map build/builds.framerjs.com/$LATEST
cp build/*.zip build/builds.framerjs.com/$LATEST
cp -R build/builds.framerjs.com/$LATEST build/builds.framerjs.com/$GIT_HASH
