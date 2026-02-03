import { fetchAllPosts } from "./fetch.js"
import { toCSV } from "./csv.js"
import { AuthConfig } from "./auth.js"

/**
 * Options for exporting WordPress content to CSV
 * 
 * @typedef {Object} ExportOptions
 * @property {string} endpoint - WordPress site URL
 * @property {string} postType - Post type (posts, pages, custom types)
 * @property {string[]} fields - Fields to export (supports dot notation)
 * @property {AuthConfig} [auth] - Optional authentication config
 * @property {number} [perPage=100] - Items per API request
 * @property {string} [outputFile] - Optional file path to save CSV (if not provided, returns string)
 */
export type ExportOptions = {
  endpoint: string
  postType: string
  fields: string[]
  auth?: AuthConfig
  perPage?: number
  outputFile?: string
}

/**
 * Main function to export WordPress content to CSV
 * 
 * Fetches posts/pages/custom post types from WordPress REST API and converts to CSV format
 * Automatically handles pagination and flattens nested fields
 * 
 * @param {ExportOptions} options - Export configuration
 * @returns {Promise<string>} CSV string with headers and data rows
 * 
 * @throws {Error} If fetch fails, auth is invalid, or CSV generation fails
 * 
 * @example
 * // Return CSV as string
 * const csv = await exportToCSV({
 *   endpoint: "https://example.com",
 *   postType: "posts",
 *   fields: ["title.rendered", "slug", "date"]
 * })
 * console.log(csv)
 * 
 * @example
 * // Save to file
 * await exportToCSV({
 *   endpoint: "https://example.com",
 *   postType: "posts",
 *   fields: ["title.rendered", "slug"],
 *   outputFile: "./posts.csv"
 * })
 * console.log("Saved to posts.csv")
 */
export async function exportToCSV(options: ExportOptions): Promise<string> {
  const {
    endpoint,
    postType,
    fields,
    auth,
    perPage,
    outputFile
  } = options

  if (!endpoint) {
    throw new Error("Endpoint is required")
  }
  if (!postType) {
    throw new Error("Post type is required")
  }
  if (!fields || fields.length === 0) {
    throw new Error("At least one field is required")
  }

  const items = await fetchAllPosts(
    endpoint,
    postType,
    auth,
    perPage
  )

  if (items.length === 0) {
    console.warn("No items found for export")
  }

  const csv = toCSV(items, fields)

  // Save to file if outputFile is specified
  if (outputFile) {
    try {
      const fs = await import("fs/promises")
      await fs.writeFile(outputFile, csv, "utf-8")
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write to file ${outputFile}: ${error.message}`)
      }
      throw error
    }
  }

  return csv
}

// Re-export types for convenience
export type { AuthConfig } from "./auth.js"
