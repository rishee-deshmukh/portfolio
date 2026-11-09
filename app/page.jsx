import Image from 'next/image'
import Link from 'next/link'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/Icons'
import {
  SITE, INTRO, PROJECTS, EXPERIENCE, EDUCATION, SKILLS, OFF_THE_CLOCK,
} from '@/content/site'

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  jobTitle: 'Software Engineer',
  email: `mailto:${SITE.email}`,
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Syracuse University' },
    { '@type': 'CollegeOrUniversity', name: 'Medi-Caps University' },
  ],
  sameAs: [SITE.github, SITE.linkedin],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="hero" aria-labelledby="top">
        <div className="wrap">
          <p className="label">{INTRO.eyebrow}</p>
          <div className="hero-name">
            <h1 id="top" className="display">
              Rishee <br /><span className="second">Deshmukh</span>
            </h1>
            <div className="portrait">
              <Image
                src="/portrait.webp"
                alt="Portrait of Rishee Deshmukh"
                width={640}
                height={640}
                priority
                sizes="(max-width: 760px) 104px, 248px"
              />
            </div>
          </div>
          <p className="lede">{INTRO.lede}</p>
          <div className="actions">
            <a className="btn btn-primary" href={SITE.resume} download><DownloadIcon />Download résumé</a>
            <a className="btn" href={`mailto:${SITE.email}`}><MailIcon />Email</a>
            <a className="btn" href={SITE.github} target="_blank" rel="noopener noreferrer"><GitHubIcon />GitHub</a>
            <a className="btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon />LinkedIn</a>
          </div>
          <ul className="proof">
            {INTRO.proof.map((p) => (
              <li key={p.head}>
                <div className="proof-head">{p.head}</div>
                <div className="proof-sub">{p.sub}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" className="section" aria-labelledby="work-h">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="label">Selected work</p>
            <h2 id="work-h">Things I have built and measured</h2>
          </div>
          <ol className="work-list">
            {PROJECTS.map((p, i) => (
              <li key={p.slug} className="reveal">
                <Link href={`/work/${p.slug}`} className="work-row">
                  <span className="work-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="work-title">{p.title}</span>
                    <span className="work-sum" style={{ display: 'block' }}>{p.summary}</span>
                  </span>
                  <span className="work-meta">
                    {p.tag} · {p.year}
                    <span className="work-arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="experience" className="section" aria-labelledby="exp-h">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="label">Experience</p>
            <h2 id="exp-h">Where I have worked</h2>
          </div>
          <div>
            {EXPERIENCE.map((r) => (
              <article key={r.org + r.dates} className="role reveal">
                <div className="role-dates">
                  {r.dates}
                  <br />
                  {r.place}
                </div>
                <div>
                  <h3>{r.role}</h3>
                  <p className="role-org">{r.org}</p>
                  <ul className="bullets">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="edu">
            <p className="label reveal" style={{ marginBottom: 'var(--space-3)' }}>Education</p>
            {EDUCATION.map((e) => (
              <article key={e.school} className="role reveal">
                <div className="role-dates">{e.dates}</div>
                <div>
                  <h3>{e.school}</h3>
                  <p className="role-org">
                    {e.degree}
                    {e.detail ? ` · ${e.detail}` : ''}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section" aria-labelledby="skills-h">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="label">Skills</p>
            <h2 id="skills-h">What I work with</h2>
          </div>
          <dl className="skills">
            {SKILLS.map((s) => (
              <div key={s.group} className="skill reveal">
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="off-the-clock" className="section off" aria-labelledby="off-h">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="label">Off the clock</p>
            <h2 id="off-h" className="sr-only">Off the clock</h2>
          </div>
          <p className="reveal">{OFF_THE_CLOCK.text}</p>
        </div>
      </section>

      <Contact />
      <Footer />
    </>
  )
}
