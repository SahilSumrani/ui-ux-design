import React, { useRef, useState } from "react";
import "./distortion-wave.css";
import { Check } from "lucide-react";
import { DistortionWave } from "distortion-waves";

/**
 * The Transfer example from the Distortion Waves usage snippet.
 * Install: npm install distortion-waves
 * Use: <DistortionWaveDemo />
 */


function Avatar() {
  return (
    <span className="dw-avatar" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M7 48c1-10 7-16 17-16s16 6 17 16" fill="#29372d" />
        <path d="M16 21c0-9 4-14 9-14 7 0 10 6 9 15l-3 10H19z" fill="#3b2d25" />
        <path d="M18 20c0-7 3-11 7-11 5 0 8 4 8 11v4c0 6-4 10-8 10s-7-4-7-10z" fill="#d9a879" />
        <path d="M17 20c0-9 4-14 10-14 7 0 11 6 10 16-2-2-4-5-5-8-4 4-9 6-15 6z" fill="#543d31" />
        <path d="M21 24h.2M30 24h.2" stroke="#33251f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M23 29c1.5 1 3 1 4.5 0" stroke="#8b5144" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Review() {
  return <div className="dw-card dw-review">
    <Avatar/>
    <p className="dw-to">Sending to <strong>Maya Chen</strong></p>
    <p className="dw-amount">$1,250.00</p>
    <div className="dw-lines">
      <div className="dw-line"><span>From</span><strong>Everyday ·· 4821</strong></div>
      <div className="dw-line"><span>Arrives</span><strong>In seconds</strong></div>
      <div className="dw-line"><span>Fee</span><strong>Free</strong></div>
      <div className="dw-line"><span>Note</span><strong>Studio rent</strong></div>
    </div>
  </div>;
}

function Receipt() {
  return <div className="dw-card dw-receipt">
    <span className="dw-check" aria-hidden="true"><Check size={28} strokeWidth={2.5}/></span>
    <p className="dw-eyebrow">Transfer complete</p>
    <p className="dw-to"><strong>Money sent</strong></p>
    <p className="dw-secure">Your transfer to Maya Chen is on its way.</p>
    <p className="dw-amount">$1,250.00</p>
  </div>;
}

export function DistortionWaveDemo({type="vertical"}) {
  const [sent, setSent] = useState(false);
  const button = useRef(null);


  return (
    <DistortionWave
      className="dw-demo"
      data-sent={sent ? "true" : "false"}
      type={type}
      revealed={sent}
      source={button}
      revealedContent={<Receipt />}
      overlay={
        sent ? null : (
          <div className="dw-overlay">
            <button
              ref={button}
              className="dw-action"
              type="button"
              onClick={() => setSent(true)}
            >
              Confirm
            </button>
          </div>
        )
      }
      style={{
        width: "min(440px, calc(100vw - 48px))",
        height: 470,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <Review />
    </DistortionWave>
  );
}
