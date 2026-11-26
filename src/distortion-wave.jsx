import React, { useEffect, useRef, useState } from "react";
import "./distortion-wave.css";
import { Check, Coins } from "lucide-react";
import { DistortionWave } from "distortion-waves";

/** Transfer and Center examples for the Distortion Waves playground. */

function Avatar({ sourceRef }) {
  return (
    <span className="dw-avatar" ref={sourceRef} aria-hidden="true">
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

function Review({ sourceRef }) {
  return (
    <div className="dw-card dw-review">
      <Avatar sourceRef={sourceRef} />
      <p className="dw-to">Sending to <strong>Maya Chen</strong></p>
      <p className="dw-amount">$1,250.00</p>
      <div className="dw-lines">
        <div className="dw-line"><span>From</span><strong>Everyday ·· 4821</strong></div>
        <div className="dw-line"><span>Arrives</span><strong>In seconds</strong></div>
        <div className="dw-line"><span>Fee</span><strong>Free</strong></div>
        <div className="dw-line"><span>Note</span><strong>Studio rent</strong></div>
      </div>
    </div>
  );
}

function CreditRows() {
  return (
    <div className="dw-lines dw-credit-lines">
      <div className="dw-line"><span className="dw-row-check"><Check size={13} /></span><strong>Balance goes to $85.73 right away</strong></div>
      <div className="dw-line"><span className="dw-row-check"><Check size={13} /></span><strong>Use credits for document rewrites</strong></div>
      <div className="dw-line"><span className="dw-row-check"><Check size={13} /></span><strong>Credits never expire</strong></div>
    </div>
  );
}

function CreditsCard({ sourceRef }) {
  return (
    <div className="dw-card dw-credits">
      <span className="dw-token" ref={sourceRef} aria-hidden="true"><Coins size={26} strokeWidth={1.8} /></span>
      <h2>Add credits</h2>
      <p className="dw-credit-balance">Current balance: $65.73</p>
      <CreditRows />
    </div>
  );
}

function CreditsAdded() {
  return (
    <div className="dw-card dw-credits dw-credits-added">
      <span className="dw-check dw-credit-check" aria-hidden="true"><Check size={27} strokeWidth={2.8} /></span>
      <h2>Credits added</h2>
      <p className="dw-credit-balance">Current balance: $85.73</p>
      <CreditRows />
    </div>
  );
}

function Receipt() {
  return (
    <div className="dw-card dw-receipt">
      <span className="dw-check" aria-hidden="true"><Check size={28} strokeWidth={2.5} /></span>
      <p className="dw-eyebrow">Transfer complete</p>
      <p className="dw-to"><strong>Money sent</strong></p>
      <p className="dw-secure">Your transfer to Maya Chen is on its way.</p>
      <p className="dw-amount">$1,250.00</p>
    </div>
  );
}

export function DistortionWaveDemo({ type = "vertical" }) {
  const [sent, setSent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const button = useRef(null);
  const token = useRef(null);
  const processingTimer = useRef(null);
  const resetTimer = useRef(null);
  const isCenter = type === "center";

  useEffect(() => () => {
    window.clearTimeout(processingTimer.current);
    window.clearTimeout(resetTimer.current);
  }, []);

  function handleAction() {
    if (processing) return;
    if (sent) {
      window.clearTimeout(resetTimer.current);
      setSent(false);
      return;
    }

    if (!isCenter) {
      setSent(true);
      return;
    }

    setProcessing(true);
    processingTimer.current = window.setTimeout(() => {
      setProcessing(false);
      setSent(true);
    }, 850);
  }

  function handleFinish(revealed) {
    if (!isCenter || !revealed) return;
    resetTimer.current = window.setTimeout(() => setSent(false), 1900);
  }

  return (
    <DistortionWave
      className="dw-demo"
      data-sent={sent ? "true" : "false"}
      data-processing={processing ? "true" : "false"}
      type={type}
      palette={isCenter ? "green" : undefined}
      revealed={sent}
      onFinish={handleFinish}
      source={isCenter ? token : button}
      revealedContent={isCenter ? <CreditsAdded /> : <Receipt />}
      overlay={sent && !isCenter ? null : (
        <div className="dw-overlay">
          <button
            ref={button}
            className="dw-action"
            type="button"
            disabled={processing}
            onClick={handleAction}
          >
            {isCenter ? (processing ? "Processing…" : sent ? "Done" : "Buy $20 tokens") : "Confirm"}
          </button>
        </div>
      )}
      style={{
        width: "min(440px, calc(100vw - 48px))",
        height: 470,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      {isCenter ? <CreditsCard sourceRef={token} /> : <Review />}
    </DistortionWave>
  );
}
