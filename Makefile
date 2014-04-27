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
	

# clean:
# 	rm -rf build

# lint:
# 	./node_modules/coffeelint/bin/coffeelint -f lint.config.json -r src

# dist:
# 	make clean
# 	make build
# 	cp -R template build/Framer
# 	cp build/framer.js build/Framer/framer.js
# 	cd build; zip -r Framer.zip Framer

# perf:
# 	make
# 	$(browserify) perf/init.coffee -o perf/init.js
# 	./node_modules/.bin/phantomjs perf/init.js
# perfw:
# 	$(watch) make perf


.PHONY: build clean lint test perf

