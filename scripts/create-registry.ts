import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as dotenv from 'dotenv'
import { syncChangelog } from './sync-changelog.js'
import { syncReadme } from './sync-readme.js'

interface RegistryItem {
  $schema: string
  name: string
  type: string
  title: string
  author: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: {
    path: string
    type: string
    target: string
  }[]
}

/**
 * Recursively replaces all occurrences of $REGURL with the appUrl in an object
 */
function replaceRegUrl(obj: any, appUrl: string): any {
  if (typeof obj === 'string') {
    return obj.replace(/\$REGURL/g, appUrl);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceRegUrl(item, appUrl));
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = replaceRegUrl(obj[key], appUrl);
    }
    return result;
  }

  return obj;
}

/**
 * Creates a registry.json file by combining all JSON files in the registry directory
 */
function createRegistry() {
  // Load environment variables from .env file
  dotenv.config();

  // Get APP_URL from environment variables
  const appUrl = process.env.APP_URL || '';
  if (!appUrl) {
    console.warn('⚠️ APP_URL not found in .env file, $REGURL will not be replaced');
  } else {
    console.log(`Using APP_URL: ${appUrl}`);
  }

  const componentsRegistryDir = path.join(process.cwd(), 'resources/js/components/twc-ui/registry')
  const hooksRegistryDir = path.join(process.cwd(), 'resources/js/hooks/registry')
  const outputPath = path.join(process.cwd(), 'registry.json')

  console.log('Creating registry from files in:')
  console.log('  - Components:', componentsRegistryDir)
  console.log('  - Hooks:', hooksRegistryDir)

  // Check if directories exist
  if (!fs.existsSync(componentsRegistryDir)) {
    console.error('❌ Components registry directory not found:', componentsRegistryDir)
    process.exit(1)
  }

  if (!fs.existsSync(hooksRegistryDir)) {
    console.warn('⚠️ Hooks registry directory not found:', hooksRegistryDir)
  }

  // Get all JSON files from both directories
  const componentFiles = fs.existsSync(componentsRegistryDir)
    ? fs.readdirSync(componentsRegistryDir)
        .filter(file => path.extname(file) === '.json')
        .map(file => ({ file, dir: componentsRegistryDir, type: 'component' }))
    : []

  const hookFiles = fs.existsSync(hooksRegistryDir)
    ? fs.readdirSync(hooksRegistryDir)
        .filter(file => path.extname(file) === '.json')
        .map(file => ({ file, dir: hooksRegistryDir, type: 'hook' }))
    : []

  const allFiles = [...componentFiles, ...hookFiles]

  console.log(`Found ${componentFiles.length} component JSON files`)
  console.log(`Found ${hookFiles.length} hook JSON files`)
  console.log(`Total: ${allFiles.length} JSON files`)

  // Create registry object with schema
  const registry = {
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "twc-ui",
    "homepage": "https://ui.twiceware.cloud",

    "items": [] as RegistryItem[]
  }

  // Process each file
  for (const fileInfo of allFiles) {
    const filePath = path.join(fileInfo.dir, fileInfo.file)
    console.log(`Processing ${fileInfo.type}: ${fileInfo.file}`)

    try {
      const content = fs.readFileSync(filePath, 'utf-8')

      // Skip empty files
      if (!content.trim()) {
        console.warn(`⚠️ Empty file: ${fileInfo.file}`)
        continue
      }

      let item = JSON.parse(content) as RegistryItem

      // Replace $REGURL with APP_URL if available
      if (appUrl) {
        item = replaceRegUrl(item, appUrl) as RegistryItem
      }

      item.author = 'Danny Spangenberg <danny.spangenberg@twiceware.de>'

      // Add the item to the items array
      registry.items.push(item)

      console.log(`✅ Added ${fileInfo.type} ${item.name} to registry`)
    } catch (error) {
      console.error(`❌ Error processing ${fileInfo.file}:`, error)
    }
  }

  // Write registry to file
  fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2))

  console.log('\n✅ Registry created successfully!')
  console.log('📁 Output:', outputPath)
  console.log('📄 Components in registry:', registry.items.length)

  // Create registry mapping for installation.tsx
  createRegistryMapping(registry.items)

  // Sync CHANGELOG.md and README.md
  console.log('\n📝 Syncing documentation files...')
  syncChangelog()
  syncReadme()
}

/**
 * Creates a registryMapping array for the installation.tsx component
 */
function createRegistryMapping(items: RegistryItem[]) {
  const outputPath = path.join(process.cwd(), 'resources/js/components/docs/registry-mapping.ts')

  const mappings = items
    .filter(item => item.registryDependencies && item.registryDependencies.length > 0)
    .flatMap(item =>
      item.registryDependencies!.map(dep => {
        // Extract component name from alias (@twc-ui/component-name)
        const componentName = dep.replace('@twc-ui/', '')
        const displayName = componentName.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')

        // Determine doc path based on component type (use-xxx = hook, otherwise component)
        const docType = componentName.startsWith('use-') ? 'hooks' : 'components'

        return {
          alias: dep,
          name: displayName,
          docPath: `/docs/${docType}/${componentName}`
        }
      })
    )
    // Remove duplicates
    .filter((mapping, index, self) =>
      index === self.findIndex(m => m.alias === mapping.alias)
    )
    .sort((a, b) => a.alias.localeCompare(b.alias))

  const content = `// Auto-generated by create-registry.ts
// Do not edit manually

export interface RegistryMapping {
  alias: string
  name: string
  docPath: string
}

export const registryMapping: RegistryMapping[] = ${JSON.stringify(mappings, null, 2)}
`

  fs.writeFileSync(outputPath, content)
  console.log(`\n✅ Registry mapping created successfully!`)
  console.log('📁 Output:', outputPath)
  console.log('📄 Mappings:', mappings.length)
}

// Script execution
const __filename = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === __filename

if (isMainModule) {
  createRegistry()
}

export { createRegistry }
