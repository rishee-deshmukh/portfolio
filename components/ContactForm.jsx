'use client'
import { useState } from 'react'
import { ArrowIcon, CheckIcon } from './Icons'

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

  if (status === 'sent') {
    return (
      <div className="form-panel">
        <div className="form-done" role="status">
          <span className="badge"><CheckIcon /></span>
          <h3>Message sent</h3>
          <p className="muted">Thank you. I will reply as soon as I can.</p>
          <button type="button" className="btn" onClick={() => setStatus('idle')}>Send another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-panel">
      <form className="form" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" name="name" autoComplete="name" placeholder="Your name" required />
          </div>
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="cf-message">Message</label>
          <textarea id="cf-message" name="message" placeholder="What would you like to talk about?" required />
        </div>
        <div className="hp" aria-hidden="true">
          <label>
            Leave this empty
            <input name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="btn btn-primary btn-send" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <ArrowIcon />
        </button>
        <p className="form-status" role="status" aria-live="polite">
          {status === 'error' && 'That did not go through. Please try again, or email me directly.'}
        </p>
      </form>
    </div>
  )
}
