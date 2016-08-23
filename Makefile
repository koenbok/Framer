# Configuration

BIN = $(CURDIR)/node_modules/.bin

.PHONY: watch test debug release

default: lazy_bootstrap lazy_build test

# Utilities

bootstrap:
	npm install

lazy_bootstrap: ; @test -d ./node_modules || make bootstrap

unbootstrap:
	rm -Rf node_modules



clean:
	rm -rf build
	rm -Rf node_modules


# Building and testing

watch: lazy_bootstrap
	$(BIN)/gulp watch

build: lazy_bootstrap
	$(BIN)/gulp webpack:debug

lazy_build: ; @test -f ./build/framer.debug.js || make build

test: lazy_build
	$(BIN)/gulp test

release: lazy_bootstrap
	$(BIN)/gulp webpack:release


# Framer Studio

studio:
	open -a "Framer Beta" extras/Studio.framer
	make watch

perf: debug
	open -a "Framer Beta" extras/Perf.framer


# Distribution

dist: release
	scripts/dist.sh

site-build: dist
	scripts/site-build.sh

site-upload: bootstrap site-build
	$(BIN)/coffee scripts/site.coffee upload

# Resources

resources-optimize:
	python scripts/resources-optimize.py

resources-upload:
	cd extras/resources.framerjs.com; cactus deploy
