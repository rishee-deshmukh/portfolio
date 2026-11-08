'use client'
import { useState } from 'react'

// Posts to Formspree. The honeypot field (_gotcha) is hidden from people and
// assistive tech; bots that fill it are ignored by Formspree.
export default function ContactForm({ formId }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (res.ok) {
        form.reset()
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required />
      </div>
      <div className="hp" aria-hidden="true">
        <label>
          Leave this empty
          <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status === 'sent' && 'Message sent. Thank you, I will reply soon.'}
        {status === 'error' && 'That did not go through. Please try again, or email me directly.'}
      </p>
    </form>
  )
}
