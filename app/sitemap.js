import { PROJECTS, SITE } from '@/content/site'

export default function sitemap() {
  const now = new Date()
  return [
    { url: SITE.url, lastModified: now },
    ...PROJECTS.map((p) => ({ url: `${SITE.url}/work/${p.slug}`, lastModified: now })),
  ]
}
