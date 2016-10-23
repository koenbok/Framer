NODE_MODULES = ./node_modules
NODE_BIN = $(NODE_MODULES)/.bin

.DEFAULT_GOAL := watch


### Moonbase

npm:
	@test -d ./node_modules || npm install --loglevel=error

clean:
	$(NODE_BIN)/moonbase clean
	rm -Rf ./node_modules

build: npm
	$(NODE_BIN)/moonbase build

watch: npm
	$(NODE_BIN)/moonbase watch


### Optional

upload: build
	make git-check
	# rsync ...


### Utilities

git-check:
	@status=$$(git status --porcelain); \
	if test "x$${status}" = x; then \
		git push; \
	else \
		echo "\n\n!!! Working directory is dirty, commit/push first !!!\n\n" >&2; exit 1 ; \
	fi


.PHONY: npm build clean watch upload git-check
