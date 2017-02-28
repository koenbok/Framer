default: dev

NODE_BIN = ./node_modules/.bin
BUILD_PATH = ./build

bootstrap:
	# @yarn install --prefer-offline || (echo "Install yarn first – https://yarnpkg.com/" && exit 1)

# test: bootstrap
# 	./node_modules/.bin/jest --watchAll

test: bootstrap
	open "http://localhost:8080/webpack-dev-server/" & \
		$(NODE_BIN)/webpack-dev-server --config webpack/webpack.tests.js


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

$(BUILD_PATH)/framer.d.ts $(BUID_PATH)/framer.js: tsconfig.json Makefile **/*.ts
	$(NODE_BIN)/tsc --declaration --module amd --outFile $(BUILD_PATH)/framer.js

$(BUILD_PATH)/framer-global.d.ts: $(BUILD_PATH)/framer.d.ts
	awk -f rewrite-framer-dts.awk < $(BUILD_PATH)/framer.d.ts > $(BUILD_PATH)/framer-global.d.ts

dts: $(BUILD_PATH)/framer-global.d.ts

clean:
	rm -rf build

lint: bootstrap
	$(NODE_BIN)/tslint --project .

lint-fix: bootstrap
	$(NODE_BIN)/tslint --project . --fix

typescript:
	$(NODE_BIN)/tsc --noEmit

visualize: bootstrap
	VISUALIZE=1 make dist
	open build/stats.html

.PHONY: test bootstrap clean build lint
