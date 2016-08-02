#!/bin/bash
DEVMATE_LATEST="https://dl.devmate.com/co.motif.framer.generator/FramerGenerator.zip"

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
curl --location $DEVMATE_LATEST --output generator.zip
unzip "./generator.zip"
rm "./generator.zip"
cd -

# Clean up and zip the result
find build/Framer -name ".DS_Store" -depth -exec rm {} \;
cd build
zip -r -y Framer.zip Framer
