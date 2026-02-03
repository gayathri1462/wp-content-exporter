# Quick Reference Guide

## Installation

```bash
npm install wp-content-exporter
```

## Usage

### Get CSV as String

```typescript
import { exportToCSV } from "wp-content-exporter"

const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug"]
})

console.log(csv)
```

### Save to File (Recommended)

```typescript
import { exportToCSV } from "wp-content-exporter"

await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered", "slug", "date"],
  outputFile: "./posts.csv"  // ← Saves automatically
})
```

### With Authentication

```typescript
// Basic Auth
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "basic",
    username: "admin",
    password: "app-password"
  }
})

// Bearer Token
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "bearer",
    token: "jwt-token-here"
  }
})

// Custom Headers
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: ["title.rendered"],
  auth: {
    type: "headers",
    headers: { "X-API-Key": "secret" }
  }
})
```

### Nested Fields

```typescript
const csv = await exportToCSV({
  endpoint: "https://example.com",
  postType: "posts",
  fields: [
    "title.rendered",
    "acf.price",
    "acf.product.name",
    "meta.custom_field"
  ]
})
```

## Common Fields

| Field | Description |
|-------|-------------|
| `id` | Post ID |
| `title.rendered` | Post title |
| `content.rendered` | Post content |
| `excerpt.rendered` | Post excerpt |
| `slug` | URL slug |
| `date` | Publication date |
| `status` | Post status |
| `author` | Author ID |
| `acf.*` | ACF fields |
| `meta.*` | Custom meta fields |

## Error Handling

```typescript
try {
  const csv = await exportToCSV({
    endpoint: "https://example.com",
    postType: "posts",
    fields: ["title.rendered"]
  })
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

## Development

```bash
# Build
npm run build

# Tests
npm test

# Type check
npm run type-check

# Dev mode
npm run dev
```

## Publishing

```bash
# Create changeset
npm run changeset

# Update version
npm run version

# Publish
npm run publish-package
```

## API Reference

### `exportToCSV(options: ExportOptions): Promise<string>`

Exports WordPress content to CSV format.

**Parameters:**
- `endpoint` (string): WordPress URL
- `postType` (string): Content type to export
- `fields` (string[]): Fields to include
- `auth?` (AuthConfig): Authentication config
- `perPage?` (number): Items per request (default: 100)

**Returns:** CSV string

**Throws:** Error on fetch/auth failure

### `AuthConfig` Type

```typescript
type AuthConfig =
  | { type: "none" }
  | { type: "basic"; username: string; password: string }
  | { type: "bearer"; token: string }
  | { type: "headers"; headers: Record<string, string> }
```

## File Structure

```
src/
├── index.ts      Main export (exportToCSV)
├── auth.ts       Authentication (buildHeaders)
├── fetch.ts      API fetching (fetchAllPosts)
└── csv.ts        CSV generation (toCSV)
```

## Requirements

- Node.js 18+
- npm 9+

## Links

- 📦 [npm Package](https://www.npmjs.com/package/wp-content-exporter)
- 📖 [GitHub Repository](https://github.com/yourusername/wp-content-exporter)
- 📚 [Full Documentation](README.md)
- 🚀 [Publishing Guide](PUBLISHING.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

## License

MIT
