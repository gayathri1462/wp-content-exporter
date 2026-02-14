# wp-content-exporter

[![npm version](https://img.shields.io/npm/v/wp-content-exporter.svg)](https://www.npmjs.com/package/wp-content-exporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Export WordPress CMS data to CSV format, perfect for headless CMS setups and Framer integration.

Automatically handles WordPress REST API pagination, supports multiple authentication methods, and flattens nested JSON fields to create clean, spreadsheet-friendly CSV output.

## Features

- 📦 **Simple API** - One function call to export WordPress content
- 🔐 **Multiple Auth Methods** - Basic auth, Bearer tokens, or custom headers
- 📄 **Nested Field Support** - Flatten ACF fields and nested objects using dot notation
- 🔄 **Auto Pagination** - Automatically handles WordPress REST API pagination
- 📊 **CSV Export** - Clean CSV generation with json2csv
- 🎯 **TypeScript** - Full type safety with strict TypeScript support
- 🚀 **ESM** - Native ES modules support (Node 18+)

## Installation

```bash
npm install wp-content-exporter
```

## Quick Start

### Get CSV as String
```typescript
import { exportToCSV } from "wp-content-exporter"

const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug", "date"]
})

console.log(csv)
```

### Save Directly to File
```typescript
import { exportToCSV } from "wp-content-exporter"

await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug", "date"],
  outputFile: "./posts.csv"  // ← Saves automatically
})

console.log("✓ Saved to posts.csv")
```

## Usage

### Basic Export (No Authentication)

```typescript
import { exportToCSV } from "wp-content-exporter"

const csv = await exportToCSV({
  endpoint: "https://example.wordpress.com",
  postType: "posts",
  fields: ["title.rendered", "slug"]
})

console.log(csv)
```

### Save to File (Recommended for Large Exports)

```typescript
// Simply add outputFile option
await exportToCSV({
  endpoint: "https://example.wordpress.com",
  postType: "posts",
  fields: ["title.rendered", "slug"],
  outputFile: "./posts.csv"  // ← CSV saves directly
})
```

### With Basic Authentication

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "content.rendered"],
  auth: {
    type: "basic",
    username: "admin",
    password: "application-password" // Use app password, not your login password
  }
})
```

### With Bearer Token

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug"],
  auth: {
    type: "bearer",
    token: "your-jwt-token-here"
  }
})
```

### With Custom Headers

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug"],
  auth: {
    type: "headers",
    headers: {
      "Authorization": "Bearer xyz",
      "X-Custom-Header": "value"
    }
  }
})
```

### Nested Fields and ACF

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: [
    "title.rendered",
    "acf.price",
    "acf.product.name",
    "meta.custom_field",
    "author"
  ]
})
```

### Pagination Control

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug"],
  perPage: 50 // Default is 100, max 100
})
```

### Custom Post Types

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "custom-post-type", // or "pages"
  fields: ["title.rendered", "slug"]
})
```

## API Reference

### `exportToCSV(options: ExportOptions): Promise<string>`

Main function to export WordPress content to CSV.

#### Parameters

- **endpoint** (string, required): Your WordPress site URL
  - Example: `"https://example.com"`
  - Must be accessible and have WordPress REST API enabled

- **postType** (string, required): Type of content to export
  - Default types: `"posts"`, `"pages"`
  - Custom post types: Use your custom post type slug

- **fields** (string[], required): Fields to include in the CSV
  - Supports dot notation for nested fields
  - Example: `["title.rendered", "acf.price"]`

- **auth** (AuthConfig, optional): Authentication configuration
  - Options: `"none"` (default), `"basic"`, `"bearer"`, `"headers"`

- **perPage** (number, optional): Items per API request (default: `100`, max: `100`)

- **outputFile** (string, optional): File path to save CSV
  - If provided, CSV is written to file and returned
  - If omitted, CSV is only returned as string
  - Useful for large exports

#### Returns

- `Promise<string>`: CSV-formatted string with headers and data rows

#### Throws

- `Error` if endpoint is invalid
- `Error` if postType is missing
- `Error` if no fields provided
- `Error` if API request fails
- `Error` if authentication fails

### `AuthConfig` Type

```typescript
type AuthConfig =
  | { type: "none" }
  | { type: "basic"; username: string; password: string }
  | { type: "bearer"; token: string }
  | { type: "headers"; headers: Record<string, string> }
```

## Authentication Guide

### No Authentication
For public WordPress sites without private content:
```typescript
// No auth needed, just omit the `auth` parameter
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug"]
})
```

### Basic Auth (Username + Application Password)
1. Generate an Application Password in WordPress:
   - Go to Users → Your Profile → Application Passwords
   - Create a new password (WordPress 5.6+)
   
2. Use it in your code:
```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "basic",
    username: "your-username",
    password: "xxxx xxxx xxxx xxxx" // Your app password
  }
})
```

### Bearer Token (JWT)
For sites using JWT authentication plugins:
```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "bearer",
    token: "eyJhbGciOiJIUzI1NiIs..."
  }
})
```

