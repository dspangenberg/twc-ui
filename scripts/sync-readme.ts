import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

/**
 * Syncs README.md in the root with introduction.mdx in docs
 */
function syncReadme() {
  const introductionMdxPath = path.join(process.cwd(), 'resources/js/docs/getting-started/introduction.mdx')
  const readmeMdPath = path.join(process.cwd(), 'README.md')

  console.log('Syncing readme...')
  console.log('Source:', introductionMdxPath)
  console.log('Target:', readmeMdPath)

  if (!fs.existsSync(introductionMdxPath)) {
    console.error('❌ Source introduction.mdx not found:', introductionMdxPath)
    process.exit(1)
  }

  // Read the MDX file and extract content without frontmatter
  const mdxContent = fs.readFileSync(introductionMdxPath, 'utf-8')
  const parsed = matter(mdxContent)

  // Write the content (without frontmatter) to README.md
  fs.writeFileSync(readmeMdPath, parsed.content.trim() + '\n')

  console.log('✅ Readme synced successfully!')
  console.log('📁 Output:', readmeMdPath)
}

// Script execution
const __filename = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === __filename

if (isMainModule) {
  syncReadme()
}

export { syncReadme }
