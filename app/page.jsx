"use client";
import { useState, useEffect, useRef, useCallback, useContext, createContext } from "react";

const PHOTO = "/photo.jpg";

// ── Themes ──
const LIGHT = {
  bg:"#FEF0CE",card:"#FFF8E8",tagBg:"#F5F0EA",navBg:"rgba(254,240,206,0.7)",
  text:"#1B1B1B",textBody:"#4A4A4A",textDesc:"#5A5A5A",textMuted:"#6B6B6B",textFaint:"#999999",textCounter:"#AAAAAA",
  accent:"#FC6F20",accentDk:"#E86010",heroSub:"rgba(27,27,27,0.45)",
  navLine:"rgba(27,27,27,0.5)",navLogo:"#1B1B1B",navLinkHover:"#1B1B1B",
  btnOlC:"#1B1B1B",btnOlB:"rgba(27,27,27,0.2)",btnOlHoverB:"#FC6F20",
  bL:"rgba(27,27,27,0.06)",bM:"rgba(27,27,27,0.08)",bH:"rgba(27,27,27,0.12)",
  scrollTr:"#FEF0CE",scrollTh:"rgba(27,27,27,0.15)",selBg:"rgba(252,111,32,0.2)",selC:"#1B1B1B",
  orb1:"rgba(252,111,32,0.18)",orb2:"rgba(252,111,32,0.12)",orb3:"rgba(255,132,43,0.08)",orb4:"rgba(255,155,123,0.12)",orb5:"rgba(255,183,77,0.09)",
  scrollInd:"rgba(27,27,27,0.15)",
  cBg:"#1B1B1B",cOrb1:"rgba(252,111,32,0.07)",cOrb2:"rgba(252,111,32,0.04)",
  cText:"rgba(254,240,206,0.45)",cHead:"#FEF0CE",cLabel:"rgba(254,240,206,0.55)",
  cBorder:"rgba(254,240,206,0.06)",cFooter:"rgba(254,240,206,0.25)",
  cLink:"#FC6F20",cLinkB:"rgba(252,111,32,0.2)",cLinkHBg:"rgba(252,111,32,0.08)",cLinkHB:"rgba(252,111,32,0.4)",
  pubC:"#1a7a42",pubBg:"rgba(34,166,110,0.1)",arrowBg:"#FFF8E8",arrowC:"#323232",
  synKey:"#9B5DE5",synStr:"#22A66E",synBrace:"#999999",dotGrid:"rgba(0,0,0,0.04)",
};
const DARK = {
  bg:"#111118",card:"#1a1a26",tagBg:"rgba(255,255,255,0.07)",navBg:"rgba(17,17,24,0.75)",
  text:"#e4e0d8",textBody:"#a8a4b4",textDesc:"#8b8898",textMuted:"#6e6b7e",textFaint:"#555268",textCounter:"#6e6b7e",
  accent:"#FC6F20",accentDk:"#FF8A4C",heroSub:"rgba(228,224,216,0.4)",
  navLine:"rgba(255,255,255,0.12)",navLogo:"#e4e0d8",navLinkHover:"#e4e0d8",
  btnOlC:"#e4e0d8",btnOlB:"rgba(228,224,216,0.15)",btnOlHoverB:"#FC6F20",
  bL:"rgba(255,255,255,0.05)",bM:"rgba(255,255,255,0.07)",bH:"rgba(255,255,255,0.1)",
  scrollTr:"#111118",scrollTh:"rgba(255,255,255,0.12)",selBg:"rgba(252,111,32,0.3)",selC:"#e4e0d8",
  orb1:"rgba(252,111,32,0.25)",orb2:"rgba(252,111,32,0.16)",orb3:"rgba(255,132,43,0.1)",orb4:"rgba(255,155,123,0.12)",orb5:"rgba(255,183,77,0.08)",
  scrollInd:"rgba(255,255,255,0.15)",
  cBg:"#0a0a12",cOrb1:"rgba(252,111,32,0.08)",cOrb2:"rgba(252,111,32,0.04)",
  cText:"rgba(228,224,216,0.4)",cHead:"#e4e0d8",cLabel:"rgba(228,224,216,0.5)",
  cBorder:"rgba(255,255,255,0.06)",cFooter:"rgba(228,224,216,0.2)",
  cLink:"#FC6F20",cLinkB:"rgba(252,111,32,0.25)",cLinkHBg:"rgba(252,111,32,0.1)",cLinkHB:"rgba(252,111,32,0.4)",
  pubC:"#2eba6e",pubBg:"rgba(46,186,110,0.12)",arrowBg:"#1a1a26",arrowC:"#a8a4b4",
  synKey:"#c792ea",synStr:"#7ec699",synBrace:"#6e6b7e",dotGrid:"rgba(255,255,255,0.025)",
};

const ThemeCtx = createContext(LIGHT);
const useTheme = () => useContext(ThemeCtx);
const SpeedCtx = createContext(false);