### Custom Headers
For custom authentication schemes:
```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "headers",
    headers: {
      "X-API-Key": "your-api-key",
      "Authorization": "Custom your-custom-auth"
    }
  }
})
```

## Examples

### Export Posts to File

```typescript
import { exportToCSV } from "wp-content-exporter"

async function exportPosts() {
  // Simple: just specify outputFile
  await exportToCSV({
    endpoint: "https://example.com",
    postType: "posts",
    fields: [
      "id",
      "title.rendered",
      "slug",
      "date",
      "excerpt.rendered"
    ],
    outputFile: "./posts.csv"
  })

  console.log("✓ Exported to posts.csv")
}

exportPosts().catch(console.error)
```

### Export with Error Handling

```typescript
async function exportSafely() {
  try {
    const csv = await exportToCSV({
      endpoint: "https://example.com",
      postType: "posts",
      fields: ["title.rendered", "slug"],
      auth: {
        type: "basic",
        username: "admin",
        password: process.env.WP_PASSWORD
      },
      outputFile: "./posts.csv"
    })

    const rowCount = csv.split('\n').length - 1
    console.log(`✓ Exported ${rowCount} rows to posts.csv`)
  } catch (error) {
    console.error("❌ Export failed:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
```

### Batch Export Multiple Post Types

```typescript
async function exportAll() {
  const postTypes = ["posts", "pages", "products"]
  
  for (const postType of postTypes) {
    await exportToCSV({
      endpoint: "https://example.com",
      postType,
      fields: ["title.rendered", "slug", "date"],
      outputFile: `./${postType}.csv`
    })
    
    console.log(`✓ Exported ${postType}`)
  }
}
```

## Common Field Names

### Standard WordPress Fields
- `id` - Post ID
- `title.rendered` - Post title
- `content.rendered` - Post content
- `excerpt.rendered` - Post excerpt
- `slug` - URL slug
- `date` - Publication date
- `status` - Post status (publish, draft, etc)
- `author` - Author ID
- `featured_media` - Featured image ID

### ACF Fields
- `acf.{field_name}` - Simple ACF fields
- `acf.{group}.{field}` - Grouped ACF fields
- `meta.{field_name}` - Custom meta fields

## Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm equivalents)

## TypeScript Support

This package includes full TypeScript definitions. Type checking is strict by default:

```typescript
import { exportToCSV, AuthConfig } from "wp-content-exporter"

// Type-safe configuration
const options: ExportOptions = {
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "basic",
    username: "admin",
    password: "password"
  }
}

const csv: string = await exportToCSV(options)
```

## Performance Tips

1. **Pagination**: Large exports use pagination automatically. Adjust `perPage` for optimal speed:
   ```typescript
   // For large datasets
   perPage: 100 // Maximum allowed by WordPress
   ```

2. **Field Selection**: Only export fields you need:
   ```typescript
   // ✓ Good - minimal fields
   fields: ["title.rendered", "slug"]
   
   // ✗ Bad - includes unnecessary data
   fields: ["title", "content", "excerpt", "author", "meta", "acf"]
   ```

3. **Batch Exports**: For multiple post types, call sequentially:
   ```typescript
   const posts = await exportToCSV({ /* posts */ })
   const pages = await exportToCSV({ /* pages */ })
   ```

## Error Handling

The package throws descriptive errors:

```typescript
try {
  const csv = await exportToCSV({
    endpoint: "invalid-url",
    postType: "posts",
    fields: ["title"]
  })
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
    // "Failed to fetch from invalid-url/wp-json/wp/v2/posts: ..."
  }
}
```

Common errors:
- **"Endpoint is required"** - Missing endpoint URL
- **"WordPress REST API error: 401"** - Authentication failed
- **"WordPress REST API error: 403"** - Access denied
- **"WordPress REST API error: 404"** - Post type not found
- **"Failed to fetch"** - Network or endpoint unavailable

## Development

### Setup

```bash
git clone https://github.com/gayathri1462/wp-content-exporter.git
cd wp-content-exporter
npm install
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

### Run Tests

```bash
npm test
```

### Run Dev Mode

```bash
npm run dev
```

## Publishing

This package uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Create a Changeset

```bash
npm run changeset
```

This will prompt you to:
1. Select the package
2. Choose version bump type (patch, minor, major)
3. Add a description of changes

The changeset is saved in `.changeset/` folder.

### Version Update

```bash
npm run version
```

This:
- Updates `package.json` version
- Updates `CHANGELOG.md`
- Creates git tags

### Publish to npm

```bash
npm run publish-package
```

Or manually:

```bash
npm publish
```

### Full Publish Workflow

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 2. Create changeset
npm run changeset

# 3. Update version and changelog
npm run version

# 4. Publish to npm
npm run publish-package

# 5. Push to GitHub
git push origin main --tags
```

## License

MIT

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- 📦 [npm Package](https://www.npmjs.com/package/wp-content-exporter)
- 📖 [GitHub Repository](https://github.com/gayathri1462/wp-content-exporter)
- 📚 [Full Documentation](README.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.
