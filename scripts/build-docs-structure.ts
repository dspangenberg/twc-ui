import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

interface DocItem {
  title: string
  type: 'directory' | 'file'
  path: string
  route?: string
  children?: DocItem[]
  frontmatter?: Record<string, any>
}

function buildDocsStructure(basePath: string, relativePath = ''): DocItem[] {
  const items: DocItem[] = []
  const fullPath = path.join(basePath, relativePath)

  if (!fs.existsSync(fullPath)) {
    return items
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })

  // ERST Dateien sammeln
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

  // DANN Verzeichnisse sammeln
  const directories = entries.filter(entry => entry.isDirectory())
  for (const directory of directories) {
    const dirName = directory.name
    const childPath = relativePath ? `${relativePath}/${dirName}` : dirName

    // Rekursiv Kinder laden
    const children = buildDocsStructure(basePath, childPath)

    // Das erste Dokument finden (wichtig: NACH dem Sortieren!)
    const sortedChildren = sortItems(children)
    const firstDoc = findFirstDocument(sortedChildren)

    console.log(`\nProcessing directory: ${dirName}`)
    console.log(`Child path: ${childPath}`)
    console.log(`Children count: ${children.length}`)
    console.log(`First doc found: ${firstDoc ? firstDoc.route : 'NONE'}`)
    if (sortedChildren.length > 0) {
      console.log('Sorted children:')
      sortedChildren.forEach((child, i) => {
        console.log(
          `  ${i + 1}. ${child.type}: ${child.title} (order: ${child.frontmatter?.order || 'none'}) -> ${child.route}`
        )
      })
    }

    const item: DocItem = {
      title: formatTitle(dirName),
      type: 'directory',
      path: childPath,
      route: firstDoc?.route,
      children: sortedChildren.length > 0 ? sortedChildren : undefined
    }

    items.push(item)
  }

  return sortItems(items)
}

function sortItems(items: DocItem[]): DocItem[] {
  return items.sort((a, b) => {
    // 1. Explizite order aus frontmatter (NIEDRIGSTE ZAHL = ERSTE)
    const aOrder = typeof a.frontmatter?.order === 'number' ? a.frontmatter.order : 999
    const bOrder = typeof b.frontmatter?.order === 'number' ? b.frontmatter.order : 999

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    // 2. Spezielle Namen-Prioritäten
    const priorityOrder: Record<string, number> = {
      // Getting Started Reihenfolge
      introduction: 1,
      installation: 2,
      'client-side-routing': 3,

      // Components Reihenfolge
      button: 1,
      'base-button': 2,
      form: 10,

      // Directory Prioritäten
      'getting-started': 1,
      components: 2,
      hooks: 3,
      legal: 99
    }

    const aName = (a.path.split('/').pop() || '').toLowerCase()
    const bName = (b.path.split('/').pop() || '').toLowerCase()

    const aPriority = priorityOrder[aName] ?? 50
    const bPriority = priorityOrder[bName] ?? 50

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // 3. Dateien vor Verzeichnissen auf gleicher Ebene
    if (a.type !== b.type) {
      return a.type === 'file' ? -1 : 1
    }

    // 4. Alphabetisch
    return a.title.localeCompare(b.title)
  })
}

function formatTitle(name: string): string {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function extractFrontmatter(filePath: string): Record<string, any> {
  const content = fs.readFileSync(filePath, 'utf-8')

  try {
    const parsed = matter(content)
    return parsed.data
  } catch (error) {
    console.warn(`Warning: Could not parse frontmatter in ${filePath}:`, error)
    return {}
  }
}

// KORRIGIERTE findFirstDocument Funktion - sucht das erste nach order sortierte Element
function findFirstDocument(items: DocItem[]): DocItem | undefined {
  console.log(`Looking for first document in ${items.length} items:`)

  // Items sind bereits sortiert - nimm das erste File
  for (const item of items) {
    console.log(
      `  - ${item.type}: ${item.title} (order: ${item.frontmatter?.order || 'none'}) route: ${item.route}`
    )
    if (item.type === 'file' && item.route) {
      console.log(`    -> Found first file: ${item.route}`)
      return item
    }
  }

  // Wenn keine Files, dann rekursiv in Verzeichnissen suchen (ebenfalls sortiert)
  for (const item of items) {
    if (item.type === 'directory' && item.children && item.children.length > 0) {
      console.log(`  -> Searching in directory: ${item.title}`)
      const firstDoc = findFirstDocument(item.children)
      if (firstDoc) {
        console.log(`    -> Found in subdirectory: ${firstDoc.route}`)
        return firstDoc
      }
    }
  }

  console.log('  -> No document found')
  return undefined
}

// Debug-Ausgabe verbessern
function debugStructure(items: DocItem[], indent = 0) {
  const prefix = '  '.repeat(indent)
  for (const item of items) {
    const routeInfo = item.route ? `-> ${item.route}` : '-> NO ROUTE'
    const orderInfo = item.frontmatter?.order ? ` [${item.frontmatter.order}]` : ''
    console.log(
      `${prefix}${item.type === 'directory' ? '📁' : '📄'} ${item.title}${orderInfo} ${routeInfo}`
    )
    if (item.children) {
      debugStructure(item.children, indent + 1)
    }
  }
}

// Script ausführen
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

  console.log('\n📋 Final structure:')
  debugStructure(structure)

  const outputPath = path.join(process.cwd(), 'public/docs-structure.json')
  const publicDir = path.dirname(outputPath)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2))

  console.log('\n✅ Docs structure built successfully!')
  console.log('📁 Output:', outputPath)
  console.log('📄 Found', structure.length, 'items')
}

export { buildDocsStructure, type DocItem }
