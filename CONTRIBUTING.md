# Contributing to wp-content-exporter

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Welcome diverse perspectives

## Getting Started

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- npm 9+ (comes with Node.js)
- Git ([download](https://git-scm.com/))
- A code editor (VS Code recommended)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/gayathri1462/wp-content-exporter.git
cd wp-content-exporter

# Install dependencies
npm install

# Verify setup
npm run build
npm test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks
- `test/` - Test additions

### 2. Make Your Changes

```bash
# Edit files in `src/` or `tests/`
# Example: Update src/fetch.ts

# Verify changes compile
npm run build

# Run tests
npm test

# Type check
npm run type-check
```

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Write descriptive commit messages
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Test updates
- `chore:` - Maintenance

Examples:
```
feat: add support for custom headers authentication
fix: handle empty API responses gracefully
docs: update README with more examples
test: add test cases for pagination
chore: update dependencies
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to [GitHub repository](https://github.com/gayathri1462/wp-content-exporter)
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
How did you test this?

## Checklist
- [ ] Code builds without errors
- [ ] Tests pass
- [ ] Types are correct
- [ ] Documentation updated
```

## Code Style

### TypeScript Guidelines

- Use strict mode (all files compiled with --strict)
- Add JSDoc comments to all functions
- Use meaningful variable names
- Avoid `any` types

Good example:
```typescript
/**
 * Builds HTTP headers with authentication
 * 
 * @param {AuthConfig} [auth] - Optional authentication config
 * @returns {HeadersInit} HTTP headers with auth applied
 */
export function buildHeaders(auth?: AuthConfig): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }
  
  // Implementation...
  return headers
}
```

Poor example:
```typescript
export function buildHeaders(auth: any) {
  let h: any = {}
  // ...
  return h
}
```

### Formatting

- Use 2-space indentation
- Max line length: 100 characters
- Use `const` by default, `let` when needed
- No trailing commas in objects

### Error Handling

Always throw meaningful errors:

```typescript
// Good
throw new Error("Endpoint is required")
throw new Error(`Failed to fetch from ${url}: ${error.message}`)

// Avoid
throw new Error("Error")
throw error
```

## Testing

### Add Tests

For new features, add corresponding tests in `tests/`:

```typescript
test("Should handle new feature", async () => {
  // Arrange
  const input = { /* ... */ }
  
  // Act
  const result = await newFunction(input)
  
  // Assert
  if (!result.success) {
    throw new Error("Should be successful")
  }
  
  console.log("✓ Feature works correctly")
})
```

### Run Tests

```bash
# Run all tests
npm test

# Or just compile and test
npm run build
npm run test:local
```

All tests must pass before submitting a PR.

### Test Coverage

Aim for:
- Happy path scenarios
- Error cases
- Edge cases (empty data, null values)
- Different parameter combinations

## Documentation

### Update README

If your change affects users, update [README.md](README.md):

- Add examples of new features
- Update API reference
- Add to feature list if applicable

### Update Inline Documentation

All public functions need JSDoc:

```typescript
/**
 * What does this function do?
 * 
 * @param {Type} name - Parameter description
 * @returns {Type} Return value description
 * @throws {Error} When this error occurs
 * 
 * @example
 * const result = myFunction(param)
 */
export function myFunction(name: Type): Type {
  // ...
}
```

## Performance Considerations

- Minimize network requests
- Cache when appropriate
- Handle large datasets efficiently
- Use streaming for large files (future enhancement)

## Security

- Never commit secrets/credentials
- Validate all inputs
- Handle errors securely (don't expose internal details)
- Review for injection vulnerabilities

## Questions 

- Create an [Issue](https://github.com/gayathri1462/wp-content-exporter/issues) for bugs
- Comment on related issues

## Review Process

Once you submit a PR:

1. **Automated checks run:**
   - TypeScript compilation
   - Tests execution
   - Type checking

2. **Manual review:**
   - Code review by maintainer
   - Feedback and suggestions
   - Discussion of approach

3. **Approval:**
   - Changes approved
   - PR merged to main
   - Contributor added to acknowledgments

## Becoming a Maintainer

Consistent, high-quality contributions may earn you maintainer status:
- Write to maintainer expressing interest
- Demonstrate understanding of codebase
- Show commitment to project quality

## Releasing and Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### 1. Create a Changeset

If your changes require a new version (patch, minor, or major), create a changeset:

```bash
npm run changeset
```

Follow the prompts to select the bump type and provide a brief description.

### 2. Versioning (Maintainers Only)

To update versions and generate the changelog:

```bash
# Updates package.json and CHANGELOG.md
npm run version
```

### 3. Publishing to npm (Maintainers Only)

Ensure you are logged into npm (`npm login`), then run:

```bash
# Build, type-check, and publish
npm run publish-package
```

Alternatively, you can publish manually:

```bash
npm run build
npm publish --access public
```

### 4. Post-Publish

After publishing, push the new tags to GitHub:

```bash
git push origin main --tags
```


## CLI / npx

This project provides a small CLI (`wp-content-exporter`) that is exposed via `bin` in
`package.json`. You can run it locally during final testing with:

```bash
# after a successful build
node dist/cli.js --help

# run an export (example)
node dist/cli.js export \
  --endpoint https://example.com \
  --fields title.rendered,slug \
  --output ./posts.csv
```

To test the package as an npx user (local verification before publishing):

```bash
# create a packed tarball
npm pack

# run the CLI from the tarball with npx
npx ./wp-content-exporter-*.tgz export --endpoint https://example.com --fields title.rendered,slug --output ./posts.csv

# cleanup
rm wp-content-exporter-*.tgz
```

## Final testing & first publish (quick checklist)

1. Verify repository metadata in `package.json` (author, repository, bugs, homepage, license).
2. Run unit/integration tests and type checks:

```bash
npm run build
npm test
npm run type-check
```

3. Smoke-test the CLI locally:

```bash
node dist/cli.js --help
# (optional) run an export against a staging WordPress instance
```

4. Create a changeset describing the release (if not already created in the PR):

```bash
npm run changeset
# choose patch/minor/major and add a short description
```

5. For the *first* publish (maintainer action):

```bash
# update version/changelog locally
npm run version

# publish to npm (requires npm login or NPM_TOKEN)
npm publish --access public
```

Or use the automated workflow (requires `NPM_TOKEN` secret):

```text
# merge your PR to main; CI will run the release workflow which executes
# `npx changeset version` and `npx changeset publish` when changesets exist.
```

## How to raise PRs and update the package next time

- Create a feature/fix branch and implement changes in `src/`.
- Add or update tests in `tests/` and ensure they pass locally.
- Add a changeset if the change requires a release (`npm run changeset`).
- Open a PR with a descriptive title and link to the changeset file if present.
- CI will run build/tests/type-check on the PR; address any failures.
- After merge, the release workflow will pick up changesets and publish (if `NPM_TOKEN` is configured). If you prefer manual publishing, maintainers can run `npm run version` and `npm run publish-package` locally.

If you want me to also add a short `CONTRIBUTING.md` example that shows a minimal PR + changeset flow, I can add that.

## Useful Commands

```bash
# Build TypeScript
npm run build

# Run tests
npm test

# Type check
npm run type-check

# Run dev mode (uses ts-node)
npm run dev

# Create changeset for release
npm run changeset

# Update version (maintainers only)
npm run version

# Publish to npm (maintainers only)
npm run publish-package
```

## Project Structure

```
wp-content-exporter/
├── src/
│   ├── auth.ts       # Authentication header building
│   ├── fetch.ts      # WordPress API fetching
│   ├── csv.ts        # CSV generation
│   └── index.ts      # Main export
├── tests/test.ts     # Integration tests
├── dist/             # Compiled output (generated)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── README.md         # User documentation
├── CONTRIBUTING.md   # This file
└── CHANGELOG.md      # Version history
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [GitHub Guides](https://guides.github.com/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make wp-content-exporter better for everyone. We appreciate your time and effort! 🙏

---

Questions? Create an issue or start a discussion on GitHub.
