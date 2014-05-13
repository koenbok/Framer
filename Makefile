bin = ./node_modules/.bin
coffee = $(bin)/coffee

browserify = $(bin)/browserify -t coffeeify -d --extension=".coffee"
watch = $(coffee) scripts/watch.coffee framer,test/tests
githash = `git rev-parse --short HEAD`

all: build

build:
	make clean
	mkdir -p build
	# $(coffee) scripts/banner.coffee > build/framer.debug.js
	$(browserify) framer/Framer.coffee >> build/framer.debug.js
	cat build/framer.debug.js | $(bin)/exorcist build/framer.js.map > build/framer.js
	$(bin)/uglifyjs \
		--in-source-map build/framer.js.map \
		--source-map build/framer.min.js.map build/framer.js \
	> build/framer.min.js
	# Copy the file over to the cactus project
	cp build/framer.js extras/CactusFramer/static/framer.js
	cp build/framer.js.map extras/CactusFramer/static/framer.js.map
buildw:
	$(watch) make build

clean:
	rm -rf build


# Testing

test:
	make lint
	make build
	mkdir -p test/lib
	$(browserify) test/init.coffee -o test/init.js
	$(bin)/mocha-phantomjs test/index.html
testw:
	$(watch) make test

safari:
	make build
	mkdir -p test/lib
	$(browserify) test/init.coffee -o test/init.js
	# $(bin)/mocha-phantomjs test/index.html
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

lint:
	./node_modules/.bin/coffeelint -f coffeelint.json -r framer

.PHONY: all build test clean