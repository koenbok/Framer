all: build

build:
	make lint
	make clean
	mkdir -p build
	./node_modules/.bin/coffee scripts/banner.coffee > build/framer.js
	./node_modules/.bin/browserify src/init.coffee >> build/framer.js
	cp build/framer.js template/framer.js
buildw:
	./node_modules/.bin/coffee scripts/watch.coffee . make build

test:
	make
	mkdir -p test/lib
	cp build/framer.js test/lib/framer.js
	./node_modules/.bin/browserify test/init.coffee -o test/init.js
	./node_modules/.bin/mocha-phantomjs test/index.html
testw:
	./node_modules/.bin/coffee scripts/watch.coffee . make test

clean:
	rm -rf dist

lint:
	./node_modules/.bin/coffeelint -f lint.config.json -r src

dist:
	make build
	cp -R template build/template
	cp build/framer.js build/template/framer.js

.PHONY: build clean lint test

