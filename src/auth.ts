export type AuthConfig =
  | { type: "none" }
  | { type: "basic"; username: string; password: string }
  | { type: "bearer"; token: string }
  | { type: "headers"; headers: Record<string, string> }

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
