import urllib2

from urlparse import urlparse
from multiprocessing import Pool

def getImage(index):

	response = urllib2.urlopen("https://source.unsplash.com/random")
	url = response.geturl()
	photo = urlparse(url).path.strip("/")

	print index

	if not photo.startswith("photo"):
		return

	response = urllib2.urlopen(url)

	if not response.getcode() == 200:
		return

	return photo.replace("photo-", "")

pool = Pool(8)
images = [x for x in pool.map(getImage, xrange(64)) if x is not None]

print len(images), "images"
print images[:32]