// ── Solar ──
function calcSunTimes(lat, lng) {
  const now = new Date(), start = new Date(now.getFullYear(),0,0);
  const doy = Math.floor((now-start)/864e5), D2R=Math.PI/180, R2D=180/Math.PI, lngH=lng/15;
  function calc(approx) {
    const t=doy+((approx-lngH)/24), M=(0.9856*t)-3.289;
    let L=M+1.916*Math.sin(M*D2R)+0.020*Math.sin(2*M*D2R)+282.634; L=((L%360)+360)%360;
    let RA=R2D*Math.atan(0.91764*Math.tan(L*D2R)); RA=((RA%360)+360)%360;
    RA+=Math.floor(L/90)*90-Math.floor(RA/90)*90; RA/=15;
    const sinDec=0.39782*Math.sin(L*D2R), cosDec=Math.cos(Math.asin(sinDec));
    const cosH=(Math.cos(90.833*D2R)-sinDec*Math.sin(lat*D2R))/(cosDec*Math.cos(lat*D2R));
    return {cosH,RA,t};
  }
  const rise=calc(6),set=calc(18);
  if(rise.cosH>1||set.cosH>1) return {sunrise:7,sunset:19};
  if(rise.cosH<-1||set.cosH<-1) return {sunrise:0,sunset:24};
  const HR=(360-R2D*Math.acos(rise.cosH))/15, HS=R2D*Math.acos(set.cosH)/15;
  return { sunrise:((HR+rise.RA-0.06571*rise.t-6.622-lngH)%24+24)%24, sunset:((HS+set.RA-0.06571*set.t-6.622-lngH)%24+24)%24 };
}
function useDayNight() {
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const fb=()=>{const h=new Date().getHours();setDark(h<6||h>=19)};
    if(!navigator.geolocation){fb();return}
    navigator.geolocation.getCurrentPosition(pos=>{
      const{sunrise,sunset}=calcSunTimes(pos.coords.latitude,pos.coords.longitude);
      const n=new Date(),u=n.getUTCHours()+n.getUTCMinutes()/60;
      setDark(u<sunrise||u>=sunset);
    },fb,{timeout:4000});
  },[]);
  return dark;
}
function useScrollSpeed() {
  const [speed,setSpeed]=useState(1);const timeout=useRef(null);const lastUp=useRef(0);
  useEffect(()=>{
    let ly=window.scrollY,lt=performance.now();
    const onScroll=()=>{const now=performance.now();const vel=Math.abs(window.scrollY-ly)/Math.max(now-lt,1);ly=window.scrollY;lt=now;
      if(now-lastUp.current>50){setSpeed(Math.max(0.05,1-(vel/2.5)));lastUp.current=now}
      clearTimeout(timeout.current);timeout.current=setTimeout(()=>setSpeed(1),250)};
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>{window.removeEventListener("scroll",onScroll);clearTimeout(timeout.current)};
  },[]);
  return speed;
}
function useMobile(bp=768) {
  const [m,setM]=useState(false);
  useEffect(()=>{const c=()=>setM(window.innerWidth<=bp);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c)},[bp]);
  return m;
}
function useScrollDir() {
  const [up,setUp]=useState(false);const ly=useRef(0);
  useEffect(()=>{const h=()=>{setUp(window.scrollY<ly.current);ly.current=window.scrollY};window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  return up;
}

// ── Data ──
const PROJECTS=[
  {category:"AI systems",title:"Multi-Agent Code Review System",description:"An AI-powered code review pipeline deploying parallel LangGraph agents to analyze code across security, performance, and maintainability dimensions. Claude Sonnet synthesizes multi-dimensional feedback into actionable recommendations.",tech:["FastAPI","LangGraph","React","Claude API","Supabase"],highlights:["Parallel agent architecture for concurrent analysis","Real-time session tracking via Supabase","Synthesis layer aggregating multi-agent feedback"],color:"#2D7BD8",file:"multi_agent_review.py"},
  {category:"Security",title:"SecureChat",description:"End-to-end encrypted real-time messaging built on modern cryptographic primitives. Forward-secret key exchange ensures that compromising one session never exposes another.",tech:["X25519","ChaCha20-Poly1305","WebSocket","Node.js","React"],highlights:["X25519 elliptic-curve key exchange","ChaCha20-Poly1305 authenticated encryption","Zero-knowledge server architecture"],color:"#22A66E",file:"secure_chat.ts"},
  {category:"Blockchain",title:"E-Ballot",description:"A decentralized voting platform on Ethereum smart contracts delivering transparent, tamper-proof elections with verifiable on-chain results.",tech:["Ethereum","Solidity","Web3.js","React","Truffle"],highlights:[{num:66.67,dec:2,text:" votes/min throughput"},{num:4.3,dec:1,suffix:"x",text:" performance improvement"}],color:"#E8650A",published:true,file:"e_ballot.sol",github:"https://github.com/rishee-deshmukh/E-Ballot-Blockchain-Based-Voting-System"},
  {category:"AI / NLP",title:"T5 Text Simplification",description:"Fine-tuned T5 transformer on the WikiAuto dataset for automated text simplification, optimized for meaningful structural and lexical rewrites rather than surface-level paraphrasing.",tech:["T5","TensorFlow","WikiAuto","Scikit-learn","Python"],highlights:["SARI-optimized simplification pipeline","Fine-tuned on 488K sentence pairs","Structural and lexical transformation focus"],color:"#9B5DE5",file:"t5_simplify.py"},
];
const EXPERIENCE=[
  {role:"Full-Stack Engineer",company:"iConsult Collaborative",period:"2025 \u2013 2026",file:"full_stack_engineer.md",tech:["React","Node.js","Agile","Full-Stack","REST APIs"],description:"Developed and shipped full-stack features across client projects, working with React frontends and Node.js backends in a collaborative, agile environment."},
  {role:"Network Engineering Intern",company:"Cisco",period:"2023",file:"network_intern.log",tech:["Network Infrastructure","Enterprise Systems","Cisco IOS"],description:"Contributed to network infrastructure tooling and gained hands-on experience with enterprise-scale systems and engineering workflows."},
];
const SKILLS=[
  {group:"Languages",items:["Python","JavaScript","TypeScript","Solidity","SQL","HTML/CSS"]},
  {group:"Frameworks",items:["React","Next.js","FastAPI","Node.js","Express","Django"]},
  {group:"AI / ML",items:["TensorFlow","LangGraph","Scikit-learn","Hugging Face","NLP"]},
  {group:"Infrastructure",items:["PostgreSQL","Supabase","Docker","Git","AWS","Vercel"]},
];

// ── Primitives ──
function useInView(threshold=0.1){const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const o=new IntersectionObserver(([e])=>{setV(e.isIntersecting)},{threshold});o.observe(el);return()=>o.disconnect()},[]);return[ref,v]}

function SplitText({text,delay=0,stagger=0.03,style={}}){
  const speed=useContext(SpeedCtx);const t=useTheme();const[ref,v]=useInView(0.1);
  const s=t.scrollUp?0:speed;const d=delay*s,st=stagger*s,dur=0.45*s;
  return(<span ref={ref} style={{display:"inline",...style}}>{text.split(" ").map((w,i)=>(
    <span key={i} style={{display:"inline-block",overflow:"hidden",verticalAlign:"top",paddingBottom:"8px"}}>
      <span style={{display:"inline-block",transform:v?"translateY(0) rotate(0deg)":`translateY(115%) rotate(${s<0.5?0:3}deg)`,opacity:v?1:0,
        transition:v?`transform ${dur}s cubic-bezier(0.16,1,0.3,1) ${d+i*st}s, opacity ${Math.min(dur,0.4)}s ease ${d+i*st}s`:"none"}}>{w}</span>
      {i<text.split(" ").length-1?"\u00A0":""}
    </span>))}</span>);
}

function Reveal({children,delay=0,style={},blur=false}){
  const speed=useContext(SpeedCtx);const t=useTheme();const[ref,v]=useInView(0.05);
  const s=t.scrollUp?0:speed;const d=delay*s,dur=0.5*s;
  return(<div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":`translateY(${Math.max(8,36*s)}px)`,
    filter:blur&&s>0.3?(v?"blur(0px)":"blur(4px)"):undefined,
    transition:v?`opacity ${dur}s cubic-bezier(0.23,1,0.32,1) ${d}s, transform ${dur}s cubic-bezier(0.23,1,0.32,1) ${d}s${blur&&s>0.3?`, filter ${dur}s ease ${d}s`:""}`:"none",
    ...style}}>{children}</div>);
}

function TypeWriter({text,startDelay=900}){
  const[displayed,setDisplayed]=useState("");const[done,setDone]=useState(false);
  useEffect(()=>{let iv;const st=setTimeout(()=>{let i=0;iv=setInterval(()=>{i++;setDisplayed(text.slice(0,i));if(i>=text.length){clearInterval(iv);setDone(true)}},12)},startDelay);return()=>{clearTimeout(st);clearInterval(iv)}},[text,startDelay]);
  return(<>{displayed}{!done&&<span className="terminal-cursor"/>}</>);
}

