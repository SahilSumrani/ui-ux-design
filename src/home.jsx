import React, {useEffect, useRef, useState} from "react";
import {ArrowRight, ChevronDown} from "lucide-react";
import {BaffleLogo} from "./components.jsx";

/* Mounts a live preview only while its card is on screen. */
function useInView(){
  const ref = useRef(null), [seen, setSeen] = useState(false);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    if(!("IntersectionObserver" in window)){ setSeen(true); return; }
    const io = new IntersectionObserver(([e])=>setSeen(e.isIntersecting),{rootMargin:"200px"});
    io.observe(el); return ()=>io.disconnect();
  },[]);
  return [ref, seen];
}

function CatalogCard({item, Icon, Preview, href, go, previews}){
  const [ref, seen] = useInView();
  return <a className="hm-card" href={href} onClick={e=>go(href,e)}>
    <div className="hm-stage" ref={ref}>
      {seen && (item.id==="distortion-wave"?<div className="hm-wave-static" aria-hidden="true"><span>✓</span><b>TRANSFER COMPLETE</b><strong>Money sent</strong><small>$1,250.00</small></div>:<div className={`stage-preview ${item.id} hm-live`} aria-hidden="true"><Preview id={item.id} {...previews}/></div>)}
    </div>
    <div className="hm-meta">
      <span className="hm-ico"><Icon size={20} strokeWidth={1.6}/></span>
      <span className="hm-meta-text"><span className="hm-name">{item.title}</span><span className="hm-desc">{item.subtitle}</span></span>
    </div>
  </a>;
}

const STEPS = [
  ["Pick a component","Open any card and play with the live preview. Tune its settings in the side panel."],
  ["Copy the source","Unlock the code once with your email. Each component is one self-contained file."],
  ["Make it yours","Paste it into your React app. Props and styles are plain, so changing them is easy."]
];
const FAQ = [
  ["Are the components free?","Yes. Every interaction can be previewed without signing in. Enter your email once to unlock and copy the source."],
  ["What do I need to use them?","React 18 or newer. Most components use framer-motion and lucide-react. Distortion Waves also needs the distortion-waves package."],
  ["Can I change how they look?","Yes. Slide to Confirm, Upload Dropzone and Distortion Waves have live controls, and the code panel updates as you change them."],
  ["Do they work outside React?","These versions are written for React. The Daylight Toggle ships as plain HTML, CSS and JS."]
];
const TILES = [
  ["orb","glass","Glass dissolve","logo"],
  ["beam","tilt","Tilt card",0],
  ["metal","swap","Card swap",2],
  ["gooey","folders","Image folders",1],
  ["image","distortion-wave","Distortion waves",3]
];

