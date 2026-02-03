import { fetchAllPosts } from "./fetch.js"
import { toCSV } from "./csv.js"
import { AuthConfig } from "./auth.js"

export type ExportOptions = {
  endpoint: string
  postType: string
  fields: string[]
  auth?: AuthConfig
  perPage?: number
}

export async function exportToCSV(options: ExportOptions) {
  const items = await fetchAllPosts(
    options.endpoint,
    options.postType,
    options.auth,
    options.perPage
  )

  return toCSV(items, options.fields)
}
