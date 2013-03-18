all: build

build:
	make lint
	make clean
	mkdir -p build
	./node_modules/browserify/bin/cmd.js src/init.coffee -o build/framer.build.js
	echo "// Framer `git describe --tags` (c) 2013 Koen Bok\n" > build/framer.js
	echo "window.FramerVersion = \"`git describe --tags`\";\n\n" >> build/framer.js
	cat build/framer.build.js >> build/framer.js
	rm build/framer.build.js
	cp build/framer.js template/framer.js

test:
	make
	mkdir -p test/lib
	cp build/framer.js test/lib/framer.js
	./node_modules/browserify/bin/cmd.js test/init.coffee -o test/init.js
	open test/index.html

clean:
	rm -rf dist

lint:
	./node_modules/coffeelint/bin/coffeelint -f lint.config.json -r src

.PHONY: build clean lint test

