import './globals.css'

export const metadata = {
  title: 'Rishee Deshmukh | Software Engineer',
  description: 'Portfolio of Rishee Deshmukh — Software Engineer building at the intersection of security, AI systems, and web infrastructure.',
  keywords: ['Software Engineer', 'Full-Stack', 'React', 'Python', 'AI', 'Security', 'Portfolio'],
  authors: [{ name: 'Rishee Deshmukh' }],
  openGraph: {
    title: 'Rishee Deshmukh | Software Engineer',
    description: 'Building at the intersection of security, AI systems, and web infrastructure.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
