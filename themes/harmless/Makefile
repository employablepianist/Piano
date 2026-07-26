# Makefile — zola-harmless theme
ZOLA_VERSION := 0.22.1
BIN_DIR     := $(HOME)/.local/bin
ZOLA        := $(BIN_DIR)/zola
export PATH := $(BIN_DIR):$(PATH)
export DEV_PORT ?= 1111

.PHONY: deps build dev test lint clean

deps: zola node-deps
	@echo "[OK] All dependencies ready"

zola:
	@if [ -x "$(ZOLA)" ]; then \
		echo "[OK] zola $$($(ZOLA) --version 2>/dev/null)"; \
	else \
		echo "[...] Installing zola $(ZOLA_VERSION)"; \
		mkdir -p $(BIN_DIR); \
		curl -sL "https://github.com/getzola/zola/releases/download/v$(ZOLA_VERSION)/zola-v$(ZOLA_VERSION)-x86_64-unknown-linux-gnu.tar.gz" | tar xz -C $(BIN_DIR)/; \
	fi

node-deps:
	@if [ ! -d node_modules ]; then \
		npm ci || npm install; \
	fi

build: commit-hash zola-build backlinks zola-build sitemap
	@echo "[OK] Build complete"

commit-hash:
	@echo "{\"hash\":\"$$(git rev-parse --short=7 HEAD 2>/dev/null || echo 'dev')\"}" > static/build.json

zola-build:
	@$(ZOLA) build

backlinks:
	@node scripts/build-backlinks.js

sitemap:
	@node scripts/build-sitemap.js

dev: build
	@$(ZOLA) serve --port $(DEV_PORT) & sleep 3 && echo "http://127.0.0.1:$(DEV_PORT)"

test: node-deps
	DEV_PORT=$(DEV_PORT) npm test

lint:
	@node scripts/validate-titles.js

clean:
	rm -rf public/ .zola/
