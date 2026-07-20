import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content/posts')

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))
  const posts = files.map(filename => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
    const { data } = matter(raw)
    return { slug, ...data }
  })
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPost(slug) {
  const safe = slug.replace(/[^a-zA-Z0-9\-_]/g, '')
  if (!safe || safe !== slug) return null
  const filePath = path.join(postsDir, `${safe}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, content }
}
