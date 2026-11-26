import React, { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
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
.dw-demo{position:relative;width:min(340px,calc(100vw - 68px));height:352px;color:#f4f5f8;font-family:inherit}
.dw-demo [data-dw-layer="content"],.dw-demo [data-dw-layer="revealed"]{min-width:0;min-height:0}
.dw-screen{position:relative;box-sizing:border-box;width:100%;height:100%;overflow:hidden;border:1px solid #ffffff16;border-radius:26px;background:linear-gradient(145deg,#191b22,#101116 72%);color:#f4f5f8}
.dw-review{display:flex;flex-direction:column;align-items:center;padding:22px 22px 70px;text-align:center}
.dw-mark{display:grid;place-items:center;width:42px;height:42px;margin-bottom:13px;border:1px solid #ffffff14;border-radius:14px;background:#ffffff0a;color:#8eafff}
.dw-kicker{margin:0;color:#9699a4;font:10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em;text-transform:uppercase}
.dw-amount{margin:7px 0 2px;font-size:31px;font-weight:550;letter-spacing:-.06em}
.dw-to{margin:0;color:#a8abb5;font-size:12px}.dw-to strong{color:#f2f3f6;font-weight:550}
.dw-lines{width:100%;margin:18px 0 0;padding:0 13px;border:1px solid #ffffff10;border-radius:15px;background:#ffffff05}
.dw-line{display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid #ffffff0d;color:#9295a0;font-size:11px;text-align:left}
.dw-line:last-child{border-bottom:0}.dw-line strong{color:#e7e8ec;font-weight:500;text-align:right}
.dw-secure{display:flex;align-items:center;gap:5px;margin-top:12px;color:#777b87;font-size:10px}
.dw-receipt{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px;text-align:center;background:radial-gradient(ellipse at 50% 0%,#203a70 0,#171b29 42%,#101116 84%)}
.dw-check{display:grid;place-items:center;width:58px;height:58px;margin-bottom:17px;border:1px solid #7aabff61;border-radius:50%;background:linear-gradient(145deg,#5895ff,#345fd1);color:#fff;box-shadow:0 0 35px #4384ff55}
.dw-receipt h3{margin:0;font-size:21px;font-weight:550;letter-spacing:-.04em}.dw-receipt p{max-width:225px;margin:8px 0 0;color:#a9afbf;font-size:12px;line-height:1.55}
.dw-receipt .dw-receipt-amount{margin-top:18px;color:#eef3ff;font-size:22px;font-variant-numeric:tabular-nums}
.dw-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding:0 20px 18px;box-sizing:border-box;pointer-events:none}
.dw-action{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;min-height:42px;border:0;border-radius:14px;background:#f4f5f7;color:#17191f;font-family:inherit;font-size:12px;font-weight:500;cursor:pointer;pointer-events:auto;transition:transform .18s,background .18s}
.dw-action:hover{transform:translateY(-1px);background:#fff}.dw-action:active{transform:scale(.985)}.dw-action:focus-visible{outline:2px solid #8db2ff;outline-offset:3px}
@media(prefers-reduced-motion:reduce){.dw-action{transition:none}}
`;

function Review() {
  return <div className="dw-screen dw-review">
    <span className="dw-mark" aria-hidden="true"><CreditCard size={19}/></span>
    <p className="dw-kicker">Transfer review</p>
    <p className="dw-amount">$1,250.00</p>
    <p className="dw-to">Sending to <strong>Maya Chen</strong></p>
    <div className="dw-lines">
      <div className="dw-line"><span>From</span><strong>Everyday ·· 4821</strong></div>
      <div className="dw-line"><span>Arrives</span><strong>In seconds</strong></div>
      <div className="dw-line"><span>Transfer fee</span><strong>Free</strong></div>
      <div className="dw-line"><span>Note</span><strong>Studio rent</strong></div>
    </div>
    <span className="dw-secure"><ShieldCheck size={12}/> Secure transfer</span>
  </div>;
}

function Receipt() {
  return <div className="dw-screen dw-receipt">
    <span className="dw-check" aria-hidden="true"><Check size={27} strokeWidth={2.2}/></span>
    <p className="dw-kicker">Transfer complete</p>
    <h3>Money sent</h3>
    <p>Your transfer to Maya Chen is on its way.</p>
    <span className="dw-receipt-amount">$1,250.00</span>
  </div>;
}

export function DistortionWaveDemo() {
  const [sent, setSent] = useState(false);
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
    type="vertical"
    palette="ocean"
    revealed={sent}
    source={button}
    revealedContent={<Receipt/>}
    overlay={<div className="dw-overlay"><button ref={button} className="dw-action" type="button" onClick={() => setSent(value => !value)}>
      {sent ? <>Send another <ArrowLeft size={15}/></> : <>Confirm transfer <ArrowRight size={15}/></>}
    </button></div>}
    style={{ width: "min(340px, calc(100vw - 68px))", height: 352, borderRadius: 26, overflow: "hidden" }}
  >
    <Review/>
  </DistortionWave>;
}
