import './globals.css'
import { Bodoni_Moda, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { SITE } from '@/content/site'
import Header from '@/components/Header'
import RevealObserver from '@/components/RevealObserver'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  adjustFontFallback: false,
  display: 'swap',
  variable: '--font-bodoni',
})
const inter = Inter_Tight({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], display: 'swap', variable: '--font-mono-face' })

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
    <html lang="en" className={`${bodoni.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
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
