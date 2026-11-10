import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Check, Upload as UploadIcon } from "lucide-react";

/**
 * Upload Dropzone: an interactive mock upload. The files are demo tiles only;
 * nothing is read from disk or sent to a server.
 * Install: npm install framer-motion lucide-react
 * Import: import { Upload } from "./upload";
 * Use: <Upload speed={50} bounce={40} corner={20} fill="dark" stroke={false} />
 * Styles are included here so this component is a single copyable file.
 */
const uploadStyles = `
.upl{display:flex;flex-direction:column;gap:12px;width:300px;max-width:calc(100vw - 64px);font-family:inherit;color:var(--fill-on,#222);user-select:none;-webkit-user-select:none}
.upl-zone-wrap{flex:none;display:flex;align-items:center;justify-content:center;width:100%;height:176px}
.upl-zone{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;width:100%;height:176px;padding:0 16px;overflow:hidden;border-radius:var(--upl-r);background:var(--fill-slab,#f7f7f5);transition:scale 420ms cubic-bezier(.24,1.34,.38,1),width 420ms cubic-bezier(.24,1.34,.38,1),height 420ms cubic-bezier(.24,1.34,.38,1),background-color 220ms ease}
.upl-zone[data-over]{scale:1.02}.upl-zone[data-gulp]{animation:upl-gulp 460ms cubic-bezier(.3,1.2,.4,1)}.upl-zone[data-gulp] .upl-icon{animation:upl-open 460ms cubic-bezier(.3,1.4,.4,1)}
[data-stroke=on] .upl-zone{box-shadow:0 0 0 1px var(--pane-edge,#c9c9c5)}
.upl-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:color-mix(in srgb,var(--fill-on,#17181a) 6%,var(--fill-slab,#fff));color:color-mix(in srgb,var(--fill-on,#17181a) 72%,var(--fill-slab,#fff));transition:translate 420ms cubic-bezier(.24,1.34,.38,1),background-color 220ms ease,color 220ms ease}
.upl-zone[data-over] .upl-icon{translate:0 -4px;color:var(--fill-on,#222)}.upl-say{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:13px;text-align:center}.upl-say b{font-weight:500}.upl-say span{font-size:12px;color:color-mix(in srgb,var(--fill-on,#17181a) 52%,var(--fill-slab,#fff))}.upl-zone[data-refuse] .upl-say b{color:#e5484d}
.upl-now{display:flex;align-items:center;gap:12px;width:max-content;flex:none;animation:upl-land 420ms var(--upl-spring) both}.upl-text{display:flex;flex-direction:column;gap:4px;width:150px}.upl-name{overflow:hidden;font-size:13px;font-weight:500;white-space:nowrap;text-overflow:ellipsis}.upl-meta{display:flex;align-items:center;gap:4px;height:14px;font-size:12px;font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--fill-on,#17181a) 52%,var(--fill-slab,#fff))}.upl-track{position:relative;height:4px;margin-top:4px;overflow:hidden;border-radius:2px;background:color-mix(in srgb,var(--fill-on,#17181a) 8%,var(--fill-slab,#fff))}.upl-bar{position:absolute;inset:0;border-radius:inherit;background:var(--signal,#3347e8);transform-origin:left center}.upl-roll{display:inline-flex;height:1em;line-height:1em;overflow:hidden}.upl-roll-col{display:inline-block;height:1em;overflow:hidden}.upl-roll-strip{display:flex;flex-direction:column;transition:transform 220ms cubic-bezier(.24,1.34,.38,1)}.upl-roll-strip>span{height:1em}.upl-end{display:grid;place-items:center;flex:none;width:22px;height:22px}.upl-tick{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:50%;background:var(--ok,#15803d);color:white;animation:upl-pop 380ms cubic-bezier(.3,1.6,.4,1) both}
.upl-tray{display:flex;justify-content:center;gap:20px}.upl-slot{position:relative;width:76px;height:75px}.upl-file{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:4px;cursor:grab;touch-action:none;outline:none;transition:transform 420ms var(--upl-spring),opacity 220ms ease}.upl-file[data-held]{z-index:5;cursor:grabbing;transition:none}.upl-file[data-gone]{opacity:0;pointer-events:none;transition:none}.upl-file:not([data-gone]){animation:upl-back 360ms var(--upl-spring) both}.upl-file:focus-visible .upl-page{outline:2px solid var(--signal,#3347e8);outline-offset:3px;border-radius:6px}.upl-page{overflow:visible}.upl-page-line{stroke:color-mix(in srgb,var(--fill-on,#17181a) 32%,var(--fill-slab,#fff));stroke-width:1.5;fill:none}.upl-page-ext{fill:white;font-family:inherit;font-weight:500}.upl-label{max-width:76px;overflow:hidden;font-size:11px;white-space:nowrap;text-overflow:ellipsis;color:color-mix(in srgb,var(--fill-on,#17181a) 72%,var(--fill-slab,#fff))}
@keyframes upl-gulp{0%{scale:1.02}35%{scale:.985}70%{scale:1.006}100%{scale:1}}@keyframes upl-open{40%{scale:1.08}}@keyframes upl-land{from{opacity:0;scale:.85;translate:0 10px}}@keyframes upl-pop{from{scale:0}}@keyframes upl-back{from{scale:.7;opacity:0}}
@media(prefers-reduced-motion:reduce){.upl-zone,.upl-icon,.upl-file,.upl-roll-strip{transition-duration:0ms!important}.upl-zone[data-gulp],.upl-zone[data-gulp] .upl-icon,.upl-now,.upl-tick,.upl-file:not([data-gone]){animation-duration:1ms!important}}
`;

