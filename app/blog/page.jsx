import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  title: 'Blog — Rishee Deshmukh',
  description: 'Technical writing on software engineering, AI systems, and building things.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{minHeight:'100vh',background:'#FEF0CE',fontFamily:"'Aileron',sans-serif"}}>
      <nav style={{padding:'16px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(27,27,27,0.08)'}}>
        <Link href="/" style={{fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:'18px',color:'#1B1B1B',textDecoration:'none'}}>RD</Link>
        <Link href="/" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#FC6F20',textDecoration:'none'}}>← Back to portfolio</Link>
      </nav>
      <main style={{maxWidth:'700px',margin:'0 auto',padding:'80px 24px'}}>
        <div style={{marginBottom:'48px'}}>
          <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'36px',fontWeight:700,color:'#1B1B1B',margin:'0 0 12px'}}>Blog</h1>
          <p style={{fontSize:'17px',color:'#6B6B6B',lineHeight:1.6,margin:0}}>Writing about what I'm building and what I'm learning.</p>
        </div>
        {posts.length === 0 ? (
          <p style={{color:'#999',fontSize:'15px'}}>No posts yet. Check back soon.</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'32px'}}>
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{textDecoration:'none'}}>
                <article style={{padding:'28px',borderRadius:'12px',background:'#FFF8E8',border:'1px solid rgba(27,27,27,0.06)',transition:'transform 0.2s ease, box-shadow 0.2s ease',cursor:'pointer'}}>
                  <time style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:'#999',display:'block',marginBottom:'8px'}}>
                    {new Date(post.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
                  </time>
                  <h2 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'22px',fontWeight:600,color:'#1B1B1B',margin:'0 0 8px'}}>{post.title}</h2>
                  <p style={{fontSize:'15px',color:'#6B6B6B',lineHeight:1.6,margin:'0 0 12px'}}>{post.excerpt}</p>
                  {post.tags && (
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#5A5A5A',background:'#F5F0EA',padding:'4px 10px',borderRadius:'4px'}}>{tag}</span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
