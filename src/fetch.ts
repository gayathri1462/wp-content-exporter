import { buildHeaders, AuthConfig } from "./auth.js"

export async function fetchAllPosts(
  endpoint: string,
  postType: string,
  auth?: AuthConfig,
  perPage = 100
) {
  let page = 1
  let results: any[] = []

  while (true) {
    const url = `${endpoint}/wp-json/wp/v2/${postType}?per_page=${perPage}&page=${page}`
    const res = await fetch(url, { headers: buildHeaders(auth) })

    if (!res.ok) {
      throw new Error(`WP fetch failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break

    results = results.concat(data)
    page++
  }

  return results
}
