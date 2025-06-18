import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

interface DocItem {
  title: string;
  type: 'directory' | 'file';
  path: string;
  route?: string;
  children?: DocItem[];
  frontmatter?: Record<string, any>;
}

function buildDocsStructure (basePath: string, relativePath: string = ''): DocItem[] {
  const items: DocItem[] = []
  const fullPath = path.join(basePath, relativePath)

  if (!fs.existsSync(fullPath)) {
    return items
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })

  // Verzeichnisse verarbeiten
  const directories = entries.filter(entry => entry.isDirectory())
  for (const directory of directories) {
    const dirName = directory.name
    const childPath = relativePath ? `${relativePath}/${dirName}` : dirName

    const item: DocItem = {
      title: formatTitle(dirName),
      type: 'directory',
      path: childPath,
      children: buildDocsStructure(basePath, childPath)
    }

    items.push(item)
  }

  // MDX-Dateien verarbeiten
  const files = entries.filter(entry => entry.isFile() && path.extname(entry.name) === '.mdx')
  for (const file of files) {
    const fileName = path.parse(file.name).name
    const filePath = relativePath ? `${relativePath}/${fileName}` : fileName
    const fullFilePath = path.join(fullPath, file.name)

    const frontmatter = extractFrontmatter(fullFilePath)

    const item: DocItem = {
      title: frontmatter.title || formatTitle(fileName),
      type: 'file',
      path: filePath,
      route: `/docs/${filePath}`,
      frontmatter
    }

    items.push(item)
  }

  return items
}

function formatTitle (name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

function extractFrontmatter (filePath: string): Record<string, any> {
  const content = fs.readFileSync(filePath, 'utf-8')

  const frontmatterMatch = content.match(/^---\s*\n(.*?)\n---\s*\n/s)
  if (!frontmatterMatch) {
    return {}
  }

  const frontmatterContent = frontmatterMatch[1]
  const frontmatter: Record<string, any> = {}
  const lines = frontmatterContent.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmedLine.substring(0, colonIndex).trim()
    let value = trimmedLine.substring(colonIndex + 1).trim()

    // Anführungszeichen entfernen
    value = value.replace(/^["']|["']$/g, '')

    // Arrays handhaben
    if (key === 'tags' && value.includes('[')) {
      value = value.replace(/[\[\]"']/g, '')
      frontmatter[key] = value.split(',').map(tag => tag.trim())
    }
    // Zahlen-Felder parsen (order)
    else if (key === 'order' && !isNaN(Number(value))) {
      frontmatter[key] = Number(value)
    }
    // Boolean-Felder parsen
    else if (value === 'true' || value === 'false') {
      frontmatter[key] = value === 'true'
    } else {
      frontmatter[key] = value
    }
  }

  return frontmatter
}

// Prüfen ob das Script direkt ausgeführt wird
const __filename = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === __filename

if (isMainModule) {
  const docsPath = path.join(process.cwd(), 'resources/js/docs')

  console.log('Building docs structure...')
  console.log('Docs path:', docsPath)

  if (!fs.existsSync(docsPath)) {
    console.error('❌ Docs directory not found:', docsPath)
    process.exit(1)
  }

  const structure = buildDocsStructure(docsPath)

  // Struktur in JSON-Datei speichern
  const outputPath = path.join(process.cwd(), 'public/docs-structure.json')

  // Sicherstellen, dass das public-Verzeichnis existiert
  const publicDir = path.dirname(outputPath)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2))

  console.log('✅ Docs structure built successfully!')
  console.log('📁 Output:', outputPath)
  console.log('📄 Found', structure.length, 'items')
}

export { buildDocsStructure, type DocItem }
