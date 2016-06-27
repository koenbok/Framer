#!/bin/sh

GENERATOR_HOST="http://framergenerator-update.s3-website-us-east-1.amazonaws.com"
GENERATOR_LATEST=$GENERATOR_HOST/`curl -s $GENERATOR_HOST/latest.txt`

# Copy over the project structure
mkdir -p build/Framer
cp -R extras/templates/Project build/Framer/Project

# Copy over the framer build files
rm -Rf build/Framer/Project/framer
mkdir -p build/Framer/Project/framer
cp build/framer.js build/Framer/Project/framer/framer.js
cp build/framer.js.map build/Framer/Project/framer/framer.js.map

# Download the latest generator
cd build/Framer; wget "$GENERATOR_LATEST" -O "generator.tgz"; tar zxf "./generator.tgz"; rm "./generator.tgz"; cd -

# Clean up and zip the result
find build/Framer -name ".DS_Store" -depth -exec rm {} \;
cd build; zip -r -y Framer.zip Framer
