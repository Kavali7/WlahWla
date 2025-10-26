import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const WEB_ASSETS_DIR = path.resolve('public/assets/brand')

async function listAssets(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listAssets(entryPath)))
    } else {
      files.push(entryPath)
    }
  }
  return files
}

async function main() {
  try {
    const assets = await listAssets(WEB_ASSETS_DIR)
    if (assets.length === 0) {
      console.log('Aucun fichier trouve dans public/assets/brand. Ajoutez vos visuels avant optimisation.')
      return
    }
    console.log('Assets detectes pour optimisation:')
    for (const file of assets) {
      const { size } = await stat(file)
      console.log(` - ${path.relative(process.cwd(), file)} (${Math.round(size / 1024)} kB)`)
    }
    console.log('\nTODO: installez une solution type `sharp` ou `imagemin` pour compresser ces fichiers.')
    console.log('Exemple : npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo')
    console.log('Puis adaptez ce script pour traiter les assets detectes.')
  } catch (error) {
    console.error('Impossible de scanner les assets:', error)
    process.exitCode = 1
  }
}

main()
