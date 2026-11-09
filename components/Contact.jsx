import ContactForm from './ContactForm'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { SITE } from '@/content/site'

export default function Contact() {
  return (
    <section id="contact" className="band" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="label">Contact</p>
        <h2 id="contact-h">Let’s <em>talk</em>.</h2>
        <div className="band-grid">
          <div className="band-links">
            <a className="email" href={`mailto:${SITE.email}`}><MailIcon /><span>{SITE.email}</span></a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon /><span>LinkedIn</span></a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer"><GitHubIcon /><span>GitHub</span></a>
            <a href={SITE.resume} download><DownloadIcon /><span>Résumé (PDF)</span></a>
          </div>
          {SITE.formspreeId ? (
            <ContactForm formId={SITE.formspreeId} />
          ) : (
            <p className="muted">The quickest way to reach me is by email.</p>
          )}
        </div>
      </div>
    </section>
  )
}
