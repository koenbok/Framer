#!/bin/bash

PATH=/usr/local/bin:/usr/bin:/bin

if [ -z "`which optipng`" ]; then
    brew install optipng
fi

if [ -z "`which cwebp`" ]; then
    brew install webp
fi

SCRIPT_PATH="$( cd "$( dirname "$0" )" && pwd )"

cd "extras"

SOURCE_PATH=DeviceResources
TARGET_PATH=resources.framerjs.com/static/DeviceResources

JP2_QUALITY=16
JP2_QUALITY_SMALL=100
WEBP_QUALITY=90
SMALL_PIXEL_LIMIT=400000

mkdir -p "$TARGET_PATH"

cd "$SOURCE_PATH"
pax -wrs'/png$/unoptim.png/' *.png "../$TARGET_PATH"
cd - > /dev/null

cd "$TARGET_PATH"

cat > "Makefile" <<EOF
UNOPTIMIZED_FILES := \$(wildcard *.unoptim.png)
PNG_FILES  := \$(patsubst %.unoptim.png, %.png, \$(UNOPTIMIZED_FILES))
JP2_FILES  := \$(patsubst %.unoptim.png, %.jp2, \$(UNOPTIMIZED_FILES))
WEBP_FILES := \$(patsubst %.unoptim.png, %.webp, \$(UNOPTIMIZED_FILES))

all: png jp2 webp

png: \$(PNG_FILES)

jp2: \$(JP2_FILES)

webp: \$(WEBP_FILES)

\$(PNG_FILES): %.png: %.unoptim.png
	optipng -clobber \$< -out \$@

\$(JP2_FILES): %.jp2: %.unoptim.png
	$SCRIPT_PATH/jp2-convert.sh \$< \$@ $JP2_QUALITY $SMALL_PIXEL_LIMIT $JP2_QUALITY_SMALL    

\$(WEBP_FILES): %.webp: %.unoptim.png
	cwebp -q $WEBP_QUALITY \$< -o \$@
EOF

make all

rm *.unoptim.png
rm "Makefile"
