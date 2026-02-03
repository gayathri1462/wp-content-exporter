import { buildHeaders, AuthConfig } from "./auth.js"

/**
 * Fetches all posts/pages/custom post types from WordPress REST API with automatic pagination
 * 
 * @param {string} endpoint - WordPress site URL (e.g., "https://example.com")
 * @param {string} postType - Post type to fetch (e.g., "posts", "pages", "custom-type")
 * @param {AuthConfig} [auth] - Optional authentication configuration
 * @param {number} [perPage=100] - Number of items per page (max 100)
 * @returns {Promise<any[]>} Array of all posts across all pages
 * 
 * @throws {Error} If the fetch request fails or returns non-ok status
 * 
 * @example
 * const posts = await fetchAllPosts(
 *   "https://example.com",
 *   "posts",
 *   { type: "basic", username: "admin", password: "xxx" }
 * )
 */
export async function fetchAllPosts(
  endpoint: string,
  postType: string,
  auth?: AuthConfig,
  perPage = 100
): Promise<any[]> {
  let page = 1
  let results: any[] = []

  while (true) {
    const url = `${endpoint}/wp-json/wp/v2/${postType}?per_page=${perPage}&page=${page}`
    
    try {
      const res = await fetch(url, { headers: buildHeaders(auth) })

      if (!res.ok) {
        throw new Error(`WordPress REST API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json() as any[]
      
      if (!Array.isArray(data) || data.length === 0) break

      results = results.concat(data)
      page++
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from ${url}: ${error.message}`)
      }
      throw error
    }
  }

  return results
}
