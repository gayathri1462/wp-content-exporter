import fs from "fs"

const version = process.argv[2] || "Unreleased"
const date = new Date().toISOString().split("T")[0]

const entry = `
## ${version} - ${date}
- Initial release
`

const path = "CHANGELOG.md"

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, "# Changelog\n")
}

fs.appendFileSync(path, entry)
console.log("Changelog updated")
