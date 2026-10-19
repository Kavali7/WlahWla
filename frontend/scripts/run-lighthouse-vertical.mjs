import http from 'http'
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'

const distDir = path.resolve('dist')
const HOST = '127.0.0.1'

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${HOST}`)
    let filePath = path.join(distDir, decodeURIComponent(url.pathname))
    if (!filePath.startsWith(distDir)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html')
    }
    const ext = path.extname(filePath)
    res.setHeader('Content-Type', mimeTypes[ext] ?? 'text/plain')
    const stream = fs.createReadStream(filePath)
    stream.on('error', (error) => {
      res.statusCode = 500
      res.end(error.message)
    })
    stream.pipe(res)
  })
}

const server = createServer()

server.listen(0, HOST, () => {
  const { port } = server.address()
  const outputFile = 'lighthouse-vertical.json'
  const outputPathArg = `--output-path=${outputFile}`
  const resolvedOutputFile = path.resolve(outputFile)
  const chromeFlags = [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ]
  const args = [
    'lighthouse',
    `http://${HOST}:${port}/verticals/retail`,
    '--preset=desktop',
    '--quiet',
    `--chrome-flags=${chromeFlags.join(' ')}`,
    '--max-wait-for-load=60000',
    '--output=json',
    outputPathArg,
  ]

  const npxCmd = process.platform === 'win32' ? 'cmd.exe' : 'npx'
  const npxArgs = process.platform === 'win32' ? ['/c', 'npx', ...args] : args

  const result = spawnSync(npxCmd, npxArgs, { encoding: 'utf-8' })

  server.close(() => {
    if (result.error) {
      console.error(result.error)
      process.exit(1)
      return
    }

    if (result.status !== 0) {
      console.error(result.stdout)
      console.error(result.stderr)
      process.exit(result.status ?? 1)
      return
    }

    const reportRaw = fs.readFileSync(resolvedOutputFile, 'utf-8')
    const report = JSON.parse(reportRaw)

    const scores = {
      performance: Math.round((report.categories.performance.score ?? 0) * 100),
      accessibility: Math.round((report.categories.accessibility.score ?? 0) * 100),
      bestPractices: Math.round((report.categories['best-practices']?.score ?? 0) * 100),
      seo: Math.round((report.categories.seo?.score ?? 0) * 100),
    }

    console.log(
      `Lighthouse retail desktop -> Performance ${scores.performance}, Accessibilite ${scores.accessibility}, Best practices ${scores.bestPractices}, SEO ${scores.seo}`,
    )

    fs.unlinkSync(resolvedOutputFile)
    process.exit(0)
  })
})