export function HomePage({data, icons, Preview, cardImages, go, href, previews, user, onSignOut}){
  const [open, setOpen] = useState(0);
  const [filter,setFilter]=useState("All");
  const [menuOpen,setMenuOpen]=useState(false);
  const categories={Cards:["glass","swap","tilt"],Images:["folders","spread","accordion","lens","trail"],Controls:["daylight","magnetic","dock","segmented","slide-confirm","upload","distortion-wave"]};
  const visible=data.filter(item=>filter==="All"||categories[filter]?.includes(item.id));
  const jump = id => e => {e.preventDefault(); document.getElementById(id)?.scrollIntoView({behavior:"smooth"})};
  return <div className="hm">
    <header className="hm-nav"><div className="hm-nav-in">
      <a href="/" onClick={e=>go("/",e)} className="hm-brand"><BaffleLogo/><span>Motif</span><span className="hm-dim">.interactions</span></a>
      <nav className="hm-links"><a href="#components" onClick={jump("components")}>Components</a><a href="#how" onClick={jump("how")}>How to use</a><a href="#faq" onClick={jump("faq")}>FAQs</a></nav>
      <div className="hm-nav-right">{user?<><span className="hm-email">{user.email}</span><button className="hm-pill" onClick={onSignOut}>Sign out</button></>:<a className="hm-pill hm-pill--blue" href={href(data[0])} onClick={e=>go(href(data[0]),e)}>Try it</a>}</div>
      <button className="hm-menu" aria-label="Open navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}><span/><span/></button>
      {menuOpen&&<nav className="hm-drawer"><a href="#components" onClick={e=>{jump("components")(e);setMenuOpen(false)}}>Components</a><a href="#how" onClick={e=>{jump("how")(e);setMenuOpen(false)}}>How to use</a><a href="#faq" onClick={e=>{jump("faq")(e);setMenuOpen(false)}}>FAQs</a>{user?<div className="hm-drawer-account"><span>{user.email}</span><button className="hm-pill" onClick={()=>{onSignOut();setMenuOpen(false)}}>Sign out</button></div>:<a className="hm-pill hm-pill--blue" href={href(data[0])} onClick={e=>{go(href(data[0]),e);setMenuOpen(false)}}>Try it</a>}</nav>}
    </div></header>

    <section className="hm-hero">
      <p className="hm-badge">{data.length}<span className="hm-dim">interactions</span></p>
      <h1>Components for next-gen UI</h1>
      <p className="hm-sub">Tactile React interactions, ready to copy into your app.</p>
      <div className="hm-cta"><a className="hm-btn" href="#components" onClick={jump("components")}>Browse</a><a className="hm-btn hm-btn--blue" href={href(data[data.length-1])} onClick={e=>go(href(data[data.length-1]),e)}>Open a playground</a></div>
      <div className="hm-tiles" aria-label="Featured components">
        {TILES.map(([pos,id,label,art])=>{const item=data.find(d=>d.id===id);return <a key={id} className={`hm-tile hm-tile--${pos}`} href={href(item)} onClick={e=>go(href(item),e)} aria-label={label}>
          <span className="hm-tile-stage">{art==="logo"?<BaffleLogo className="hm-tile-logo"/>:<img src={cardImages[art].src} alt="" draggable="false"/>}</span>
          <span className="hm-tile-pill">{label}<ChevronDown size={14}/></span></a>})}
      </div>
    </section>

    <section id="components" className="hm-grid-wrap" aria-label="Components"><div className="hm-filters" role="group" aria-label="Filter components">{["All",...Object.keys(categories)].map(value=><button key={value} className={filter===value?"active":""} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value}</button>)}</div><div className="hm-grid">
      {visible.map(item=><CatalogCard key={item.id} item={item} Icon={icons[item.id]} Preview={Preview} href={href(item)} go={go} previews={previews}/>)}
    </div></section>

    <section id="how" className="hm-section">
      <div className="hm-how-head"><h2>Copy the code.<br/><span>Paste it in your project</span></h2><p>Every interaction is a single file. Preview it, copy it, ship it.</p></div>
      <ol className="hm-steps">{STEPS.map(([t,d],i)=><li key={t} className="hm-step"><span className="hm-num">{i+1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
    </section>

    <section id="faq" className="hm-section">
      <h2 className="hm-center">FAQs</h2>
      <div className="hm-faq">{FAQ.map(([q,a],i)=><div key={q} className="hm-acc" data-open={open===i}>
        <button className="hm-acc-head" aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><ChevronDown size={16}/></button>
        <div className="hm-acc-panel"><div><p>{a}</p></div></div></div>)}</div>
    </section>

    <footer className="hm-footer">
      <div><a href="/" onClick={e=>go("/",e)} className="hm-brand"><BaffleLogo/><span>Motif</span><span className="hm-dim">.interactions</span></a><p>Components for next-gen UI</p></div>
      <nav className="hm-foot-cols"><div><b>Components</b>{data.slice(0,8).map(i=><a key={i.id} href={href(i)} onClick={e=>go(href(i),e)}>{i.title}</a>)}</div><div><b>Product</b><a href="#components" onClick={jump("components")}>Browse</a><a href="#how" onClick={jump("how")}>How to use</a><a href="#faq" onClick={jump("faq")}>FAQs</a></div></nav>
    </footer>
  </div>;
}
