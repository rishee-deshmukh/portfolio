import Link from 'next/link'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getPost } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.frontmatter.title} — Rishee Deshmukh`,
    description: post.frontmatter.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
    components: {
      h1: (props) => <h1 {...props} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'32px',fontWeight:700,color:'#1B1B1B',margin:'40px 0 16px',lineHeight:1.3}} />,
      h2: (props) => <h2 {...props} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'24px',fontWeight:600,color:'#1B1B1B',margin:'36px 0 12px',lineHeight:1.3}} />,
      h3: (props) => <h3 {...props} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'20px',fontWeight:600,color:'#1B1B1B',margin:'28px 0 10px',lineHeight:1.3}} />,
      p: (props) => <p {...props} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px'}} />,
      ul: (props) => <ul {...props} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px'}} />,
      ol: (props) => <ol {...props} style={{fontSize:'17px',color:'#4A4A4A',lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px'}} />,
      li: (props) => <li {...props} style={{margin:'0 0 8px'}} />,
      a: (props) => <a {...props} style={{color:'#FC6F20',textDecoration:'underline',textUnderlineOffset:'3px'}} />,
      strong: (props) => <strong {...props} style={{color:'#1B1B1B',fontWeight:600}} />,
      em: (props) => <em {...props} style={{color:'#5A5A5A'}} />,
      blockquote: (props) => <blockquote {...props} style={{borderLeft:'3px solid #FC6F20',paddingLeft:'20px',margin:'24px 0',color:'#5A5A5A',fontStyle:'italic'}} />,
      hr: () => <hr style={{border:'none',borderTop:'1px solid rgba(27,27,27,0.1)',margin:'32px 0'}} />,
      code: (props) => {
        const isBlock = props.className
        if (isBlock) {
          return <code {...props} style={{display:'block',background:'#1B1B1B',color:'#e4e0d8',padding:'20px 24px',borderRadius:'10px',fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",lineHeight:1.7,overflowX:'auto',margin:'0 0 20px'}} />
        }
        return <code {...props} style={{background:'#F5F0EA',color:'#1B1B1B',padding:'2px 6px',borderRadius:'4px',fontSize:'15px',fontFamily:"'JetBrains Mono',monospace"}} />
      },
      pre: (props) => <pre {...props} style={{margin:'0 0 20px'}} />,
    },
  })

  return (
    <div style={{minHeight:'100vh',background:'#FEF0CE',fontFamily:"'Aileron',sans-serif"}}>
      <nav style={{padding:'16px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(27,27,27,0.08)'}}>
        <Link href="/" style={{fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:'18px',color:'#1B1B1B',textDecoration:'none'}}>
          RD
        </Link>
        <Link href="/blog" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#FC6F20',textDecoration:'none'}}>
          ← All posts
        </Link>
      </nav>

      <main style={{maxWidth:'700px',margin:'0 auto',padding:'60px 24px 80px'}}>
        <header style={{marginBottom:'40px'}}>
          <time style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'13px',color:'#999',display:'block',marginBottom:'12px'}}>
            {new Date(post.frontmatter.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
          </time>
          <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'36px',fontWeight:700,color:'#1B1B1B',margin:'0 0 16px',lineHeight:1.25}}>
            {post.frontmatter.title}
          </h1>
          {post.frontmatter.tags && (
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {post.frontmatter.tags.map(tag => (
                <span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#5A5A5A',background:'#F5F0EA',padding:'4px 10px',borderRadius:'4px'}}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article>
          {content}
        </article>

        <footer style={{marginTop:'60px',paddingTop:'24px',borderTop:'1px solid rgba(27,27,27,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Link href="/blog" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#FC6F20',textDecoration:'none'}}>
            ← All posts
          </Link>
          <Link href="/" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:'#6B6B6B',textDecoration:'none'}}>
            Back to portfolio
          </Link>
        </footer>
      </main>
    </div>
  )
}
