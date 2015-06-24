#!/usr/bin/env python
import os
import sys

path = os.path.join("extras", "DeviceResources")
quality = 15

os.chdir(path)

for fileName in os.listdir("."):
	if fileName.endswith(".png"):
		os.system("sips -s format jp2 %s -s formatOptions %s --out %s" % (fileName, quality, fileName.replace(".png", ".jp2")))


# sips -s format jp2 iphone-6-gold-hand.png -s formatOptions 25 --out iphone-6-gold-hand.jp2
