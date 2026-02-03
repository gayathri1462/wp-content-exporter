import { exportToCSV } from "./src/index.js"
import fs from "fs"

const run = async () => {
  const csv = await exportToCSV({
    endpoint: "https://public-api.wordpress.com",
    postType: "sites/en.blog.wordpress.com/posts",
    fields: ["title.rendered", "slug"]
  })

  fs.writeFileSync("test.csv", csv)
}

run()
