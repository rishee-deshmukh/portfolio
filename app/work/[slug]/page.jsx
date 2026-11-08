import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import { PROJECTS, SITE } from '@/content/site'

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const p = PROJECTS.find((x) => x.slug === params.slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${SITE.name}`, description: p.summary, url: `${SITE.url}/work/${p.slug}` },
  }
}

export default function CaseStudy({ params }) {
  const i = PROJECTS.findIndex((x) => x.slug === params.slug)
  if (i === -1) notFound()
  const p = PROJECTS[i]
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(i + 1) % PROJECTS.length]

  return (
    <>
      <article className="case">
        <div className="wrap">
          <Link href="/#work" className="back">← All work</Link>
          <p className="label" style={{ marginTop: 'var(--space-5)' }}>{p.tag} · {p.year}</p>
          <h1 className="display">{p.title}</h1>
          <p className="lede">{p.summary}</p>
          <ul className="case-meta" aria-label="Technologies">
            {p.stack.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
          </ul>
          {p.links.length > 0 && (
            <div className="case-links">
              {p.links.map((l) => (
                <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}

          <div className="case-body">
            {p.sections.map((s) => (
              <section key={s.heading} className="case-sec">
                <h2>{s.heading}</h2>
                <div className="prose">
                  {s.body && s.body.map((t) => <p key={t}>{t}</p>)}
                  {s.bullets && (
                    <ul className="bullets">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {s.stats && (
                    <dl className="stats">
                      {s.stats.map((st) => (
                        <div key={st.label}>
                          <dd className="stat-value" style={{ margin: 0 }}>{st.value}</dd>
                          <dt className="stat-label">{st.label}</dt>
                        </div>
                      ))}
                    </dl>
                  )}
                  {s.note && <p className="note">{s.note}</p>}
                </div>
              </section>
            ))}
          </div>

          {p.privateNote && <p className="note" style={{ marginTop: 'var(--space-5)' }}>{p.privateNote}</p>}

          <nav className="case-nav" aria-label="More work">
            <Link href={`/work/${prev.slug}`} className="back">← {prev.title}</Link>
            <Link href={`/work/${next.slug}`} className="back">{next.title} →</Link>
          </nav>
        </div>
      </article>
      <Footer />
    </>
  )
}
