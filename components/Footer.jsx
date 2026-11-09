import { SITE } from '@/content/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">© {new Date().getFullYear()} {SITE.name}</div>
    </footer>
  )
}
