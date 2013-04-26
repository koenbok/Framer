all: build

build:
	make lint
	make clean
	mkdir -p build
	./node_modules/coffee-script/bin/coffee scripts/banner.coffee > build/framer.js
	./node_modules/browserify/bin/cmd.js src/init.coffee >> build/framer.js
	cp build/framer.js template/framer.js
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
	rm -rf dist

lint:
	./node_modules/coffeelint/bin/coffeelint -f lint.config.json -r src

.PHONY: build clean lint test

