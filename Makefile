default: dev

bootstrap:
	@yarn || (echo "Install yarn first – https://yarnpkg.com/" && exit 1)

test: bootstrap
	./node_modules/.bin/jest --watchAll

build: bootstrap
	./node_modules/.bin/webpack \
		--hide-modules \
		--config webpack/webpack.dev.js

dev: bootstrap
	./node_modules/.bin/webpack-dev-server \
		--config webpack/webpack.dev.js \
		--content-base ./static \
		--no-info \
		--port 8008 \
		--open

clean:
	rm -rf build

typescript:
	./node_modules/.bin/tsc --noEmit --p ./tsconfig.json

.PHONY: test bootstrap clean build