function LoopingTypeWriter({texts,text,delay=0}){
  const[items]=useState(()=>(texts||[text]).map(t=>typeof t==="string"?{text:t}:t));
  const[ref,visible]=useInView(0.1);
  const[displayed,setDisplayed]=useState("");
  const[phase,setPhase]=useState(delay>0?"delay":"typing");
  const idx=useRef(0);
  useEffect(()=>{
    if(!visible)return;let t;const cur=items[idx.current];
    if(phase==="delay"){
      t=setTimeout(()=>setPhase("typing"),delay);
    }else if(phase==="typing"){
      if(displayed.length<cur.text.length){t=setTimeout(()=>setDisplayed(cur.text.slice(0,displayed.length+1)),80)}
      else{setPhase("paused")}
    }else if(phase==="paused"){
      const p=cur.pause!==undefined?cur.pause:(cur.text.length<20?1600:2400);
      t=setTimeout(()=>setPhase("deleting"),p);
    }else if(phase==="deleting"){
      if(displayed.length>0){t=setTimeout(()=>setDisplayed(d=>d.slice(0,-1)),55)}
      else{idx.current=(idx.current+1)%items.length;t=setTimeout(()=>setPhase("typing"),500)}
    }
    return()=>clearTimeout(t);
  },[displayed,phase,visible,items,delay]);
  return(<span ref={ref}>{displayed}<span className="terminal-cursor"/></span>);
}

