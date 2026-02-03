/**
 * Authentication configuration options for WordPress REST API
 * 
 * @typedef {Object} AuthConfig
 * @property {string} type - Authentication type: "none", "basic", "bearer", or "headers"
 */
export type AuthConfig =
  | { type: "none" }
  | { type: "basic"; username: string; password: string }
  | { type: "bearer"; token: string }
  | { type: "headers"; headers: Record<string, string> }

/**
 * Builds HTTP headers including authentication if provided
 * 
 * @param {AuthConfig} [auth] - Optional authentication configuration
 * @returns {HeadersInit} Headers object with authentication applied
 * 
 * @example
 * // Basic auth
 * const headers = buildHeaders({ 
 *   type: "basic", 
 *   username: "admin", 
 *   password: "password" 
 * })
 * 
 * @example
 * // Bearer token
 * const headers = buildHeaders({ 
 *   type: "bearer", 
 *   token: "eyJhbGc..." 
 * })
 */
export function buildHeaders(auth?: AuthConfig): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (!auth || auth.type === "none") return headers

  if (auth.type === "basic") {
    const token = Buffer
      .from(`${auth.username}:${auth.password}`)
      .toString("base64")
    headers.Authorization = `Basic ${token}`
  }

  if (auth.type === "bearer") {
    headers.Authorization = `Bearer ${auth.token}`
  }

  if (auth.type === "headers") {
    Object.assign(headers, auth.headers)
  }

  return headers
}
