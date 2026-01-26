import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

/**
 * Syncs CHANGELOG.md in the root with changelog.mdx in docs
 */
function syncChangelog() {
  const changelogMdxPath = path.join(
    process.cwd(),
    'resources/js/docs/getting-started/changelog.mdx'
  )
  const changelogMdPath = path.join(process.cwd(), 'CHANGELOG.md')

  console.log('Syncing changelog...')
  console.log('Source:', changelogMdxPath)
  console.log('Target:', changelogMdPath)

  if (!fs.existsSync(changelogMdxPath)) {
    console.error('❌ Source changelog.mdx not found:', changelogMdxPath)
    process.exit(1)
  }

  // Read the MDX file and extract content without frontmatter
  const mdxContent = fs.readFileSync(changelogMdxPath, 'utf-8')
  const parsed = matter(mdxContent)

  // Write the content (without frontmatter) to CHANGELOG.md
  fs.writeFileSync(changelogMdPath, parsed.content.trim() + '\n')

  console.log('✅ Changelog synced successfully!')
  console.log('📁 Output:', changelogMdPath)
}

// Script execution
const __filename = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === __filename

if (isMainModule) {
  syncChangelog()
}

export { syncChangelog }
