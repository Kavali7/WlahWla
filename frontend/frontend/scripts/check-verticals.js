const http = require('http')
const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, '../dist')
const agents = [
  { name: 'desktop', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  { name: 'mobile', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' },
]
const slugs = ['retail', 'accounting', 'services', 'agencies']

function sendFile(filePath, res) {
  const stream = fs.createReadStream(filePath)
  stream.on('error', () => {
    res.statusCode = 500
    res.end('error')
  })
  stream.pipe(res)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  let filePath = path.join(distDir, url.pathname)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html')
  }
  sendFile(filePath, res)
})

server.listen(4173, '127.0.0.1', async () => {
  try {
    for (const slug of slugs) {
      for (const agent of agents) {
        const response = await fetch(`http://127.0.0.1:4173/verticals/${slug}`, {
          headers: { 'User-Agent': agent.ua },
        })
        const body = await response.text()
        console.log(`${slug} ${agent.name} status=${response.status} bytes=${body.length}`)
      }
    }
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    server.close(() => process.exit())
  }
})
