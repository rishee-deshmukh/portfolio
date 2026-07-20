"use client";
import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'

const BL={bg:"#FEF0CE",card:"#FFF8E8",text:"#1B1B1B",textBody:"#4A4A4A",textMuted:"#6B6B6B",textFaint:"#999",
  accent:"#FC6F20",border:"rgba(27,27,27,0.08)",navBg:"rgba(254,240,206,0.7)",navLine:"rgba(27,27,27,0.5)",navLogo:"#1B1B1B",
  tagBg:"#F5F0EA",tagText:"#5A5A5A",codeBg:"#1B1B1B",codeText:"#e4e0d8",inCodeBg:"#F5F0EA",inCodeText:"#1B1B1B",
  strong:"#1B1B1B",em:"#5A5A5A",bqBorder:"#FC6F20",bqText:"#5A5A5A",hrColor:"rgba(27,27,27,0.1)"};
const BD={bg:"#111118",card:"#1a1a26",text:"#e4e0d8",textBody:"#a8a4b4",textMuted:"#6e6b7e",textFaint:"#555268",
  accent:"#FC6F20",border:"rgba(255,255,255,0.07)",navBg:"rgba(17,17,24,0.75)",navLine:"rgba(255,255,255,0.12)",navLogo:"#e4e0d8",
  tagBg:"rgba(255,255,255,0.07)",tagText:"#8b8898",codeBg:"#0a0a12",codeText:"#e4e0d8",inCodeBg:"rgba(255,255,255,0.07)",inCodeText:"#e4e0d8",
  strong:"#e4e0d8",em:"#8b8898",bqBorder:"#FC6F20",bqText:"#8b8898",hrColor:"rgba(255,255,255,0.08)"};

function calcSunTimes(lat,lng){
  const now=new Date(),start=new Date(now.getFullYear(),0,0);
  const doy=Math.floor((now-start)/864e5),D2R=Math.PI/180,R2D=180/Math.PI,lngH=lng/15;
  function calc(approx){const t=doy+((approx-lngH)/24),M=(0.9856*t)-3.289;
    let L=M+1.916*Math.sin(M*D2R)+0.020*Math.sin(2*M*D2R)+282.634;L=((L%360)+360)%360;
    let RA=R2D*Math.atan(0.91764*Math.tan(L*D2R));RA=((RA%360)+360)%360;
    RA+=Math.floor(L/90)*90-Math.floor(RA/90)*90;RA/=15;
    const sinDec=0.39782*Math.sin(L*D2R),cosDec=Math.cos(Math.asin(sinDec));
    const cosH=(Math.cos(90.833*D2R)-sinDec*Math.sin(lat*D2R))/(cosDec*Math.cos(lat*D2R));
    return{cosH,RA,t}}
  const rise=calc(6),set=calc(18);
  if(rise.cosH>1||set.cosH>1)return{sunrise:7,sunset:19};
  if(rise.cosH<-1||set.cosH<-1)return{sunrise:0,sunset:24};
  const HR=(360-R2D*Math.acos(rise.cosH))/15,HS=R2D*Math.acos(set.cosH)/15;
  return{sunrise:((HR+rise.RA-0.06571*rise.t-6.622-lngH)%24+24)%24,sunset:((HS+set.RA-0.06571*set.t-6.622-lngH)%24+24)%24}}

function useDayNight(){
  const[dark,setDark]=useState(false);
  useEffect(()=>{const fb=()=>{const h=new Date().getHours();setDark(h<6||h>=19)};
    if(!navigator.geolocation){fb();return}
    navigator.geolocation.getCurrentPosition(pos=>{
      const{sunrise,sunset}=calcSunTimes(pos.coords.latitude,pos.coords.longitude);
      const n=new Date(),u=n.getUTCHours()+n.getUTCMinutes()/60;
      setDark(u<sunrise||u>=sunset)},fb,{timeout:4000})},[]);
  return dark}

const BlogCtx=createContext(BL);
export const useBlogTheme=()=>useContext(BlogCtx);

export default function BlogShell({children,backHref="/",backLabel="← Back to portfolio"}){
  const autoDark=useDayNight();
  const[override,setOverride]=useState(null);
  const isDark=override!==null?override:autoDark;
  const t=isDark?BD:BL;
  const toggle=()=>setOverride(prev=>prev===null?!isDark:!prev);

  return(
    <BlogCtx.Provider value={t}>
      <div style={{minHeight:'100vh',background:t.bg,fontFamily:"'Aileron',sans-serif",color:t.text}}>
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'12px 40px',
          display:'flex',alignItems:'center',justifyContent:'space-between',
          background:t.navBg,backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)'}}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',
            background:`linear-gradient(to right, ${t.accent} 80px, ${t.navLine} 80px)`}}/>
          <Link href="/" style={{fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:'18px',color:t.navLogo,textDecoration:'none',
            width:'80px',textAlign:'center',marginLeft:'-40px'}}>RD</Link>
          <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
            <button onClick={toggle} aria-label="Toggle theme"
              style={{background:'none',border:'none',cursor:'pointer',color:t.accent,display:'flex',alignItems:'center',padding:'2px',transition:'opacity 0.3s ease'}}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.6'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              {isDark?(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>)
              :(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>)}
            </button>
            <Link href={backHref} style={{fontFamily:"'Aileron',sans-serif",fontSize:'14px',color:t.accent,textDecoration:'none'}}>
              {backLabel}
            </Link>
          </div>
        </nav>
        <main style={{maxWidth:'700px',margin:'0 auto',padding:'80px 24px',paddingTop:'100px'}}>
          {children}
        </main>
      </div>
    </BlogCtx.Provider>
  )
}
