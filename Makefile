.PHONY: help install build lint lint-fix test test-watch coverage qa clean publish

help:
	@echo "otel-sdk-react Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  make install       Install dependencies"
	@echo "  make build         Build TypeScript to JavaScript"
	@echo "  make lint          Run ESLint (check only)"
	@echo "  make lint-fix      Run ESLint with auto-fix"
	@echo "  make test          Run tests once (vitest)"
	@echo "  make test-watch    Run tests in watch mode"
	@echo "  make coverage      Run tests with coverage report"
	@echo "  make qa            Run full quality check (build + lint + test)"
	@echo "  make clean         Remove build artifacts and node_modules"
	@echo "  make publish       Publish to npm (requires auth)"
	@echo ""

install:
	npm install

build:
	npm run build

lint:
	npm run lint

lint-fix:
	npm run lint:fix

test:
	npm test

test-watch:
	npm run test:watch

coverage:
	npm run coverage

qa:
	npm run qa

clean:
	rm -rf dist node_modules coverage

publish:
	npm publish --access public
