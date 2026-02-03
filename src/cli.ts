#!/usr/bin/env node

import { program } from "commander"
import { existsSync, writeFileSync } from "fs"
import { resolve } from "path"
import { exportToCSV } from "./index.js"

const version = "0.1.0"

program
  .name("wp-content-exporter")
  .description("Export WordPress content to CSV from the command line")
  .version(version)

program
  .command("export")
  .description("Export WordPress content to CSV")
  .option("-e, --endpoint <url>", "WordPress endpoint URL (required)")
  .option("-t, --post-type <type>", "Post type to export (default: posts)", "posts")
  .option("-f, --fields <fields>", "Fields to export (comma-separated, required)")
  .option("-o, --output <file>", "Output file path (required)")
  .option("-u, --username <username>", "Basic auth username")
  .option("-p, --password <password>", "Basic auth password")
  .option("-b, --bearer <token>", "Bearer token for JWT auth")
  .option("--per-page <number>", "Items per page (default: 100)", "100")
  .action(async (options) => {
    try {
      // Validate required options
      if (!options.endpoint) {
        console.error("❌ Error: --endpoint is required")
        console.log("Usage: wp-content-exporter export --endpoint <url> --fields <fields> --output <file>")
        process.exit(1)
      }

      if (!options.fields) {
        console.error("❌ Error: --fields is required")
        console.log("Example: --fields title.rendered,slug,date")
        process.exit(1)
      }

      if (!options.output) {
        console.error("❌ Error: --output is required")
        console.log("Example: --output posts.csv")
        process.exit(1)
      }

      // Parse fields
      const fields = options.fields
        .split(",")
        .map((f: string) => f.trim())
        .filter((f: string) => f.length > 0)

      if (fields.length === 0) {
        console.error("❌ Error: No valid fields provided")
        process.exit(1)
      }

      // Build auth config
      let auth: any = undefined
      if (options.username && options.password) {
        auth = {
          type: "basic",
          username: options.username,
          password: options.password
        }
      } else if (options.bearer) {
        auth = {
          type: "bearer",
          token: options.bearer
        }
      }

      // Show progress
      console.log("📦 Exporting WordPress content...")
      console.log(`   Endpoint: ${options.endpoint}`)
      console.log(`   Post type: ${options.postType}`)
      console.log(`   Fields: ${fields.join(", ")}`)
      console.log(`   Output: ${options.output}`)
      if (auth) {
        console.log(`   Auth: ${auth.type}`)
      }
      console.log("")

      // Export
      const csv = await exportToCSV({
        endpoint: options.endpoint,
        postType: options.postType,
        fields,
        auth,
        perPage: parseInt(options.perPage),
        outputFile: resolve(options.output)
      })

      // Count rows
      const rowCount = csv.split("\n").length - 1

      console.log(`✅ Export complete!`)
      console.log(`   Rows: ${rowCount}`)
      console.log(`   File: ${resolve(options.output)}`)
    } catch (error) {
      console.error("❌ Export failed:")
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Help for export command
program
  .command("example")
  .description("Show example usage")
  .action(() => {
    console.log(`
📝 EXAMPLES:

1. Export public posts:
   wp-content-exporter export \\
     --endpoint https://example.com \\
     --fields title.rendered,slug \\
     --output posts.csv

2. Export with basic authentication:
   wp-content-exporter export \\
     --endpoint https://example.com \\
     --post-type posts \\
     --fields title.rendered,content.rendered \\
     --username admin \\
     --password app-password \\
     --output posts.csv

3. Export with bearer token:
   wp-content-exporter export \\
     --endpoint https://example.com \\
     --bearer your-jwt-token \\
     --fields title.rendered,slug \\
     --output posts.csv

4. Export with nested fields (ACF):
   wp-content-exporter export \\
     --endpoint https://example.com \\
     --fields title.rendered,acf.price,acf.product.name \\
     --output products.csv

5. Use with npx (no installation):
   npx wp-content-exporter export \\
     --endpoint https://example.com \\
     --fields title.rendered,slug \\
     --output posts.csv
    `)
  })

program.parse(process.argv)

// Show help if no command provided
if (process.argv.length < 3) {
  program.help()
}