function CountUp({target,decimals=0,suffix=""}){
  const[ref,visible]=useInView(0.2);
  const[val,setVal]=useState(0);
  useEffect(()=>{
    if(!visible){setVal(0);return}
    const start=performance.now(),dur=1500;
    const step=now=>{const p=Math.min((now-start)/dur,1);const eased=1-Math.pow(1-p,3);setVal(target*eased);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  },[visible,target]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

function ScrollProgress(){
  const t=useTheme();const[w,setW]=useState(0);
  useEffect(()=>{const h=()=>{const total=document.documentElement.scrollHeight-window.innerHeight;setW(total>0?(window.scrollY/total)*100:0)};
    window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  return <div style={{position:"fixed",top:0,left:0,height:"3px",width:`${w}%`,background:t.accent,zIndex:300,transition:"width 0.05s linear",borderRadius:"0 2px 2px 0"}}/>;
}

function BackToTop(){
  const t=useTheme();const[show,setShow]=useState(false);
  useEffect(()=>{const h=()=>setShow(window.scrollY>window.innerHeight*0.8);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  if(!show)return null;
  return(<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
    style={{position:"fixed",bottom:t.mobile?"20px":"32px",right:t.mobile?"20px":"32px",width:t.mobile?"40px":"44px",height:t.mobile?"40px":"44px",
      borderRadius:"50%",background:t.accent,color:t.bg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:150,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",transition:"transform 0.2s ease,opacity 0.3s ease",opacity:show?1:0}}
    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
  </button>);
}

function useActiveSection(){
  const[active,setActive]=useState("hero");
  useEffect(()=>{
    const sections=document.querySelectorAll("section[id]");
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)})},{threshold:0.3});
    sections.forEach(s=>obs.observe(s));return()=>obs.disconnect();
  },[]);
  return active;
}

function SectionHeader({children,light=false,onOrange=false,subtitle=""}){
  const speed=useContext(SpeedCtx);const t=useTheme();const[ref,v]=useInView(0.05);
  const s=t.scrollUp?0:speed;
  const hdur=0.7*s,hdist=s<0.3?"20px":"55vh",bDel=0.4*s,tDel=0.45*s,dDur=0.3*s;
  const barCol=onOrange?t.text:t.accent,lblCol=onOrange?t.textMuted:light?t.cLabel:t.accent,hdCol=onOrange?t.text:light?t.cHead:t.text;
  return(
    <div ref={ref} style={{marginBottom:"clamp(20px,3vh,40px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:subtitle?"clamp(12px,2vh,28px)":0,
        transform:v?"translateY(0)":`translateY(${hdist})`,opacity:v?1:0,
        transition:v?`transform ${hdur}s cubic-bezier(0.16,1,0.3,1), opacity ${Math.min(hdur,0.5)}s ease 0.05s`:"none"}}>
        <div style={{width:"3px",height:"24px",background:barCol,borderRadius:"2px",transformOrigin:"bottom",
          transform:v?"scaleY(1)":"scaleY(0)",transition:v?`transform ${dDur}s cubic-bezier(0.16,1,0.3,1) ${bDel}s`:"none"}} />
        <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:"15px",fontWeight:500,letterSpacing:"0.12em",
          textTransform:"uppercase",color:lblCol,transform:v?"translateX(0)":`translateX(${-20*s}px)`,opacity:v?1:0,
          transition:v?`transform ${dDur}s cubic-bezier(0.16,1,0.3,1) ${tDel}s, opacity ${dDur*0.8}s ease ${tDel}s`:"none"}}>{children}</span>
      </div>
      {subtitle&&<h2 style={{fontFamily:"'Satoshi',sans-serif",fontSize:"clamp(24px,4vw,42px)",fontWeight:600,
        color:hdCol,letterSpacing:"-0.02em",lineHeight:1.15,maxWidth:"600px"}}>
        <SplitText text={subtitle} delay={0.5*s} stagger={0.06*s}/></h2>}
    </div>);
}

// ── Components ──
function Nav(){
  const t=useTheme();const links=["projects","experience","contact"];const blogLink="/blog";
  const px=t.mobile?"20px":"40px";const orangeW=t.mobile?40:80;
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:`12px ${px}`,
      display:"flex",justifyContent:"space-between",alignItems:"center",
      background:t.navBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",borderBottom:"none"}}>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"2.5px",
        background:`linear-gradient(to right, ${t.accent} ${orangeW}px, ${t.navLine} ${orangeW}px)`}} />
      <a href="#hero" style={{fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:t.mobile?"16px":"18px",
        color:t.navLogo,textDecoration:"none",width:`${orangeW}px`,textAlign:"center",marginLeft:`-${orangeW/2}px`}}>RD</a>
      <div style={{display:"flex",gap:t.mobile?"14px":"32px",alignItems:"center"}}>
        <a href="/resume.pdf" download title="Download Resume"
          style={{color:t.accent,display:"flex",alignItems:"center",transition:"opacity 0.3s ease",textDecoration:"none"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </a>
        <button onClick={t.toggle} aria-label="Toggle theme"
          style={{background:"none",border:"none",cursor:"pointer",color:t.accent,display:"flex",alignItems:"center",
            justifyContent:"center",padding:"2px",transition:"opacity 0.3s ease"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          {t.isDark?(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>)
          :(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>)}
        </button>
        {links.map(l=>(<a key={l} href={`#${l}`}
          style={{fontFamily:"'Aileron',sans-serif",fontSize:t.mobile?"12px":"14px",color:t.activeSection===l?t.accent:t.textMuted,textDecoration:"none",
            transition:"color 0.3s ease",textTransform:"capitalize",position:"relative",paddingBottom:"4px",
            borderBottom:t.activeSection===l?`2px solid ${t.accent}`:"2px solid transparent"}}
          onMouseEnter={e=>{if(t.activeSection!==l)e.target.style.color=t.navLinkHover}}
          onMouseLeave={e=>{if(t.activeSection!==l)e.target.style.color=t.textMuted}}>{l}</a>))}
        <a href={blogLink}
          style={{fontFamily:"'Aileron',sans-serif",fontSize:t.mobile?"12px":"14px",color:t.accent,textDecoration:"none",
            transition:"color 0.3s ease",paddingBottom:"4px",borderBottom:"2px solid transparent"}}
          onMouseEnter={e=>e.target.style.color=t.navLinkHover}
          onMouseLeave={e=>e.target.style.color=t.accent}>Blog</a>
      </div>
    </nav>);
}

function Hero(){
  const t=useTheme();const m=t.mobile;const[loaded,setLoaded]=useState(false);const[photoOpen,setPhotoOpen]=useState(false);
  const[mx,setMx]=useState(0);const[my,setMy]=useState(0);
  useEffect(()=>{const tm=setTimeout(()=>setLoaded(true),100);return()=>clearTimeout(tm)},[]);
  useEffect(()=>{if(!photoOpen)return;const h=e=>{if(e.key==="Escape")setPhotoOpen(false)};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[photoOpen]);
  useEffect(()=>{
    let raf;
    const onMouse=e=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{setMx((e.clientX/window.innerWidth-0.5)*2);setMy((e.clientY/window.innerHeight-0.5)*2)})};
    const onOrient=e=>{setMx(Math.max(-1,Math.min(1,(e.gamma||0)/30)));setMy(Math.max(-1,Math.min(1,((e.beta||0)-30)/30)))};
    window.addEventListener("mousemove",onMouse);window.addEventListener("deviceorientation",onOrient);
    return()=>{window.removeEventListener("mousemove",onMouse);window.removeEventListener("deviceorientation",onOrient);cancelAnimationFrame(raf)};
  },[]);
  return(
    <section id="hero" className="snap-section dot-grid" style={{position:"relative",minHeight:"100vh",display:"flex",
      flexDirection:"column",justifyContent:"center",padding:m?"100px 24px 60px":"120px 60px 80px",background:t.bg,overflow:"hidden"}}>
      <div className="hero-grain" style={{position:"absolute",inset:0}}/>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{transform:`translate(${mx*-25}px,${my*-20}px)`,transition:"transform 0.15s ease-out"}}><div className="hero-orb hero-orb-1"/></div>
        <div style={{transform:`translate(${mx*-15}px,${my*-12}px)`,transition:"transform 0.15s ease-out"}}><div className="hero-orb hero-orb-2"/></div>
        <div style={{transform:`translate(${mx*-10}px,${my*-8}px)`,transition:"transform 0.15s ease-out"}}><div className="hero-orb hero-orb-3"/></div>
        <div style={{transform:`translate(${mx*20}px,${my*15}px)`,transition:"transform 0.15s ease-out"}}><div className="hero-orb hero-orb-4"/></div>
        <div style={{transform:`translate(${mx*-12}px,${my*18}px)`,transition:"transform 0.15s ease-out"}}><div className="hero-orb hero-orb-5"/></div>
      </div>
      {photoOpen&&<div onClick={()=>setPhotoOpen(false)} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"modalFadeIn 0.25s ease",cursor:"pointer"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}>
          <div style={{width:m?"200px":"280px",height:m?"200px":"280px",borderRadius:"50%",overflow:"hidden",border:`3px solid ${t.accent}`,
            boxShadow:"0 0 60px rgba(252,111,32,0.2)",animation:"modalScaleIn 0.35s cubic-bezier(0.23,1,0.32,1)"}}>
            <img src={PHOTO} alt="Rishee Deshmukh" onContextMenu={e=>e.preventDefault()} draggable={false} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"45% 18%",WebkitTouchCallout:"none",WebkitUserSelect:"none",userSelect:"none",pointerEvents:"none"}} />
          </div>
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Satoshi',sans-serif",fontSize:m?"20px":"24px",fontWeight:600,color:"#fff",margin:"0 0 4px"}}>Rishee Deshmukh</p>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"11px":"13px",color:t.accent,margin:"0 0 20px",letterSpacing:"0.04em"}}>{"> "}software engineer</p>
          </div>
          <div style={{display:"flex",gap:"24px",flexWrap:"wrap",justifyContent:"center"}}>
            {[
              {label:"Email",href:"mailto:us.rishee@gmail.com",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>},
              {label:"GitHub",href:"https://github.com/rishee-deshmukh",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>},
              {label:"LinkedIn",href:"https://linkedin.com/in/rishee-deshmukh",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
            ].map(link=>(
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}
                style={{color:"#fff",display:"flex",alignItems:"center",textDecoration:"none",transition:"opacity 0.3s ease"}}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                {link.icon}
              </a>))}
          </div>
        </div>
      </div>}
      <div style={{position:"relative",zIndex:2,maxWidth:"1000px",width:"100%",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:m?"16px":"32px",marginBottom:"24px"}}>
          <div onClick={()=>setPhotoOpen(true)} style={{width:m?"56px":"155px",height:m?"56px":"155px",borderRadius:"50%",overflow:"hidden",border:`2px solid ${t.accent}`,flexShrink:0,cursor:"pointer",
            opacity:loaded?1:0,transform:loaded?"scale(1)":"scale(0.8)",transition:"all 0.6s cubic-bezier(0.23,1,0.32,1) 0.3s"}}>
            <img src={PHOTO} alt="Rishee Deshmukh" onContextMenu={e=>e.preventDefault()} draggable={false} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"45% 18%",WebkitTouchCallout:"none",WebkitUserSelect:"none",userSelect:"none",pointerEvents:"none"}} />
          </div>
          <div>
            <div style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.5s ease 0.1s"}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"11px":"14px",color:t.accent,marginBottom:m?"4px":"6px",letterSpacing:"0.06em"}}>
                <span style={{color:t.textMuted}}>{">"}</span> <LoopingTypeWriter texts={[{text:"software engineer",pause:1600},{text:"guitarist",pause:800},{text:"competitive gamer",pause:800}]} delay={800}/></p>
            </div>
            <h1 style={{fontFamily:"'Satoshi',sans-serif",fontSize:"clamp(28px,5.5vw,72px)",fontWeight:700,color:t.text,lineHeight:1.05,letterSpacing:"-0.03em",margin:0,overflow:"hidden",whiteSpace:"nowrap"}}>
              {"Rishee Deshmukh".split("").map((c,i)=>(
                <span key={i} style={{display:"inline-block",opacity:loaded?1:0,transform:loaded?"translateY(0) rotate(0deg)":"translateY(100%) rotate(8deg)",
                  transition:`all 0.6s cubic-bezier(0.23,1,0.32,1) ${0.15+i*0.05}s`}}>{c===" "?"\u00A0":c}</span>))}
            </h1>
          </div>
        </div>
        <div style={{opacity:loaded?1:0,transition:"opacity 0.4s ease 0.9s",minHeight:m?"80px":"60px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"14px":"17px",lineHeight:1.65,color:t.heroSub,maxWidth:"520px",margin:"0 0 40px"}}>
            {loaded&&<TypeWriter text="Building at the intersection of security, AI systems, and web infrastructure. That's where the interesting problems live." startDelay={900}/>}</p>
        </div>
        <div style={{display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.8s cubic-bezier(0.23,1,0.32,1) 1.1s"}}>
          <a href="#about" className="btn-primary">Explore</a>
          <a href="#contact" className="btn-outline">Get in touch</a>
        </div>
      </div>
      {!m&&<div style={{position:"absolute",bottom:"40px",left:"60px",opacity:loaded?1:0,transition:"opacity 1s ease 1.6s"}}>
        <div className="scroll-indicator"><div className="scroll-dot"/></div>
      </div>}
    </section>);
}

function About(){
  const t=useTheme();const m=t.mobile;
  return(
    <section id="about" className="snap-section dot-grid" style={{minHeight:"100vh",display:"flex",flexDirection:"column",
      padding:m?"80px 24px 40px":"clamp(80px,12vh,120px) 60px clamp(40px,5vh,60px)",background:t.bg}}>
      <div style={{maxWidth:"1000px",margin:"0 auto",width:"100%",flex:1,display:"flex",flexDirection:"column"}}>
      <SectionHeader subtitle="Where I come from.">About</SectionHeader>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"clamp(24px,4vh,48px)"}}>
        <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:"clamp(20px,3vw,48px)"}}>
          <Reveal delay={0.6} blur>
            <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"clamp(15px,1.8vw,19px)",lineHeight:1.85,color:t.textBody}}>
              M.S. Computer Science from Syracuse University, class of 2026. I gravitate toward problems that sit between systems: where security meets usability, where AI meets real engineering constraints, where theory has to survive contact with production.</p>
          </Reveal>
          <Reveal delay={0.75} blur>
            <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"clamp(15px,1.8vw,19px)",lineHeight:1.85,color:t.textBody}}>
              When I'm not writing code, I'm playing guitar, competing in games, or rewatching something comforting for the third time. I believe the best engineers are the ones who stay curious outside their IDE.</p>
          </Reveal>
        </div>
        <Reveal delay={0.9}>
          <div style={{display:"grid",gridTemplateColumns:m?"repeat(2,1fr)":"repeat(4,1fr)",gap:"1px",background:t.bM,borderRadius:"12px",overflow:"hidden"}}>
            {SKILLS.map(s=>(
              <div key={s.group} style={{background:t.card,padding:"clamp(16px,2.5vh,32px) clamp(14px,2vw,28px)",transition:"transform 0.2s ease, box-shadow 0.2s ease",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.06)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                <p style={{fontFamily:"'Satoshi',sans-serif",fontSize:"12px",fontWeight:600,color:t.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"8px"}}>{s.group}</p>
                <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"clamp(12px,1.3vw,15px)",lineHeight:1.7,color:t.textMuted,margin:0}}>{s.items.join(", ")}</p>
              </div>))}
          </div>
        </Reveal>
      </div>
      </div>
    </section>);
}

