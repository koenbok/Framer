# Configuration

BIN = $(CURDIR)/node_modules/.bin

DEFAULT_TARGET = extras/Studio.framer
TARGET ?= $(DEFAULT_TARGET)
TARGET_EXPANDED = $(shell echo $(TARGET)) # For ~ in paths, gulp needs this

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
	-cp $(DEFAULT_TARGET)/index.html $(TARGET)
	TARGET='$(strip $(TARGET_EXPANDED))' $(BIN)/gulp watch

build: lazy_bootstrap
	$(BIN)/gulp webpack:debug

lazy_build: ; @test -f ./build/framer.debug.js || make build

test: lazy_build
	$(BIN)/gulp test

lint: lazy_build
	$(BIN)/gulp lint


release: lazy_bootstrap
	$(BIN)/gulp webpack:release


# Framer Studio

studio:
	open -a "Framer Beta" ${TARGET}
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

resources:
	python scripts/resources-optimize.py
