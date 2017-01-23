default: dev

bootstrap:
	@yarn || (echo "Install yarn first – https://yarnpkg.com/" && exit 1)

test: bootstrap
	yarn test

build: bootstrap
	./node_modules/.bin/webpack \
		--hide-modules \
		--config webpack/webpack.build.js

dev: bootstrap
	./node_modules/.bin/webpack-dev-server \
		--config webpack/webpack.dev.js \
		--content-base ./static \
		--no-info \
		--port 8008 \
		--open

clean:
	rm -rf build

.PHONY: test bootstrap clean build