function ProjectCarousel(){
  const t=useTheme();const m=t.mobile;
  const[current,setCurrent]=useState(0);const[animKey,setAnimKey]=useState(0);const dirRef=useRef(1);
  const[party,setParty]=useState(false);const[confetti,setConfetti]=useState([]);const[confettiGo,setConfettiGo]=useState(false);
  const triggerParty=()=>{if(party)return;setParty(true);
    const p=Array.from({length:30},(_,i)=>({id:Date.now()+i,x:(Math.random()-0.5)*280,y:-(Math.random()*140+20)+(Math.random()*80),
      r:(Math.random()-0.5)*720,color:["#FF5F57","#FEBC2E","#28C840","#FC6F20","#9B5DE5","#2D7BD8","#fff"][Math.floor(Math.random()*7)],
      size:Math.random()*6+3,shape:Math.random()>0.5?"50%":"2px",delay:Math.random()*0.35}));
    setConfetti(p);setConfettiGo(false);
    requestAnimationFrame(()=>requestAnimationFrame(()=>setConfettiGo(true)));
    setTimeout(()=>{setParty(false);setConfetti([]);setConfettiGo(false)},2800);};
  const next=useCallback(()=>{dirRef.current=1;setCurrent(c=>(c+1)%PROJECTS.length);setAnimKey(k=>k+1)},[]);
  const prev=useCallback(()=>{dirRef.current=-1;setCurrent(c=>(c-1+PROJECTS.length)%PROJECTS.length);setAnimKey(k=>k+1)},[]);
  const goTo=useCallback(idx=>{dirRef.current=1;setCurrent(idx);setAnimKey(k=>k+1)},[]);
  useEffect(()=>{const h=e=>{if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev()};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[next,prev]);
  const carouselRef=useRef(null);const touchOrigin=useRef({x:0,y:0});const touchEndX=useRef(0);const swiping=useRef(false);
  useEffect(()=>{
    const el=carouselRef.current;if(!el)return;
    const onTS=e=>{touchOrigin.current={x:e.touches[0].clientX,y:e.touches[0].clientY};touchEndX.current=e.touches[0].clientX;swiping.current=false};
    const onTM=e=>{const dx=Math.abs(e.touches[0].clientX-touchOrigin.current.x),dy=Math.abs(e.touches[0].clientY-touchOrigin.current.y);
      if(dx>dy&&dx>10){swiping.current=true;e.preventDefault()}touchEndX.current=e.touches[0].clientX};
    const onTE=()=>{if(swiping.current){const d=touchOrigin.current.x-touchEndX.current;if(Math.abs(d)>50){d>0?next():prev()}}};
    el.addEventListener("touchstart",onTS,{passive:true});
    el.addEventListener("touchmove",onTM,{passive:false});
    el.addEventListener("touchend",onTE,{passive:true});
    return()=>{el.removeEventListener("touchstart",onTS);el.removeEventListener("touchmove",onTM);el.removeEventListener("touchend",onTE)};
  },[next,prev]);
  return(
    <div style={{position:"relative",flex:1,display:"flex",flexDirection:"column"}}>
      <div ref={carouselRef} style={{flex:1,overflow:"hidden",borderRadius:m?"12px":"16px",border:`1px solid ${t.bL}`,background:t.card,touchAction:"pan-y pinch-zoom",display:"flex",flexDirection:"column",
        animation:party?"rainbowBorder 0.6s linear infinite":"none"}}>
        <div style={{padding:m?"10px 16px":"12px 20px",display:"flex",alignItems:"center",gap:"8px",borderBottom:`1px solid ${t.bL}`,flexShrink:0,position:"relative",overflow:"visible"}}>
          <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
            <div onClick={()=>{dirRef.current=1;next()}} title="Next project"
              style={{width:"10px",height:"10px",borderRadius:"50%",background:"#FF5F57",cursor:"pointer",transition:"transform 0.15s ease",
                animation:party?"dotBounce 0.4s ease 0s infinite":"none"}}
              onMouseEnter={e=>{if(!party)e.currentTarget.style.transform="scale(1.35)"}} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            <div onClick={triggerParty} title="Party!"
              style={{width:"10px",height:"10px",borderRadius:"50%",background:"#FEBC2E",cursor:"pointer",transition:"transform 0.15s ease",
                animation:party?"dotBounce 0.4s ease 0.1s infinite":"none"}}
              onMouseEnter={e=>{if(!party)e.currentTarget.style.transform="scale(1.35)"}} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            {PROJECTS[current].github?(
              <a href={PROJECTS[current].github} target="_blank" rel="noopener noreferrer" title="View on GitHub"
                style={{width:"10px",height:"10px",borderRadius:"50%",background:"#28C840",display:"block",cursor:"pointer",transition:"transform 0.15s ease",
                  animation:party?"dotBounce 0.4s ease 0.2s infinite":"none"}}
                onMouseEnter={e=>{if(!party)e.currentTarget.style.transform="scale(1.35)"}} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            ):(
              <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#28C840",opacity:0.5,
                animation:party?"dotBounce 0.4s ease 0.2s infinite":"none"}}/>
            )}
          </div>
          <span key={`f-${animKey}`} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"10px":"12px",color:t.textFaint,marginLeft:"8px",display:"inline-block",
            animation:`${dirRef.current>0?"fileFromRight":"fileFromLeft"} 0.35s ease forwards`}}>{PROJECTS[current].file}</span>
          {confetti.map(p=>(
            <div key={p.id} style={{position:"absolute",left:"38px",top:"50%",width:p.size,height:p.size,borderRadius:p.shape,background:p.color,pointerEvents:"none",zIndex:10,
              transform:confettiGo?`translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`:"translate(0,0) rotate(0deg)",
              opacity:confettiGo?0:1,
              transition:`transform 1.4s cubic-bezier(0.15,0.8,0.3,1) ${p.delay}s, opacity 0.7s ease ${p.delay+0.7}s`}}/>))}
        </div>
        <div style={{flex:1,overflow:"hidden"}}>
        <div style={{display:"flex",height:"100%",transform:`translateX(-${current*100}%)`,transition:"transform 0.55s cubic-bezier(0.4,0,0.2,1)"}}>
          {PROJECTS.map((proj,i)=>(
            <div key={i} style={{minWidth:"100%",display:"flex",flexDirection:"column"}}>
              <div style={{padding:m?"20px":"clamp(24px,3vh,40px) clamp(28px,3vw,52px)",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"clamp(10px,2vh,24px)",flexWrap:"wrap",gap:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"10px":"12px",fontWeight:500,color:proj.color,background:`${proj.color}10`,padding:m?"4px 10px":"6px 16px",borderRadius:"6px",letterSpacing:"0.04em"}}>{proj.category}</span>
                  {proj.published&&<span style={{fontFamily:"'Aileron',sans-serif",fontSize:m?"10px":"12px",fontWeight:600,color:t.pubC,background:t.pubBg,padding:m?"4px 10px":"6px 14px",borderRadius:"6px",display:"inline-flex",alignItems:"center",gap:"5px"}}>
                    <svg width={m?"11":"13"} height={m?"11":"13"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Peer-reviewed</span>}
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"11px":"13px",color:t.textCounter}}>{String(i+1).padStart(2,"0")} / {String(PROJECTS.length).padStart(2,"0")}</span>
              </div>
              <h3 key={`t-${animKey}-${i}`} style={{fontFamily:"'Satoshi',sans-serif",fontSize:"clamp(20px,3vw,36px)",fontWeight:600,color:t.text,margin:"0 0 clamp(8px,1.5vh,18px)",letterSpacing:"-0.01em"}}>
                {current===i?proj.title.split(" ").map((w,wi)=>(
                  <span key={wi} style={{display:"inline-block",overflow:"hidden",verticalAlign:"top",paddingBottom:"4px"}}>
                    <span className="carousel-word-reveal" style={{display:"inline-block",animationDelay:`${wi*0.05}s`}}>{w}</span>
                    {wi<proj.title.split(" ").length-1?"\u00A0":""}
                  </span>)):proj.title}
              </h3>
              <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"clamp(13px,1.6vw,18px)",lineHeight:1.75,color:t.textDesc,margin:"0 0 clamp(12px,2.5vh,28px)",maxWidth:"640px"}}>{proj.description}</p>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"clamp(12px,2.5vh,28px)"}}>
                {proj.tech.map(tc=>(
                  <span key={tc} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"10px":"12px",color:t.textDesc,background:t.tagBg,padding:m?"5px 10px":"7px 16px",borderRadius:"6px"}}>{tc}</span>))}
              </div>
              <div style={{borderTop:`1px solid ${t.bL}`,paddingTop:"clamp(10px,2vh,24px)"}}>
                {proj.highlights.map((h,hi)=>(
                  <div key={hi} style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:hi<proj.highlights.length-1?"clamp(6px,1vh,12px)":0}}>
                    <span style={{color:proj.color,fontSize:"7px",lineHeight:"20px",flexShrink:0}}>&#9679;</span>
                    <span style={{fontFamily:"'Aileron',sans-serif",fontSize:"clamp(12px,1.4vw,16px)",color:t.textBody,lineHeight:1.6}}>
                      {typeof h==="string"?h:<><CountUp target={h.num} decimals={h.dec||0} suffix={h.suffix||""}/>{h.text}</>}
                    </span>
                  </div>))}
              </div>
            </div></div>))}
        </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:m?"16px":"24px",marginTop:"clamp(12px,2.5vh,32px)",flexShrink:0}}>
        <button onClick={prev} className="carousel-arrow" aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg></button>
        <div style={{display:"flex",gap:"8px"}}>
          {PROJECTS.map((_,i)=>(
            <button key={i} onClick={()=>goTo(i)} aria-label={`Project ${i+1}`}
              style={{width:current===i?"24px":"8px",height:"8px",borderRadius:"4px",background:current===i?t.accent:t.bH,border:"none",padding:0,cursor:"pointer",transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)"}}/>))}
        </div>
        <button onClick={next} className="carousel-arrow" aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></button>
      </div>
    </div>);
}

function Projects(){
  const t=useTheme();const m=t.mobile;
  return(
    <section id="projects" className="snap-section dot-grid" style={{minHeight:"100vh",display:"flex",flexDirection:"column",
      padding:m?"80px 24px 40px":"clamp(80px,12vh,120px) 60px clamp(40px,5vh,60px)",background:t.bg}}>
      <div style={{maxWidth:"1000px",margin:"0 auto",width:"100%",flex:1,display:"flex",flexDirection:"column"}}>
      <SectionHeader subtitle="What I've built.">Projects</SectionHeader>
      <Reveal delay={0.6} style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
        <ProjectCarousel/>
      </Reveal>
      </div>
    </section>);
}

function Experience(){
  const t=useTheme();const m=t.mobile;
  return(
    <section id="experience" className="snap-section dot-grid" style={{minHeight:"100vh",display:"flex",flexDirection:"column",
      padding:m?"80px 24px 40px":"clamp(80px,12vh,120px) 60px clamp(40px,5vh,60px)",background:t.bg}}>
      <div style={{maxWidth:"1000px",margin:"0 auto",width:"100%",flex:1,display:"flex",flexDirection:"column"}}>
      <SectionHeader subtitle="Where I've worked.">Experience</SectionHeader>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {EXPERIENCE.map((exp,i)=>(
          <Reveal key={exp.company} delay={0.6+i*0.15} blur>
            <div style={{display:"flex",gap:m?"12px":"20px",paddingBottom:i<EXPERIENCE.length-1?(m?"24px":"clamp(28px,4vh,44px)"):0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,paddingTop:"18px"}}>
                <div style={{width:"10px",height:"10px",borderRadius:"50%",background:t.accent,border:`2px solid ${t.bg}`,boxShadow:`0 0 0 2px ${t.accent}`,zIndex:1}} />
                {i<EXPERIENCE.length-1&&<div style={{width:"2px",flex:1,background:t.accent,marginTop:"4px",marginBottom:m?"-38px":"-66px",borderRadius:"1px"}} />}
              </div>
              <div style={{flex:1,borderRadius:m?"10px":"12px",border:`1px solid ${t.bL}`,background:t.card,overflow:"hidden"}}>
                <div style={{padding:m?"16px 14px":"clamp(20px,2.5vh,28px) clamp(18px,2vw,24px)"}}>
                  <h3 style={{fontFamily:"'Satoshi',sans-serif",fontSize:m?"18px":"clamp(18px,2vw,24px)",fontWeight:600,color:t.text,margin:"0 0 4px"}}>
                    <SplitText text={exp.role} delay={0.7+i*0.15} stagger={0.04}/></h3>
                  <p style={{fontFamily:"'Aileron',sans-serif",fontSize:m?"13px":"15px",color:t.accent,margin:"0 0 12px",fontWeight:500}}>{exp.company} <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"10px":"12px",color:t.textFaint,fontWeight:400}}>&middot; {exp.period}</span></p>
                  <p style={{fontFamily:"'Aileron',sans-serif",fontSize:m?"13px":"clamp(14px,1.4vw,16px)",lineHeight:1.8,color:t.textMuted,margin:"0 0 16px"}}>{exp.description}</p>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {exp.tech.map(tc=>(
                      <span key={tc} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:m?"9px":"11px",color:t.textDesc,background:t.tagBg,padding:m?"4px 8px":"5px 12px",borderRadius:"5px"}}>{tc}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>))}
      </div>
      </div>
    </section>);
}

function Contact(){
  const t=useTheme();const m=t.mobile;
  const[form,setForm]=useState({name:"",email:"",phone:"",message:""});
  const[honey,setHoney]=useState("");
  const[status,setStatus]=useState("idle");
  const[submitCount,setSubmitCount]=useState(0);
  useEffect(()=>{try{setSubmitCount(parseInt(localStorage.getItem("rd_contact_count")||"0"))}catch(e){}},[]);
  const handleChange=e=>setForm(f=>({...f,[e.target.name]:e.target.value}));
  const handleSubmit=async(e)=>{e.preventDefault();
    if(honey){setStatus("sent");return}
    if(submitCount>=2){return}
    setStatus("sending");
    try{const res=await fetch("https://formspree.io/f/mjgnwjpv",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,_gotcha:honey})});
      if(res.ok){const nc=submitCount+1;setSubmitCount(nc);try{localStorage.setItem("rd_contact_count",String(nc))}catch(e){}setStatus("sent");setForm({name:"",email:"",phone:"",message:""})}else{setStatus("error")}
    }catch(err){setStatus("error")}};
  const locked=submitCount>=2;
  const inputStyle={fontFamily:"'Aileron',sans-serif",fontSize:m?"14px":"15px",color:"#e4e0d8",background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:m?"12px 14px":"14px 16px",width:"100%",outline:"none",
    transition:"border-color 0.3s ease"};
  return(
    <section id="contact" className="snap-section" style={{minHeight:"100vh",display:"flex",flexDirection:"column",
      padding:m?"80px 24px 40px":"clamp(80px,12vh,120px) 60px clamp(40px,5vh,60px)",background:t.cBg,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",background:`radial-gradient(circle,${t.cOrb1},transparent 70%)`,bottom:"-120px",right:"-80px",filter:"blur(60px)"}}/>
        <div style={{position:"absolute",width:"300px",height:"300px",borderRadius:"50%",background:`radial-gradient(circle,${t.cOrb2},transparent 70%)`,top:"20%",left:"-60px",filter:"blur(50px)"}}/>
      </div>
      <div style={{position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",maxWidth:"1000px",margin:"0 auto",width:"100%"}}>
        <SectionHeader light>Get in touch</SectionHeader>
        <h2 style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(22px,3.5vw,36px)",fontWeight:600,
          color:t.cHead,letterSpacing:"-0.02em",lineHeight:1.15,maxWidth:"600px",marginBottom:"clamp(16px,2vh,28px)",minHeight:"1.2em"}}>
          <LoopingTypeWriter texts={[{text:"Got an idea?",pause:1600},{text:"Let's talk it through.",pause:1600},{text:"Let's turn it into code.",pause:1600},{text:"Let's ship it.",pause:1600}]}/>
        </h2>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <Reveal delay={0.6}>
            {locked?(
              <div style={{textAlign:"center",padding:m?"32px 0":"48px 0"}}>
                <p style={{fontFamily:"'Satoshi',sans-serif",fontSize:m?"20px":"24px",fontWeight:600,color:t.cHead,marginBottom:"8px"}}>Thanks for reaching out!</p>
                <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"15px",color:t.cText}}>You've already sent your message. I'll get back to you soon.</p>
              </div>
            ):status==="sent"?(
              <div style={{textAlign:"center",padding:m?"32px 0":"48px 0"}}>
                <p style={{fontFamily:"'Satoshi',sans-serif",fontSize:m?"20px":"24px",fontWeight:600,color:t.cHead,marginBottom:"8px"}}>Message sent!</p>
                <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"15px",color:t.cText}}>I'll get back to you soon.{submitCount>=2?"":" You can send one more message."}</p>
                {submitCount<2&&<button onClick={()=>setStatus("idle")} style={{marginTop:"20px",fontFamily:"'Aileron',sans-serif",fontSize:"13px",color:t.cText,background:"none",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:"6px",padding:"8px 20px",cursor:"pointer"}}>Send another</button>}
              </div>
            ):(
            <div>
              <div style={{flex:1,width:"100%"}}>
                <input name="website" value={honey} onChange={e=>setHoney(e.target.value)} style={{position:"absolute",left:"-9999px",tabIndex:-1}} autoComplete="off" aria-hidden="true"/>
                <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:m?"12px":"16px",marginBottom:m?"12px":"16px"}}>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#FC6F20"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#FC6F20"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                </div>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" style={{...inputStyle,marginBottom:m?"12px":"16px"}}
                  onFocus={e=>e.target.style.borderColor="#FC6F20"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." required rows={m?3:4} style={{...inputStyle,resize:"vertical",minHeight:m?"80px":"100px"}}
                  onFocus={e=>e.target.style.borderColor="#FC6F20"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                <div style={{display:"flex",alignItems:"center",gap:"16px",marginTop:m?"16px":"20px"}}>
                  <button onClick={handleSubmit} disabled={status==="sending"||!form.name||!form.email||!form.message}
                    style={{fontFamily:"'Aileron',sans-serif",fontSize:m?"13px":"15px",fontWeight:500,color:"#1B1B1B",background:status==="sending"?"#d4874a":"#FC6F20",
                      padding:m?"12px 28px":"14px 36px",borderRadius:"8px",border:"none",cursor:status==="sending"?"wait":"pointer",
                      transition:"all 0.3s ease",opacity:(!form.name||!form.email||!form.message)?0.5:1}}>
                    {status==="sending"?"Sending...":"Send message"}
                  </button>
                  {status==="error"&&<span style={{fontFamily:"'Aileron',sans-serif",fontSize:"13px",color:"#ff6b6b"}}>Something went wrong. Try again.</span>}
                </div>
              </div>
            </div>
            )}
          </Reveal>
        </div>
        <div style={{display:"flex",gap:"20px",justifyContent:"flex-start",marginBottom:"20px"}}>
          {[
            {label:"Email",href:"mailto:us.rishee@gmail.com",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>},
            {label:"GitHub",href:"https://github.com/rishee-deshmukh",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>},
            {label:"LinkedIn",href:"https://linkedin.com/in/rishee-deshmukh",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
          ].map(link=>(
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}
              style={{color:t.cLink,display:"flex",alignItems:"center",textDecoration:"none",transition:"opacity 0.3s ease"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              {link.icon}
            </a>))}
        </div>
        <Reveal delay={0.9}>
          <div style={{borderTop:`1px solid ${t.cBorder}`,paddingTop:"20px"}}>
            <p style={{fontFamily:"'Aileron',sans-serif",fontSize:"13px",color:t.cFooter,margin:0}}>Rishee Deshmukh &middot; 2026</p>
          </div>
        </Reveal>
      </div>
    </section>);
}