const MAX = 5;
const FILES = [
  { id: "img", name: "mood.png", ext: "PNG", size: 2.4e6, tint: "#079455" },
  { id: "vid", name: "demo.mp4", ext: "MP4", size: 12.6e6, tint: "#155EEF" },
];
const SNARK = ["Still 12.6 MB. It didn't shrink.", "Pushing harder won't help", "Have you tried compressing it?", "The box is full of excuses now", "No."];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = b => b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`;
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Page({ file, size = 40 }) {
  return <svg className="upl-page" width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path className="upl-page-line" d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z" />
    <path className="upl-page-line" d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
    <rect width="29" height="16" x="1" y="18" rx="8" fill={file.tint} />
    <text x="15.5" y="29.1" textAnchor="middle" fontSize="9" className="upl-page-ext">{file.ext}</text>
  </svg>;
}

function Roll({ value }) {
  const digits = String(Math.round(value));
  return <span className="upl-roll" aria-label={`${digits}%`}>{digits.split("").map((digit, i) => <span key={`${i}-${digits.length}`} className="upl-roll-col"><span className="upl-roll-strip" style={{ transform: `translateY(${-Number(digit)}em)` }}>{"0123456789".split("").map(n => <span key={n}>{n}</span>)}</span></span>)}%</span>;
}

export function Upload({ speed = 50, bounce = 40, corner = 20, fill = "dark", stroke = false } = {}) {
  const still = reducedMotion();
  const [phase, setPhase] = useState({ kind: "idle" });
  const [inBox, setInBox] = useState(null);
  const [held, setHeld] = useState(null);
  const [over, setOver] = useState(false);
  const [refuse, setRefuse] = useState(null);
  const [gulp, setGulp] = useState(false);
  const tries = useRef(0);
  const cool = useRef(0);
  const zone = useRef(null);
  const now = useRef(null);
  const tiles = useRef({});
  const drag = useRef(null);
  const shake = useAnimationControls();
  const raf = useRef(0);
  const timers = useRef([]);
  const knobs = useRef({ speed });
  knobs.current = { speed };

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
    clearTimeout(cool.current);
  }, []);
  const later = (fn, ms) => { timers.current.push(window.setTimeout(fn, ms)); };

  const finish = file => {
    tries.current = 0;
    setPhase({ kind: "done", file });
    later(() => { setPhase({ kind: "idle" }); setInBox(null); }, 1500);
  };

  const send = file => {
    setInBox(file.id);
    if (still) { finish(file); return; }
    setPhase({ kind: "up", file, p: 0 });
    let progress = 0;
    let previous = 0;
    const seconds = (4 - clamp(knobs.current.speed, 0, 100) / 100 * 3.2) * (0.7 + Math.min(1, file.size / 5e6) * 0.6);
    const tick = time => {
      const dt = previous ? Math.min(0.05, (time - previous) / 1000) : 0;
      previous = time;
      progress = Math.min(1, progress + dt / seconds * (0.4 + Math.random() * 1.2));
      if (progress >= 1) { raf.current = 0; finish(file); return; }
      setPhase({ kind: "up", file, p: progress });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const refuseIt = () => {
    const attempt = tries.current++;
    setRefuse(attempt === 0 ? `Too big — up to ${MAX} MB` : SNARK[Math.min(attempt - 1, SNARK.length - 1)]);
    shake.start({ x: [0, -7, 6, -4, 2, 0], transition: { duration: 0.42 } });
    later(() => setRefuse(null), 1800);
    clearTimeout(cool.current);
    cool.current = window.setTimeout(() => { tries.current = 0; }, 8000);
  };

  const place = (id, dx, dy, lift) => {
    const el = tiles.current[id];
    if (!el) return;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${lift ? 1.08 : 1}) rotate(${lift ? clamp(dx * 0.04, -6, 6) : 0}deg)`;
  };
  const hits = event => {
    const rect = zone.current?.getBoundingClientRect();
    return !!rect && event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom;
  };
  const onDown = file => event => {
    if (inBox === file.id || phase.kind !== "idle") return;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* synthetic pointer */ }
    const scale = event.currentTarget.getBoundingClientRect().width / event.currentTarget.offsetWidth || 1;
    drag.current = { id: file.id, x0: event.clientX, y0: event.clientY, scale };
    setHeld(file.id);
    place(file.id, 0, 0, true);
  };
  const onMove = event => {
    const active = drag.current;
    if (!active) return;
    place(active.id, (event.clientX - active.x0) / active.scale, (event.clientY - active.y0) / active.scale, true);
    const isOver = hits(event) && phase.kind === "idle";
    if (isOver !== over) setOver(isOver);
  };
  const suck = (file, dx, dy, scale) => {
    const el = tiles.current[file.id];
    const target = zone.current;
    if (!el || !target || still) { place(file.id, 0, 0, false); send(file); return; }
    const a = el.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const tx = dx + (b.left + b.width / 2 - (a.left + a.width / 2)) / scale;
    const ty = dy + (b.top + b.height / 2 - (a.top + a.height / 2)) / scale;
    const ux = Math.abs(tx - dx), uy = Math.abs(ty - dy);
    const squeeze = Math.hypot(ux, uy) < 24 ? "scale(0.16)" : uy >= ux ? "scale(0.14, 0.34)" : "scale(0.34, 0.14)";
    el.style.transition = "transform 380ms cubic-bezier(.55,0,.85,.3), opacity 300ms ease-in 80ms";
    el.style.transform = `translate(${tx}px, ${ty}px) ${squeeze}`;
    el.style.opacity = "0";
    later(() => { setGulp(true); later(() => setGulp(false), 460); }, 200);
    later(() => send(file), 220);
    later(() => { el.style.transition = "none"; el.style.transform = ""; el.style.opacity = ""; }, 390);
  };
  const onUp = file => event => {
    const active = drag.current;
    drag.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* capture already released */ }
    setHeld(null);
    setOver(false);
    if (!active) return;
    if (hits(event) && phase.kind === "idle") {
      if (file.size > MAX * 1e6) refuseIt();
      else { suck(file, (event.clientX - active.x0) / active.scale, (event.clientY - active.y0) / active.scale, active.scale); return; }
    }
    place(file.id, 0, 0, false);
  };

  useLayoutEffect(() => {
    const box = zone.current;
    const row = now.current;
    if (!box) return;
    if (phase.kind === "idle" || !row) { box.style.width = ""; box.style.height = ""; return; }
    box.style.width = `${row.offsetWidth + 32}px`;
    box.style.height = `${row.offsetHeight + 28}px`;
  }, [phase.kind]);

  const r = clamp(corner, 0, 32);
  const isDark = fill === "dark";
  const fillStyle = { "--fill-on": isDark ? "#f5f5f3" : "#242424", "--fill-slab": isDark ? "#242424" : "#f5f5f3", "--pane-edge": isDark ? "#ffffff38" : "#22222238" };
  const uploading = phase.kind !== "idle";
  const file = uploading ? phase.file : null;
  return <>
    <style>{uploadStyles}</style>
    <div className="upl" data-stroke={stroke ? "on" : "off"} data-held={held ? "true" : undefined} style={{ ...fillStyle, "--upl-r": `${r}px`, "--upl-spring": `cubic-bezier(.3,${1 + clamp(bounce, 0, 100) / 100 * 0.9},.4,1)` }}>
      <motion.div animate={shake} className="upl-zone-wrap">
        <div ref={zone} className="upl-zone" data-over={over || undefined} data-refuse={refuse ? "true" : undefined} data-busy={uploading || undefined} data-gulp={gulp || undefined} aria-live="polite">
          {!file ? <><span className="upl-icon"><UploadIcon size={18} strokeWidth={2} /></span><span className="upl-say"><b>{refuse ?? (over ? "Drop to upload" : "Drag a file here")}</b><span>Up to {MAX} MB</span></span></> : <span className="upl-now" key={file.id} ref={now}><Page file={file} size={36} /><span className="upl-text"><span className="upl-name">{file.name}</span><span className="upl-meta">{fmt(file.size)} · {phase.kind === "done" ? "Uploaded" : <Roll value={phase.kind === "up" ? phase.p * 100 : 0} />}</span><span className="upl-track"><span className="upl-bar" style={{ transform: `scaleX(${phase.kind === "up" ? phase.p : 1})` }} /></span></span><span className="upl-end">{phase.kind === "done" && <span className="upl-tick"><Check size={14} strokeWidth={2} /></span>}</span></span>}
        </div>
      </motion.div>
      <div className="upl-tray">{FILES.map(item => <div key={item.id} className="upl-slot" data-empty={inBox === item.id || undefined}><div ref={el => { tiles.current[item.id] = el; }} className="upl-file" data-held={held === item.id || undefined} data-gone={inBox === item.id || undefined} role="button" tabIndex={0} aria-label={`${item.name}, ${fmt(item.size)}. Drag into the box to upload, or press Enter.`} onPointerDown={onDown(item)} onPointerMove={onMove} onPointerUp={onUp(item)} onPointerCancel={onUp(item)} onKeyDown={event => { if ((event.key === "Enter" || event.key === " ") && phase.kind === "idle" && inBox !== item.id) { event.preventDefault(); if (item.size > MAX * 1e6) refuseIt(); else send(item); } }}><Page file={item} /><span className="upl-label">{item.name}</span></div></div>)}</div>
    </div>
  </>;
}
