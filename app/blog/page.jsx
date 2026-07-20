"use client";
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import BlogShell, { useBlogTheme } from './BlogShell'

function PostList(){
  const t=useBlogTheme();const posts=getAllPosts();
  return(
    <>
      <div style={{marginBottom:'48px'}}>
        <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'36px',fontWeight:700,color:t.text,margin:'0 0 12px'}}>Blog</h1>
        <p style={{fontSize:'17px',color:t.textMuted,lineHeight:1.6,margin:0}}>Writing about what I'm building and what I'm learning.</p>
      </div>
      {posts.length===0?(
        <p style={{color:t.textFaint,fontSize:'15px'}}>No posts yet. Check back soon.</p>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:'32px'}}>
          {posts.map(post=>(
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{textDecoration:'none'}}>
              <article style={{padding:'28px',borderRadius:'12px',background:t.card,border:`1px solid ${t.border}`,transition:'transform 0.2s ease, box-shadow 0.2s ease',cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                <time style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:t.textFaint,display:'block',marginBottom:'8px'}}>
                  {new Date(post.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
                </time>
                <h2 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'22px',fontWeight:600,color:t.text,margin:'0 0 8px'}}>{post.title}</h2>
                <p style={{fontSize:'15px',color:t.textMuted,lineHeight:1.6,margin:'0 0 12px'}}>{post.excerpt}</p>
                {post.tags&&(
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {post.tags.map(tag=>(
                      <span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:t.tagText,background:t.tagBg,padding:'4px 10px',borderRadius:'4px'}}>{tag}</span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default function BlogPage(){
  return <BlogShell><PostList/></BlogShell>
}
