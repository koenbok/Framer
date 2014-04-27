browserify = ./node_modules/.bin/browserify -t coffeeify -d --extension=".coffee"
watch = ./node_modules/.bin/coffee scripts/watch.coffee framer,test/tests

all: build

build:
	mkdir -p build
	./node_modules/coffee-script/bin/coffee scripts/banner.coffee > build/framer.temp.js
	$(browserify) Framer/Framer.coffee -o build/framer.temp.js
	cp build/framer.temp.js build/framer.js
	cp build/framer.js extras/CactusFramer/static/framer.js
buildw:
	$(watch) make build

test:
	make
	mkdir -p test/lib
	cp build/framer.js test/lib/framer.js
	$(browserify) test/init.coffee -o test/init.js
	./node_modules/.bin/mocha-phantomjs test/index.html
testw:
	$(watch) make test


cactus:
	cd extras/CactusFramer; cactus serve
	

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

