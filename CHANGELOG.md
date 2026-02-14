# Changelog

## 0.1.1

### Patch Changes

- Updated md files

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-03

### Added

- Initial release of wp-content-exporter
- Core `exportToCSV()` function to fetch and export WordPress content
- Support for multiple authentication methods:
  - No authentication (public endpoints)
  - Basic Auth (username + application password)
  - Bearer Token (JWT)
  - Custom headers
- Automatic WordPress REST API pagination handling
- Nested field extraction with dot notation (e.g., `acf.price`)
- CSV generation with json2csv
- Full TypeScript support with strict type checking
- Comprehensive JSDoc documentation
- Unit tests for core functionality
- Error handling for fetch failures and invalid auth
- Support for all WordPress post types (posts, pages, custom types)
- ES modules (ESM) support for Node 18+

### Documentation

- Complete README with examples
- API reference documentation
- Authentication guide with examples
- Publishing guide for npm release
- Inline JSDoc comments for all functions

### Development Tools

- TypeScript configuration with strict settings
- Test suite with 8 test cases
- Changeset for version management
- Build scripts for TypeScript compilation
- Type checking and linting setup
