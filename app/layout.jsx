import './globals.css'
import { Inter, Newsreader } from 'next/font/google'
import { SITE } from '@/content/site'
import Header from '@/components/Header'
import RevealObserver from '@/components/RevealObserver'

// Fallback only: Apple devices use San Francisco through the system font stack.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

// Serif used only for the hero name: it pairs with San Francisco and adds the
// editorial note. Variable weight with the optical-size axis so large sizes
// get the finer display cut.
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], display: 'swap', variable: '--font-name', axes: ['opsz'], adjustFontFallback: false })

const title = `${SITE.name} — ${SITE.role}`

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description: SITE.description },
}

// Runs before first paint: restores a saved theme choice (otherwise the
// system setting applies through CSS) and flags that JS is available.
const initScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}document.documentElement.classList.add('js')`

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <RevealObserver />
      </body>
    </html>
  )
}
