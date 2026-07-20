"use client";
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getPost } from '@/lib/posts'
import BlogShell, { useBlogTheme } from '../BlogShell'

function Markdown({content}){
  const t=useBlogTheme();
  const blocks=content.trim().split('\n\n');
  return blocks.map((block,i)=>{
    const b=block.trim();if(!b)return null;
    if(b.startsWith('## '))return <h2 key={i} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'24px',fontWeight:600,color:t.text,margin:'36px 0 12px',lineHeight:1.3}}>{renderInline(b.slice(3),t)}</h2>
    if(b.startsWith('# '))return <h1 key={i} style={{fontFamily:"'Satoshi',sans-serif",fontSize:'32px',fontWeight:700,color:t.text,margin:'40px 0 16px',lineHeight:1.3}}>{renderInline(b.slice(2),t)}</h1>
    if(b.startsWith('---'))return <hr key={i} style={{border:'none',borderTop:`1px solid ${t.hrColor}`,margin:'32px 0'}}/>
    if(b.startsWith('> '))return <blockquote key={i} style={{borderLeft:`3px solid ${t.bqBorder}`,paddingLeft:'20px',margin:'24px 0',color:t.bqText,fontStyle:'italic'}}><p style={{margin:0,lineHeight:1.85,textAlign:'justify'}}>{renderInline(b.slice(2),t)}</p></blockquote>
    if(b.startsWith('```')){const lines=b.split('\n');const code=lines.slice(1,lines[lines.length-1]==='```'?-1:undefined).join('\n');
      return <pre key={i} style={{margin:'0 0 20px'}}><code style={{display:'block',background:t.codeBg,color:t.codeText,padding:'20px 24px',borderRadius:'10px',fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",lineHeight:1.7,overflowX:'auto'}}>{code}</code></pre>}
    if(b.split('\n').every(l=>l.trim().startsWith('- ')))
      return <ul key={i} style={{fontSize:'17px',color:t.textBody,lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px',textAlign:'justify'}}>{b.split('\n').map((l,j)=><li key={j} style={{margin:'0 0 8px'}}>{renderInline(l.trim().slice(2),t)}</li>)}</ul>
    if(b.split('\n').every(l=>/^\d+\.\s/.test(l.trim())))
      return <ol key={i} style={{fontSize:'17px',color:t.textBody,lineHeight:1.85,margin:'0 0 20px',paddingLeft:'24px',textAlign:'justify'}}>{b.split('\n').map((l,j)=><li key={j} style={{margin:'0 0 8px'}}>{renderInline(l.trim().replace(/^\d+\.\s/,''),t)}</li>)}</ol>
    return <p key={i} style={{fontSize:'17px',color:t.textBody,lineHeight:1.85,margin:'0 0 20px',textAlign:'justify'}}>{renderInline(b,t)}</p>
  })
}

function renderInline(text,t){
  const parts=[];let remaining=text,key=0;
  while(remaining.length>0){
    const bm=remaining.match(/\*\*(.+?)\*\*/),cm=remaining.match(/`([^`]+)`/),lm=remaining.match(/\[([^\]]+)\]\(([^)]+)\)/),im=remaining.match(/\*([^*]+)\*/);
    let earliest=null,type=null;
    [['bold',bm],['code',cm],['link',lm],['italic',im]].forEach(([tp,m])=>{if(m&&(earliest===null||m.index<earliest.index)){earliest=m;type=tp}});
    if(!earliest){parts.push(remaining);break}
    if(earliest.index>0)parts.push(remaining.slice(0,earliest.index));
    if(type==='bold')parts.push(<strong key={key++} style={{color:t.strong,fontWeight:600}}>{earliest[1]}</strong>);
    else if(type==='code')parts.push(<code key={key++} style={{background:t.inCodeBg,color:t.inCodeText,padding:'2px 6px',borderRadius:'4px',fontSize:'15px',fontFamily:"'JetBrains Mono',monospace"}}>{earliest[1]}</code>);
    else if(type==='link')parts.push(<a key={key++} href={earliest[2]} style={{color:t.accent,textDecoration:'underline',textUnderlineOffset:'3px'}}>{earliest[1]}</a>);
    else if(type==='italic')parts.push(<em key={key++} style={{color:t.em}}>{earliest[1]}</em>);
    remaining=remaining.slice(earliest.index+earliest[0].length)}
  return parts}

function PostContent(){
  const t=useBlogTheme();const params=useParams();
  const post=getPost(params.slug);
  if(!post)return <p style={{color:t.textFaint}}>Post not found.</p>;
  return(
    <>
      <header style={{marginBottom:'40px'}}>
        <time style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'13px',color:t.textFaint,display:'block',marginBottom:'12px'}}>
          {new Date(post.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
        </time>
        <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:'36px',fontWeight:700,color:t.text,margin:'0 0 16px',lineHeight:1.25}}>{post.title}</h1>
        {post.tags&&(
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {post.tags.map(tag=>(<span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:t.tagText,background:t.tagBg,padding:'4px 10px',borderRadius:'4px'}}>{tag}</span>))}
          </div>
        )}
      </header>
      <article><Markdown content={post.content}/></article>
      <footer style={{marginTop:'60px',paddingTop:'24px',borderTop:`1px solid ${t.hrColor}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link href="/blog" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:t.accent,textDecoration:'none'}}>← All posts</Link>
        <Link href="/" style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:t.textMuted,textDecoration:'none'}}>Back to portfolio</Link>
      </footer>
    </>
  )
}

export default function BlogPostPage(){
  return <BlogShell backHref="/blog" backLabel="← All posts"><PostContent/></BlogShell>
}
