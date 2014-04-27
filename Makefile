bin = ./node_modules/.bin
coffee = $(bin)/coffee
browserify = $(bin)/browserify -t coffeeify -d --extension=".coffee"
watch = $(coffee) scripts/watch.coffee framer,test/tests

all: build

build:
	mkdir -p build
	$(coffee) scripts/banner.coffee > build/framer.js
	$(browserify) framer/Framer.coffee -o build/framer.js
	cp build/framer.js extras/CactusFramer/static/framer.js
buildw:
	$(watch) make build

test:
	make
	mkdir -p test/lib
	cp build/framer.js test/lib/framer.js
	$(browserify) test/init.coffee -o test/init.js
	$(bin)/mocha-phantomjs test/index.html
testw:
	$(watch) make test

dist:
	make build

deploy:
	make dist
	$(coffee) scripts/deploy.coffee

clean:
	rm -rf build