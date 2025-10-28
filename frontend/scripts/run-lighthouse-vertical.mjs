import { preview } from "vite"
import { spawnSync } from "child_process"
import path from "path"

const server = await preview({ preview: { host: "127.0.0.1", port: 4173 } })

const baseDir = path.dirname(process.execPath)
const cmd = process.platform === "win32" ? path.join(baseDir, "npx.cmd") : "npx"
const args = [
  "lighthouse",
  "http://127.0.0.1:4173/verticals/retail",
  "--preset=desktop",
  "--quiet",
  "--chrome-flags=--headless"
]

let result
if (process.platform === "win32") {
  const command = `"${cmd}" ${args.join(' ')}`
  result = spawnSync(command, { stdio: "inherit", shell: true })
} else {
  result = spawnSync(cmd, args, { stdio: "inherit" })
}

await server.httpServer.close()

if (result.error) {
  console.error(result.error)
}

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
