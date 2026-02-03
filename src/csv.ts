import { Parser } from "json2csv"

/**
 * Gets a nested value from an object using dot notation
 * 
 * @param {any} obj - Object to retrieve value from
 * @param {string} path - Dot-separated path (e.g., "title.rendered", "acf.price")
 * @returns {any} The value at the path, or undefined if not found
 * 
 * @example
 * const post = { title: { rendered: "Hello World" } }
 * getValue(post, "title.rendered") // => "Hello World"
 */
function getValue(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => o?.[k], obj)
}

/**
 * Converts an array of objects to CSV format using specified fields
 * Supports nested fields using dot notation
 * 
 * @param {any[]} items - Array of objects to convert
 * @param {string[]} fields - Field names to include in CSV (supports dot notation for nested fields)
 * @returns {string} CSV string
 * 
 * @throws {Error} If json2csv parsing fails
 * 
 * @example
 * const posts = [
 *   { title: { rendered: "Post 1" }, slug: "post-1" },
 *   { title: { rendered: "Post 2" }, slug: "post-2" }
 * ]
 * 
 * const csv = toCSV(posts, ["title.rendered", "slug"])
 * // Returns CSV with headers: title.rendered,slug
 */
export function toCSV(items: any[], fields: string[]): string {
  if (!items || items.length === 0) {
    return ""
  }

  const rows = items.map(item => {
    const row: Record<string, any> = {}
    for (const field of fields) {
      row[field] = getValue(item, field)
    }
    return row
  })

  try {
    const parser = new Parser({ fields })
    return parser.parse(rows)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`CSV parsing failed: ${error.message}`)
    }
    throw error
  }
}
