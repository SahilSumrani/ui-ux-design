import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { DistortionWave } from "distortion-waves";

/**
 * Distortion Waves: a dark review card carried into its receipt by a colourful wave.
 * Install: npm install distortion-waves lucide-react
 * Import: import { DistortionWaveDemo } from "./distortion-wave";
 * Use: <DistortionWaveDemo />
 * Requires WebGL 2 for the wave; the package falls back to a crossfade otherwise.
 * Styles are included here so this component is a single copyable file.
 */
const styles = `
.dw-demo{position:relative;width:min(380px,calc(100vw - 68px));height:352px;color:#f4f5f8;color-scheme:dark;font-family:inherit}
.dw-demo [data-dw-layer="content"],.dw-demo [data-dw-layer="revealed"]{min-width:0;min-height:0}
.dw-screen{position:relative;box-sizing:border-box;width:100%;height:100%;overflow:hidden;border:1px solid #ffffff16;border-radius:26px;background:linear-gradient(145deg,#191b22,#101116 72%);color:#f4f5f8}
.dw-review{display:flex;flex-direction:column;align-items:center;padding:25px 22px 60px;text-align:center}
.dw-avatar,.dw-check{display:grid;place-items:center;width:48px;height:48px;margin-bottom:14px;overflow:hidden;border:1px solid #a7a27a88;border-radius:50%;background:radial-gradient(circle at 50% 30%,#d9c59a 0 18%,#765a3e 19% 36%,#3b4538 37% 100%);color:#fff}
.dw-avatar svg{width:100%;height:100%}
.dw-check{border-color:#54dc8b66;background:#16bd59;color:#fff}
.dw-amount{margin:7px 0 2px;font-size:32px;font-weight:550;letter-spacing:-.06em}
.dw-to{margin:0;color:#a8abb5;font-size:13px}.dw-to strong{color:#f2f3f6;font-weight:550}
.dw-lines{width:100%;margin:18px 0 0;padding:0 13px;border:1px solid #ffffff10;border-radius:24px;background:#ffffff05}
.dw-line{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid #ffffff0d;color:#9295a0;font-size:12px;text-align:left}
.dw-line:last-child{border-bottom:0}.dw-line strong{color:#e7e8ec;font-weight:500;text-align:right}
.dw-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding:0 20px 18px;box-sizing:border-box;pointer-events:none}
.dw-action{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;min-height:42px;border:0;border-radius:999px;background:#f4f5f7;color:#17191f;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;pointer-events:auto;transition:transform .18s,background .18s}
.dw-action:hover{transform:translateY(-1px);background:#fff}.dw-action:active{transform:scale(.985)}.dw-action:focus-visible{outline:2px solid #8db2ff;outline-offset:3px}
@media(prefers-reduced-motion:reduce){.dw-action{transition:none}}
`;

function Avatar() {
  return <span className="dw-avatar" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M7 48c1-10 7-16 17-16s16 6 17 16" fill="#29372d"/><path d="M16 21c0-9 4-14 9-14 7 0 10 6 9 15l-3 10H19z" fill="#3b2d25"/><path d="M18 20c0-7 3-11 7-11 5 0 8 4 8 11v4c0 6-4 10-8 10s-7-4-7-10z" fill="#d9a879"/><path d="M17 20c0-9 4-14 10-14 7 0 11 6 10 16-2-2-4-5-5-8-4 4-9 6-15 6z" fill="#543d31"/><path d="M21 24h.2M30 24h.2" stroke="#33251f" strokeWidth="1.5" strokeLinecap="round"/><path d="M23 29c1.5 1 3 1 4.5 0" stroke="#8b5144" strokeWidth="1.2" strokeLinecap="round"/></svg></span>;
}

function Review({sent=false}) {
  return <div className="dw-screen dw-review">
    {sent ? <span className="dw-check" aria-hidden="true"><Check size={24} strokeWidth={2.6}/></span> : <Avatar/>}
    <p className="dw-to">{sent ? "Sent to" : "Sending to"} <strong>Maya Chen</strong></p>
    <p className="dw-amount">$1,250.00</p>
    <div className="dw-lines">
      <div className="dw-line"><span>From</span><strong>Everyday ·· 4821</strong></div>
      <div className="dw-line"><span>{sent ? "Arrived" : "Arrives"}</span><strong>{sent ? "12:20 AM" : "In seconds"}</strong></div>
      <div className="dw-line"><span>Fee</span><strong>Free</strong></div>
      <div className="dw-line"><span>Note</span><strong>Studio rent</strong></div>
    </div>
  </div>;
}

export function DistortionWaveDemo({type="vertical", palette="colorful", touchOrientation=false}) {
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState(null);
  const button = useRef(null);

  useEffect(() => {
    if (document.getElementById("distortion-wave-demo-styles")) return;
    const style = document.createElement("style");
    style.id = "distortion-wave-demo-styles";
    style.textContent = styles;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return <DistortionWave
    className="dw-demo"
    type={type}
    palette={palette}
    focus={touchOrientation ? focus : null}
    onPointerDownCapture={event => {
      if (!touchOrientation) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setFocus({x:event.clientX-rect.left,y:event.clientY-rect.top});
    }}
    revealed={sent}
    source={button}
    revealedContent={<Review sent/>}
    overlay={<div className="dw-overlay"><button ref={button} className="dw-action" type="button" onClick={() => { if (!sent) setSent(true); }}>
      {sent ? "Done" : "Confirm"}
    </button></div>}
    style={{ width: "min(380px, calc(100vw - 68px))", height: 352, borderRadius: 26, overflow: "hidden" }}
  >
    <Review/>
  </DistortionWave>;
}
