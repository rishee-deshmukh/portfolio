import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { SITE } from '@/content/site'

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo" aria-label={`${SITE.name}, home`}>RD</Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#work">Work</Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#contact">Contact</Link>
          <a className="nav-resume" href={SITE.resume} download>Résumé ↓</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
