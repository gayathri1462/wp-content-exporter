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
