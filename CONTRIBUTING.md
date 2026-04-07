# Contributing to @makomweb/otel-sdk-react

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Getting Started

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Create a feature branch**: `git checkout -b feature/my-feature`

## Development

### Available Commands

```bash
# Build package
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Build + lint + test (QA)
npm run qa
```

### Project Structure

```
src/
  ├── otel.ts ..................... setupOTelSDK() implementation
  ├── instrumentations.ts ......... setupFetchInstrumentation() implementation
  ├── env.ts ...................... Configuration (OTEL_COLLECTOR_ADDRESS)
  └── index.ts .................... Barrel export

tests/
  ├── otel.test.ts ................ setupOTelSDK() tests
  └── instrumentations.test.ts .... setupFetchInstrumentation() tests
```

## Code Style

- **TypeScript**: Strict mode enabled, no implicit any
- **Formatting**: Use prettier (configured in package.json)
- **Linting**: ESLint with @typescript-eslint/recommended

## Testing

- **Framework**: Vitest
- **Coverage target**: >80%
- **Run tests**: `npm test`
- **Watch mode**: `npm test -- --watch`

## Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: documentation update
test: add or update tests
refactor: refactor code
chore: maintenance task
```

Example:
```
feat: add support for custom span processor

- Allows users to configure custom span processor
- Updates documentation with example
- Adds unit tests for new functionality
```

## Pull Request Process

1. **Update tests**: Ensure all changes have corresponding tests
2. **Update documentation**: Update README.md if adding features
3. **Run QA**: `npm run qa` (must pass)
4. **Commit**: Use conventional commit messages
5. **Push**: Create a pull request with clear description
6. **Review**: Address feedback from maintainers

## Reporting Issues

When reporting issues:

1. **Title**: Clear, specific description
2. **Environment**: Node version, React version, browser
3. **Steps to reproduce**: Clear reproduction steps
4. **Expected vs actual**: What should happen vs what happens
5. **Logs/errors**: Include console errors and network logs

## Release Process

Only maintainers can create releases:

1. Update version in package.json
2. Update CHANGELOG.md (not yet created, future use)
3. Create GitHub Release with tag `v{version}`
4. GitHub Actions automatically publishes to npm

## Questions?

- Open a discussion in GitHub Discussions
- Create an issue with question/discussion label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
