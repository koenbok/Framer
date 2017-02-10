default: dev

NODE_BIN = ./node_modules/.bin
BUILD_PATH = ./build

bootstrap:
	@yarn install --prefer-offline || (echo "Install yarn first – https://yarnpkg.com/" && exit 1)

# test: bootstrap
# 	./node_modules/.bin/jest --watchAll

test: bootstrap
	$(NODE_BIN)/webpack-dev-server \
		--config webpack/webpack.tests.js \
		--open

build: bootstrap
	$(NODE_BIN)/webpack \
		--config webpack/webpack.framer.js

dist: dts
	BUILD_TYPE=production make build

dev: bootstrap
	$(NODE_BIN)/webpack-dev-server \
		--config webpack/webpack.dev.js \
		--port 8008 \
		--open

perf: bootstrap
	$(NODE_BIN)/webpack-dev-server \
		--config webpack/webpack.perf.js \
		--port 8009 \
		--open

dts:
	$(NODE_BIN)/tsc --declaration --module system --outFile $(BUILD_PATH)/framer.js

clean:
	rm -rf build

lint: bootstrap
	$(NODE_BIN)/tslint --project .

lint-fix: bootstrap
	$(NODE_BIN)/tslint --project . --fix

typescript:
	$(NODE_BIN)/tsc --noEmit

visualize: bootstrap
	BUILD_TYPE=production VISUALIZE=1 make build
	open build/stats.html

.PHONY: test bootstrap clean build lint
