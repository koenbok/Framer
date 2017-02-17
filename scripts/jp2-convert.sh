#!/bin/bash

INPUT=$1
OUTPUT=$2
STANDARD_COMPRESSION=$3
SMALL_PIXEL_LIMIT=$4
SMALL_COMPRESSION=$5

# ---

XPATH_SCRIPT="number(//key[text()='pixelWidth']/following-sibling::integer[1]) * number(//key[text()='pixelHeight']/following-sibling::integer[1]) < $SMALL_PIXEL_LIMIT"

COMPRESSION=$STANDARD_COMPRESSION
if [ -n "`sips -g allxml "$INPUT" | xmllint --xpath "$XPATH_SCRIPT" - | grep true`" ]; then
    COMPRESSION=$SMALL_COMPRESSION
fi

SEMIOUTPUT=$OUTPUT.bmp

convert "$INPUT" "$SEMIOUTPUT"
opj_compress -i "$SEMIOUTPUT" -o "$OUTPUT" -r $COMPRESSION
rm "$SEMIOUTPUT"
