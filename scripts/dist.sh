#!/bin/bash

GENERATOR_HOST="http://framergenerator-update.s3-website-us-east-1.amazonaws.com"
GENERATOR_LATEST=$GENERATOR_HOST/`curl -s $GENERATOR_HOST/latest.txt`

# Clean up previous builds
rm -f build/Framer.zip
rm -Rf build/Framer
mkdir -p build/Framer

# Copy over the project structure
cp -R extras/templates/Project build/Framer/Project

# Copy over the framer build files
mkdir -p build/Framer/Project/framer
cp build/framer.js build/Framer/Project/framer/framer.js
cp build/framer.js.map build/Framer/Project/framer/framer.js.map

# Copy over extra images
cp -R extras/cursor-images build/Framer/Project/framer/images

# Download the latest generator
cd build/Framer
curl "${GENERATOR_LATEST// /%20}" -o "generator.tgz"
tar zxf "./generator.tgz"
rm "./generator.tgz"
cd -

# Clean up and zip the result
find build/Framer -name ".DS_Store" -depth -exec rm {} \;
cd build
zip -r -y Framer.zip Framer
