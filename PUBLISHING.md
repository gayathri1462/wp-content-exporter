# Publishing Guide for wp-content-exporter

Complete guide to prepare, test, and publish this package to npm.

## Table of Contents

1. [Pre-Publishing Checklist](#pre-publishing-checklist)
2. [Local Testing](#local-testing)
3. [Creating Changesets](#creating-changesets)
4. [Version Management](#version-management)
5. [Publishing to npm](#publishing-to-npm)
6. [After Publishing](#after-publishing)

## Pre-Publishing Checklist

### 1. Setup Repository

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/yourusername/wp-content-exporter.git
git push -u origin main
```

### 2. Configure package.json

Update these fields in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/wp-content-exporter"
  },
  "bugs": {
    "url": "https://github.com/yourusername/wp-content-exporter/issues"
  },
  "homepage": "https://github.com/yourusername/wp-content-exporter#readme"
}
```

### 3. Create GitHub Account

- Go to [github.com](https://github.com)
- Sign up if you don't have an account
- Create a public repository named `wp-content-exporter`

### 4. Create npm Account

- Go to [npmjs.com](https://www.npmjs.com)
- Sign up for a free account
- Verify your email

### 5. Configure npm Authentication

```bash
# Login to npm
npm login

# This will prompt for:
# - Username
# - Password
# - Email
# - One-time password (if 2FA enabled)

# Verify login
npm whoami
```

## Local Testing

### Build the Project

```bash
npm run build
```

Expected output: No errors, `dist/` folder created with compiled JavaScript and TypeScript declarations.

### Run Tests

```bash
npm test
```

Expected output: All tests pass (8/8).

### Test Installation

Create a test directory to simulate installation:

```bash
# Create test directory
mkdir test-package-install
cd test-package-install
npm init -y

# Install from local file (absolute path)
npm install ../wp-content-exporter

# Create test file
cat > test.js << 'EOF'
import { exportToCSV } from "wp-content-exporter"

console.log("✓ Package imported successfully")
console.log("✓ exportToCSV is a function:", typeof exportToCSV === "function")
EOF

# Run test
node --input-type=module -e "import('./test.js')"

# Cleanup
cd ..
rm -rf test-package-install
```

### Verify Package Contents

Check what will be published:

```bash
npm pack
# This creates a .tgz file with package contents
# Extract and inspect:
tar -tzf wp-content-exporter-0.1.0.tgz | head -20

# Cleanup
rm wp-content-exporter-0.1.0.tgz
```

## Final local verification (recommended)

Before publishing, perform a final local verification to ensure the CLI and package behave as expected.

```bash
# Build and type-check
npm run build
npm run type-check

# Run tests
npm test

# Smoke-test CLI
node dist/cli.js --help
# Optional: run an export against a staging WP instance
node dist/cli.js export --endpoint https://staging.example.com --fields title.rendered,slug --output ./staging-posts.csv
```

## Local npx test (verify publish artifact locally)

Test the package as an npx user before publishing by creating a tarball and running it with `npx`:

```bash
# Create a packed tarball of the package
npm pack

# Run the CLI from the tarball using npx
npx ./wp-content-exporter-*.tgz export --endpoint https://example.com --fields title.rendered,slug --output ./posts.csv

# Inspect outputs and cleanup
rm wp-content-exporter-*.tgz
```


## Creating Changesets

Changesets track changes and automatically update versions and changelogs.

### Create Your First Changeset

```bash
npm run changeset
```

This will prompt:

1. **Select package**: (typically just one - wp-content-exporter)
2. **Version bump type**:
   - `patch` - Bug fixes (0.1.0 → 0.1.1)
   - `minor` - New features (0.1.0 → 0.2.0)
   - `major` - Breaking changes (0.1.0 → 1.0.0)
3. **Description**: Describe your changes

Example:
```
packages selected: wp-content-exporter
bumping version from 0.1.0 to 0.2.0

Describe your changes: "Add JSDoc documentation and improved error handling"
```

### What Gets Created

A new file in `.changeset/` like `crazy-ants-123.md`:

```markdown
---
"wp-content-exporter": minor
---

Add JSDoc documentation and improved error handling
```

### Multiple Changesets

For multiple changes before publishing:

```bash
npm run changeset
# Creates: .changeset/silly-monkeys-456.md

npm run changeset
# Creates: .changeset/tiny-tigers-789.md

# All will be combined when you version
```

## Version Management

### Update Versions

Once changesets are ready, update package version and changelog:

```bash
npm run version
```

This will:
- ✅ Update `package.json` version
- ✅ Update `CHANGELOG.md`
- ✅ Remove changeset files
- ✅ Create git commit (requires git)

Example commit message:
```
Publish wp-content-exporter 0.2.0
```

### Manual Version Update (if needed)

If `npm run version` fails:

```bash
# Update version manually in package.json
npm version 0.2.0

# Update CHANGELOG.md manually with:
# - Version header: ## 0.2.0 (2026-02-03)
# - List of changes
# - Date in format YYYY-MM-DD
```

## Publishing to npm

### Option 1: Automated with Changeset (Recommended)

```bash
npm run publish-package
```

This will:
- ✅ Publish to npm registry
- ✅ Create git tag (v0.2.0)
- ✅ Push tags to GitHub

### Option 2: Manual Publishing

```bash
# Build
npm run build

# Type check
npm run type-check

# Verify package contents
npm pack

# Publish
npm publish
```

### Verify Publication

Check npm registry:

```bash
# Via CLI
npm view wp-content-exporter

# Should show:
# wp-content-exporter@0.2.0

# Via web browser
# https://www.npmjs.com/package/wp-content-exporter
```

## After Publishing

### Push to GitHub

```bash
# If not done automatically:
git push origin main
git push origin --tags
```

### Create GitHub Release

```bash
# On GitHub:
# 1. Go to Releases
# 2. Click "Draft a new release"
# 3. Select tag (v0.2.0)
# 4. Add title: "Release 0.2.0"
# 5. Add description from CHANGELOG.md
# 6. Publish release
```

### Update README

If needed, update:
- Installation instructions (confirm version works)
- Links to examples
- Usage documentation

### Announce Publication

Share on:
- Twitter / X
- Dev.to
- LinkedIn
- Relevant Discord/Slack communities

Example tweet:
```
📦 Just published wp-content-exporter v0.2.0 to npm!

Export WordPress content to CSV with full TypeScript support.
✨ Features: Multiple auth methods, nested fields, auto-pagination

🔗 https://www.npmjs.com/package/wp-content-exporter
📖 https://github.com/yourusername/wp-content-exporter
```

## Complete Publishing Workflow

### Step-by-Step

```bash
# 1. Make changes to code
git checkout -b feature/your-feature
# ... make changes ...

# 2. Commit changes
git add .
git commit -m "feat: describe your changes"

# 3. Create changeset
npm run changeset

# 4. Push branch
git push origin feature/your-feature

# 5. Create Pull Request on GitHub
# (or merge directly to main)

# 6. Merge to main
git checkout main
git pull origin main

# 7. Update versions
npm run version

# 8. Publish to npm
npm run publish-package

# 9. Push to GitHub
git push origin main --tags
```

### Example Timeline

```
Day 1:
  - npm run changeset
  - git push
  
Day 2:
  - Code review
  - Merge to main

Day 3:
  - npm run version
  - npm run publish-package
  - Create GitHub release
  - Announce on Twitter
```

### Common publish error: EUNSCOPED

If you see an error like:

```
EUNSCOPED Can't restrict access to unscoped packages.
```

It means the publish step attempted to set restricted access on an unscoped package (package names without an `@scope/` prefix). To fix:

1. Ensure `package.json` has `publishConfig.access` set to `public` for unscoped packages:

```json
"publishConfig": { "access": "public" }
```

2. Or publish explicitly with public access:

```bash
npm publish --access public
```

The repository includes `publishConfig.access: "public"` so `changeset publish` and `npm publish` will not try to set restricted access for this unscoped package.


## First publish (manual maintainer flow)

For the very first publish, maintainers typically perform these steps locally:

```bash
# 1. Ensure you are logged into npm or have an automation token
npm login

# 2. Create a changeset describing the release (if not created in the PR)
npm run changeset

# 3. Update versions and changelog locally
npm run version

# 4. Run final verification and smoke tests
npm run build
npm test
npm run type-check
node dist/cli.js --help

# 5. Create a package tarball and optionally smoke-run it with npx
npm pack
npx ./wp-content-exporter-*.tgz --help

# 6. Publish to npm
npm publish --access public

# 7. Push tags and changes
git push origin main --tags
```

## Automated publish (CI)

To fully automate publishing on merges to `main`, use the provided GitHub Actions workflow and set an `NPM_TOKEN` repository secret:


1. Create an npm automation token:

```bash
# Create a new automation token (you'll be prompted by npm if using CLI):
npm token create
# Or create one via https://www.npmjs.com/settings/<your-username>/tokens
```

2. In GitHub, go to Repository → Settings → Secrets and create a new Actions secret named `NPM_TOKEN` with the token value.

3. This repository uses a two-step release process:

  - `release-version.yml` (runs on push to `main`) will execute `npx changeset version`, commit version/changelog updates, and push them back to `main`.
  - `release-publish.yml` (runs on push tags matching `v*.*.*`) will run `npx changeset publish` authenticated via `NPM_TOKEN` to publish the package.

This tag-based publish flow is safer because publishing only occurs after a maintainer creates a version tag (for example `git tag v0.2.0 && git push origin v0.2.0`), giving you a manual checkpoint before releases.

Notes:
- To publish automatically on merge without manual tagging, change `release-publish.yml` trigger to `push: branches: [ main ]` (but be cautious: automatic publishes can be surprising). 
- If the workflow needs to push commits/tags to protected branches, ensure the Actions bot has appropriate permissions and branch rules allow the push, or configure the workflow to open a PR instead of pushing.

## Local publish with NPM token (option examples)

If you prefer to publish locally using an npm token instead of `npm login`, you can configure your environment temporarily.

Option A — write token to your user `~/.npmrc` (convenient, but persistent until removed):

```bash
export NPM_TOKEN="your-token-here"
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
# publish
npm publish --access public
# remove token when done
rm ~/.npmrc
```

Option B — set token in npm config (safer to remove later):

```bash
export NPM_TOKEN="your-token-here"
npm config set //registry.npmjs.org/:_authToken "${NPM_TOKEN}"
# publish
npm publish --access public
# cleanup
npm config delete //registry.npmjs.org/:_authToken
unset NPM_TOKEN
```

Both options will authenticate the publish command non-interactively. We added `publishConfig.access: "public"` in `package.json` so `npm publish` will publish as public by default for this unscoped package.


## Troubleshooting

### npm publish fails with "401"

```bash
# Check login status
npm whoami

# If not logged in
npm login

# Verify you own the package name
npm view wp-content-exporter
```

### Version already published

```bash
# Can't republish same version
# Either:
# 1. Use npm publish with --tag
npm publish --tag beta

# 2. Or bump version first
npm run version
npm run publish-package
```

### Build errors before publish

```bash
# Run checks
npm run type-check
npm run build

# Fix any errors in src/*.ts
# Then try again
```

### Changeset not created

```bash
# Ensure .changeset exists
ls -la .changeset/

# If missing, reinitialize
npx changeset init

# Try again
npm run changeset
```

## Best Practices

1. **Before Publishing:**
   - ✅ Run `npm run build`
   - ✅ Run `npm test`
   - ✅ Run `npm run type-check`
   - ✅ Review all files in dist/
   - ✅ Test installation locally

2. **Semantic Versioning:**
   - `MAJOR` - Breaking changes (1.0.0)
   - `MINOR` - New features (0.2.0)
   - `PATCH` - Bug fixes (0.1.1)

3. **Changelog:**
   - Keep it updated automatically via Changesets
   - Include issue numbers
   - Group by type (Features, Fixes, Docs)

4. **Frequency:**
   - Publish regularly (monthly)
   - Group related changes
   - Don't rush major versions

5. **Communication:**
   - Announce on social media
   - Update GitHub releases
   - Add migration guides for breaking changes

## Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

## License

MIT - See LICENSE file
