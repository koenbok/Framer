all: build

build:
	make lint
	make clean
	mkdir -p build
	./node_modules/browserify/bin/cmd.js src/init.coffee -o build/framer.js
	cp build/framer.js template/framer.js

clean:
	rm -rf dist

lint:
	./node_modules/coffeelint/bin/coffeelint -f lint.config.json -r src

.PHONY: build clean lint