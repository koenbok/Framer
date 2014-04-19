all: build

build:
	make lint
	# make clean
	mkdir -p build
	./node_modules/coffee-script/bin/coffee scripts/banner.coffee > build/framer.js
	./node_modules/browserify/bin/cmd.js src/init.coffee >> build/framer.js
buildw:
	./node_modules/coffee-script/bin/coffee scripts/watch.coffee . make build

test:
	make
	mkdir -p test/lib
	cp build/framer.js test/lib/framer.js
	./node_modules/browserify/bin/cmd.js test/init.coffee -o test/init.js
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/index.html
testw:
	./node_modules/coffee-script/bin/coffee scripts/watch.coffee . make test

clean:
	rm -rf build

lint:
	./node_modules/coffeelint/bin/coffeelint -f lint.config.json -r src

dist:
	make clean
	make build
	cp -R template build/Framer
	cp build/framer.js build/Framer/framer.js
	cd build; zip -r Framer.zip Framer

cactus:
	cd extras/CactusFramerTest; cactus serve

.PHONY: build clean lint test

