pwd := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
bin = $(pwd)/node_modules/.bin
coffee = $(bin)/coffee

browserify = $(bin)/browserify -t coffeeify -d --extension=".coffee"
watch = $(coffee) scripts/watch.coffee framer,test/tests
githash = `git rev-parse --short HEAD`

all: build

bootstrap:
	npm install

watch:
	$(watch) make $(cmd)

clean:
	rm -rf build

build: clean bootstrap 
	mkdir -p build
	$(browserify) framer/Framer.coffee -o build/framer.debug.js
	cat build/framer.debug.js | $(bin)/exorcist build/framer.js.map > build/framer.js


debug:
	$(bin)/watchify -t coffeeify --extension=".coffee" framer/Framer.coffee -d -v -o build/framer.debug.js

studio:
	open -a "Framer Studio" extras/Studio.framer

# Testing

test: build
	$(browserify) test/tests.coffee -o test/phantomjs/tests.js
	cd test/phantomjs; $(bin)/bower install
	$(bin)/mocha-phantomjs --bail test/phantomjs/index.html
testw:
	$(watch) make test

safari: test
	open -g -a Safari test/index.html
safariw:
	$(watch) make safari

# Building and uploading the site

dist:
	make build
	mkdir -p build/Framer
	cp -R templates/Project build/Framer/Project
	rm -Rf build/Framer/Project/framer
	mkdir -p build/Framer/Project/framer
	cp build/framer.js build/Framer/Project/framer/framer.js
	cp build/framer.js.map build/Framer/Project/framer/framer.js.map
	find build/Framer -name ".DS_Store" -depth -exec rm {} \;
	cd build; zip -r Framer.zip Framer

site%build:
	make dist
	mkdir -p build/builds.framerjs.com
	$(coffee) scripts/site-deploy.coffee build
	cp -R extras/builds.framerjs.com/static build/builds.framerjs.com/static
	mkdir -p build/builds.framerjs.com/latest
	cp build/*.js build/builds.framerjs.com/latest
	cp build/*.map build/builds.framerjs.com/latest
	cp build/*.zip build/builds.framerjs.com/latest
	cp -R build/builds.framerjs.com/latest build/builds.framerjs.com/$(githash)

site%upload:
	make site:build
	$(coffee) scripts/site-deploy.coffee upload

deploy:
	make site:build
	make site:upload

resources%optimize:
	python scripts/optimize.py
	
resources%upload:
	cd extras/resources.framerjs.com; cactus deploy

lint:
	./node_modules/.bin/coffeelint -f coffeelint.json -r framer

.PHONY: all build test clean perf watch