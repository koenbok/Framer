import os
import sys
import commands
import re

PATH = os.path.dirname(__file__)
OUTPATH = os.path.join(PATH, "..", "build", "autocomplete.txt")
INPATH =  os.path.join(PATH, "..", "framer")
OUTPUT = []

with open(os.path.join(PATH, "autocomplete.blacklist.txt")) as f:
	BLACKLIST = [w.strip() for w in f.read().split()]

def extract_keywords(line):

	line = line.strip()
	result = []

	# Skip comments
	if line.startswith("#"):
		return result

	# Remove all strings
	line = re.sub(r'".*?"', '', line)
	line = re.sub(r"'.*?'", '', line)

	regex = re.compile("[\w]{3,}")

	for word in regex.findall(line):
		if word.startswith("_"): continue
		if word.endswith("px"): continue
		if re.match("[\d]\w+", word): continue
		result.append(word)

	return result

def process(INPATH):

	result = []
	file_paths = [os.path.abspath(f) for f in commands.getoutput("find {} -type f -name '*.coffee'".format(INPATH)).splitlines()]

	for path in file_paths:
		with open(path, "r") as f:
			contents = f.read()
		result += ["\n# {}\n".format(os.path.split(path)[1])]
		for line in contents.splitlines():
			result += extract_keywords(line)

	with open(OUTPATH, "w") as f:
		f.write(" ".join(list(set(result))))

process(INPATH)
