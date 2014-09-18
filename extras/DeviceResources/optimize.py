#!/usr/bin/env python
import os
import sys

quality = 25

for fileName in os.listdir(os.path.dirname(__file__)):
	if fileName.endswith(".png"):
		os.system("sips -s format jp2 %s -s formatOptions %s --out %s" % (fileName, quality, fileName.replace(".png", ".jp2")))


# sips -s format jp2 iphone-6-gold-hand.png -s formatOptions 25 --out iphone-6-gold-hand.jp2
