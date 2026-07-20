import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/posts'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  if (!post) return {}
  return { title: `${post.title} — Rishee Deshmukh`, description: post.excerpt }
}

function Markdown({ content }) {
  const blocks = content.trim().split('\n\n')
  return blocks.map((block, i) => {
    const b = block.trim()
    if (!b) return null
    if (b.startsWith('## ')) return <h2 key={i} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'24px',fontWeight:600,color:'#1B1B1B',margin:'36px 0 12px',lineHeight:1.3}}>{renderInline(b.slice(3))}</h2>
    if (b.startsWith('# ')) return <h1 key={i} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'32px',fontWeight:700,color:'#1B1B1B',margin:'40px 0 16px',lineHeight:1.3}}>{renderInline(b.slice(2))}</h1>
    if (b.startsWith('---')) return <hr key={i} style={{border:'none',borderTop:'1px solid rgba(27,27,27,0.1)',margin:'32px 0'}} />
    if (b.startsWith('> ')) return <blockquote key={i} style={{borderLeft:'3px solid #FC6F20',paddingLeft:'20px',margin:'24px 0',color:'#5A5A5A',fontStyle:'italic'}}><p style={{margin:0,lineHeight:1.85}}>{renderInline(b.slice(2))}</p></blockquote>
    if (b.startsWith('```')) {
      const lines = b.split('\n')
      const code = lines.slice(1, lines[lines.length-1] === '```' ? -1 : undefined).join('\n')
      return <pre key={i} style={{margin:'0 0 20px'}}><code style={{display:'block',background:'#1B1B1B',color:'#e4e0d8',padding:'20px 24px',borderRadius:'10px',fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",lineHeight:1.7,overflowX:'auto'}}>{code}</code></pre>
    }
    if (b.split('\n').every(l => l.trim().startsWith('- '))) {
      return <ul key={i} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px'}}>
        {b.split('\n').map((l,j) => <li key={j} style={{margin:'0 0 8px'}}>{renderInline(l.trim().slice(2))}</li>)}
      </ul>
    }
    if (b.split('\n').every(l => /^\d+\.\s/.test(l.trim()))) {
      return <ol key={i} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px'}}>
        {b.split('\n').map((l,j) => <li key={j} style={{margin:'0 0 8px'}}>{renderInline(l.trim().replace(/^\d+\.\s/,''))}</li>)}
      </ol>
    }
    return <p key={i} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px'}}>{renderInline(b)}</p>
  })
}

function renderInline(text) {
  const parts = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const codeMatch = remaining.match(/`([^`]+)`/)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    const italicMatch = remaining.match(/\*([^*]+)\*/)
    let earliest = null
    let type = null
    ;[['bold',boldMatch],['code',codeMatch],['link',linkMatch],['italic',italicMatch]].forEach(([t,m]) => {
      if (m && (earliest === null || m.index < earliest.index)) { earliest = m; type = t }
    })
    if (!earliest) { parts.push(remaining); break }
    if (earliest.index > 0) parts.push(remaining.slice(0, earliest.index))
    if (type === 'bold') parts.push(<strong key={key++} style={{color:'#1B1B1B',fontWeight:600}}>{earliest[1]}</strong>)
    else if (type === 'code') parts.push(<code key={key++} style={{background:'#F5F0EA',color:'#1B1B1B',padding:'2px 6px',borderRadius:'4px',fontSize:'15px',fontFamily:"'JetBrains Mono',monospace"}}>{earliest[1]}</code>)
    else if (type === 'link') parts.push(<a key={key++} href={earliest[2]} style={{color:'#FC6F20',textDecoration:'underline',textUnderlineOffset:'3px'}}>{earliest[1]}</a>)
    else if (type === 'italic') parts.push(<em key={key++} style={{color:'#5A5A5A'}}>{earliest[1]}</em>)
    remaining = remaining.slice(earliest.index + earliest[0].length)
  }
  return parts
}

export default function BlogPostPage({ params }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <div style={{minHeight:'100vh',background:'#FEF0CE',fontFamily:"'Aileron',sans-serif"}}>
      <nav style={{padding:'16px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(27,27,27,0.08)'}}>
        <Link href="/" style={{fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:'18px',color:'#1B1B1B',textDecoration:'none'}}>RD</Link>
        <Link href="/blog" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#FC6F20',textDecoration:'none'}}>← All posts</Link>
      </nav>
      <main style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px 80px'}}>
        <header style={{marginBottom:'40px'}}>
          <time style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'13px',color:'#999',display:'block',marginBottom:'12px'}}>
            {new Date(post.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
          </time>
          <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'36px',fontWeight:700,color:'#1B1B1B',margin:'0 0 16px',lineHeight:1.25}}>{post.title}</h1>
          {post.tags && (
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {post.tags.map(tag => (
                <span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#5A5A5A',background:'#F5F0EA',padding:'4px 10px',borderRadius:'4px'}}>{tag}</span>
              ))}
            </div>
          )}
        </header>
        <article><Markdown content={post.content} /></article>
        <footer style={{marginTop:'60px',paddingTop:'24px',borderTop:'1px solid rgba(27,27,27,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Link href="/blog" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#FC6F20',textDecoration:'none'}}>← All posts</Link>
          <Link href="/" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#6B6B6B',textDecoration:'none'}}>Back to portfolio</Link>
        </footer>
      </main>
    </div>
  )
}
