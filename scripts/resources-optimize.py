#!/usr/bin/env python
import os
import sys

"""

brew install optipng
brew install webp

"""

path = os.path.join("extras", "resources.framerjs.com", "static", "DeviceResources")
jp2_quality = 16
webp_quality = 90


os.system("rm -Rf '%s'" % path)
os.system("cp -Rf '%s' '%s'" % (os.path.join("extras", "DeviceResources"), path))
os.chdir(path)

for fileName in os.listdir("."):
	if fileName.endswith(".png"):
		print fileName
		os.system("sips -s format jp2 %s -s formatOptions %s --out %s" % (fileName, jp2_quality, fileName.replace(".png", ".jp2")))
		os.system("cwebp -q %s '%s' -o '%s'" % (webp_quality, fileName, fileName.replace(".png", ".webp")))
		os.system("optipng -o4 '%s'" % fileName)