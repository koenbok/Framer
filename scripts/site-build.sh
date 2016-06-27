#!/bin/sh

COFFEE="node_modules/.bin/coffee"
GIT_HASH=`git rev-parse --short HEAD`

mkdir -p build/builds.framerjs.com
$COFFEE scripts/site.coffee build
cp -R extras/builds.framerjs.com/static build/builds.framerjs.com/static
mkdir -p build/builds.framerjs.com/latest
cp build/*.js build/builds.framerjs.com/latest
cp build/*.map build/builds.framerjs.com/latest
cp build/*.zip build/builds.framerjs.com/latest
cp -R build/builds.framerjs.com/latest build/builds.framerjs.com/$GIT_HASH
