import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <>
      <div className="case">
        <div className="wrap">
          <p className="label">404</p>
          <h1 className="display" style={{ marginTop: 'var(--space-4)' }}>Page not found</h1>
          <p className="lede">That page does not exist, or it has moved.</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/">Back to the home page</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
