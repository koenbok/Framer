#!/bin/bash
DEVMATE_FEED="https://updates.devmate.com/co.motif.framer.generator.xml"

# GENERATOR_HOST="http://framergenerator-update.s3-website-us-east-1.amazonaws.com"
# GENERATOR_LATEST=$GENERATOR_HOST/`curl -s $GENERATOR_HOST/latest.txt`

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
IMAGES_DIR=build/Framer/Project/framer/images
mkdir -p "$IMAGES_DIR"
cp -R extras/cursor-images/* "$IMAGES_DIR"
cp -R extras/preloader-images/* "$IMAGES_DIR"

# Download the latest generator
cd build/Framer
curl --silent --location $DEVMATE_FEED --output devmate.xml
xmllint --xpath "string(//item[1]/enclosure/@url)" devmate.xml | xargs curl --location --output generator.zip
unzip "./generator.zip"
rm "./devmate.xml"
rm "./generator.zip"
cd -

# Clean up and zip the result
find build/Framer -name ".DS_Store" -depth -exec rm {} \;
cd build
zip -r -y Framer.zip Framer
