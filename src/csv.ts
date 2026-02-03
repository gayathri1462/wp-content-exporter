import { Parser } from "json2csv"

function getValue(obj: any, path: string) {
  return path.split(".").reduce((o, k) => o?.[k], obj)
}

export function toCSV(items: any[], fields: string[]) {
  const rows = items.map(item => {
    const row: Record<string, any> = {}
    for (const field of fields) {
      row[field] = getValue(item, field)
    }
    return row
  })

  const parser = new Parser({ fields })
  return parser.parse(rows)
}