// ── Main ──
export default function Portfolio(){
  const autoDark=useDayNight();
  const[override,setOverride]=useState(null);
  const isDark=override!==null?override:autoDark;
  const speed=useScrollSpeed();
  const mobile=useMobile();
  const scrollUp=useScrollDir();
  const activeSection=useActiveSection();
  const t=isDark?DARK:LIGHT;
  const toggle=()=>setOverride(prev=>prev===null?!isDark:!prev);
  const ctx={...t,isDark,toggle,mobile,scrollUp,activeSection};

  return(
    <ThemeCtx.Provider value={ctx}>
    <SpeedCtx.Provider value={speed}>
      <style dangerouslySetInnerHTML={{__html:`
        
        
        ::selection{background:${t.selBg};color:${t.selC}}
        .hero-orb{position:absolute;border-radius:50%;pointer-events:none}
        .hero-orb-1{width:${mobile?"350px":"700px"};height:${mobile?"350px":"700px"};background:radial-gradient(circle,${t.orb1},transparent 65%);top:-150px;right:-100px;filter:blur(80px);animation:orbFloat1 14s ease-in-out infinite}
        .hero-orb-2{width:${mobile?"250px":"450px"};height:${mobile?"250px":"450px"};background:radial-gradient(circle,${t.orb2},transparent 65%);bottom:-50px;left:0%;filter:blur(70px);animation:orbFloat2 11s ease-in-out infinite}
        .hero-orb-3{width:${mobile?"180px":"320px"};height:${mobile?"180px":"320px"};background:radial-gradient(circle,${t.orb3},transparent 65%);top:35%;left:35%;filter:blur(50px);animation:orbFloat3 9s ease-in-out infinite}
        .hero-orb-4{width:${mobile?"280px":"500px"};height:${mobile?"280px":"500px"};background:radial-gradient(circle,${t.orb4},transparent 60%);top:10%;left:-10%;filter:blur(90px);animation:orbFloat4 16s ease-in-out infinite}
        .hero-orb-5{width:${mobile?"200px":"380px"};height:${mobile?"200px":"380px"};background:radial-gradient(circle,${t.orb5},transparent 60%);bottom:10%;right:15%;filter:blur(70px);animation:orbFloat5 13s ease-in-out infinite}
        
        
        .scroll-indicator{width:24px;height:40px;border:2px solid ${t.scrollInd};border-radius:12px;display:flex;justify-content:center;padding-top:8px}
        .scroll-dot{width:4px;height:8px;background:${t.accent};border-radius:2px;animation:scrollBounce 2s ease-in-out infinite}
        .terminal-cursor{display:inline-block;width:2px;height:1em;background:${t.accent};margin-left:2px;vertical-align:text-bottom;animation:cursorBlink 0.8s step-end infinite}
        
        
        
        .dot-grid{background-image:radial-gradient(circle,${t.dotGrid} 1px,transparent 1px);background-size:28px 28px}
        .btn-primary{font-family:'Aileron',sans-serif;font-size:${mobile?"13px":"15px"};font-weight:500;color:${t.text};background:${t.accent};padding:${mobile?"12px 24px":"14px 32px"};border-radius:8px;text-decoration:none;transition:all 0.3s ease;display:inline-block}
        .btn-primary:hover{background:${t.accentDk};transform:translateY(-1px)}
        .btn-outline{font-family:'Aileron',sans-serif;font-size:${mobile?"13px":"15px"};font-weight:500;color:${t.btnOlC};padding:${mobile?"12px 24px":"14px 32px"};border-radius:8px;border:1px solid ${t.btnOlB};text-decoration:none;transition:all 0.3s ease;display:inline-block}
        .btn-outline:hover{border-color:${t.btnOlHoverB};color:${t.accent}}
        .carousel-arrow{width:${mobile?"38px":"46px"};height:${mobile?"38px":"46px"};border-radius:50%;border:1px solid ${t.bH};background:${t.arrowBg};color:${t.arrowC};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s ease;flex-shrink:0}
        .carousel-arrow:hover{border-color:${t.accent};color:${t.accent};transform:scale(1.05)}
        .carousel-arrow:active{transform:scale(0.95)}
        .contact-link{font-family:'Aileron',sans-serif;font-size:${mobile?"13px":"15px"};font-weight:500;color:${t.cLink};padding:${mobile?"12px 20px":"14px 28px"};border-radius:8px;border:1px solid ${t.cLinkB};text-decoration:none;transition:all 0.3s ease;display:inline-flex;align-items:center}
        .contact-link:hover{background:${t.cLinkHBg};border-color:${t.cLinkHB};transform:translateY(-1px)}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${t.scrollTr}}
        ::-webkit-scrollbar-thumb{background:${t.scrollTh};border-radius:3px}
      `}} />
      <ScrollProgress/>
      <BackToTop/>
      <div style={{background:t.bg,color:t.text,fontFamily:"'Aileron',sans-serif",overflowX:"hidden"}}>
        <Nav/><Hero/><About/><Projects/><Experience/><Contact/>
      </div>
    </SpeedCtx.Provider>
    </ThemeCtx.Provider>
  );
}
