#!/bin/bash

INPUT=$1
OUTPUT=$2
STANDARD_QUALITY=$3
SMALL_PIXEL_LIMIT=$4
SMALL_QUALITY=$5

# ---

XPATH_SCRIPT="number(//key[text()='pixelWidth']/following-sibling::integer[1]) * number(//key[text()='pixelHeight']/following-sibling::integer[1]) < $SMALL_PIXEL_LIMIT"

QUALITY=$STANDARD_QUALITY
if [ -n "`sips -g allxml "$INPUT" | xmllint --xpath "$XPATH_SCRIPT" - | grep true`" ]; then
    QUALITY=$SMALL_QUALITY
fi

sips -s format jp2 "$INPUT" -s formatOptions $QUALITY --out "$OUTPUT"
