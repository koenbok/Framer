default: dev

bootstrap:
	@yarn || (echo "Install yarn first – https://yarnpkg.com/" && exit 1)

# test: bootstrap
# 	./node_modules/.bin/jest --watchAll

test: bootstrap
	./node_modules/.bin/webpack-dev-server \
		--config webpack/webpack.tests.js \
		--open

build: bootstrap
	./node_modules/.bin/webpack \
		--hide-modules \
		--config webpack/webpack.dev.js

dev: bootstrap
	./node_modules/.bin/webpack-dev-server \
		--config webpack/webpack.dev.js \
		--port 8008 \
		--open

perf: bootstrap
	./node_modules/.bin/webpack-dev-server \
		--config webpack/webpack.perf.js \
		--port 8009 \
		--open

clean:
	rm -rf build

typescript:
	./node_modules/.bin/tsc --noEmit --p ./tsconfig.json

.PHONY: test bootstrap clean build
