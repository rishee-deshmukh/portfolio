import ContactForm from './ContactForm'
import { SITE } from '@/content/site'

export default function Contact() {
  return (
    <section id="contact" className="band" aria-labelledby="contact-h">
        <div className="wrap">
          <p className="label">Contact</p>
          <h2 id="contact-h">Let’s talk.</h2>
          <div className="band-grid">
            <div className="band-links">
              <a className="email" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={SITE.resume} download>Résumé (PDF)</a>
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
