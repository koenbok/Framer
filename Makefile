# Configuration

BIN = $(CURDIR)/node_modules/.bin

.DEFAULT_GOAL := watch
.PHONY: watch test debug release

# Utilities

bootstrap:
	npm install

unbootstrap:
	rm -Rf node_modules

clean:
	rm -rf build


# Building and testing

watch: bootstrap
	$(BIN)/gulp watch

test: bootstrap
	$(BIN)/gulp test

debug: bootstrap
	$(BIN)/gulp webpack:debug

release: bootstrap
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
