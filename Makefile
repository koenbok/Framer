pwd = $(CURDIR)
bin = $(pwd)/node_modules/.bin
coffee = "$(bin)/coffee"
githash = `git rev-parse --short HEAD`
gulp = "$(bin)/gulp"

all: build

bootstrap:
	npm install
	cd test/phantomjs; "$(bin)/bower" -q install

unbootstrap:
	rm -Rf node_modules
	rm -Rf test/phantomjs/bower

clean:
	rm -rf build

build: bootstrap clean 
	mkdir -p build
	$(gulp) build:release

debug: bootstrap clean 
	mkdir -p build
	$(gulp) build:debug

watch: bootstrap 
	$(gulp) watch

watcher: bootstrap 
	$(gulp) watcher

test: bootstrap 
	$(gulp) test

coverage: bootstrap
	$(bin)/coffeeCoverage ./framer ./build/instrumented
	$(gulp) coverage
	cp ./test/coverage-template/* ./build/coverage
	open ./build/coverage/jscoverage.html

studio:
	open -a "Framer Studio" extras/Studio.framer

# Building and uploading the site

dist:
	make build
	mkdir -p build/Framer
	cp -R extras/templates/Project build/Framer/Project
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