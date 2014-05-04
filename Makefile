bin = ./node_modules/.bin
coffee = $(bin)/coffee

browserify = $(bin)/browserify -t coffeeify -d --extension=".coffee"
watch = $(coffee) scripts/watch.coffee framer,test/tests

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

test:
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

test%safari:
	make build
	mkdir -p test/lib
	$(browserify) test/init.coffee -o test/init.js
	# open -a Safari test/index.html &
testw%safari:
	$(watch) make test


dist:
	make build

deploy:
	make dist
	$(coffee) scripts/deploy.coffee

clean:
	rm -rf build

.PHONY: all build test clean