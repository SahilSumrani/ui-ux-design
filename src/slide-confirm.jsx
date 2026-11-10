import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

/**
 * Slide to confirm.
 * Install: npm install framer-motion lucide-react
 * Import: import { SlideConfirm } from "./slide-confirm";
 * Use: <SlideConfirm corner={28} speed={50} width={280} />
 * The component styles are included below, so this is the only file needed.
 */

const slideConfirmStyles = `
.sld{box-sizing:border-box;font-family:inherit;color:var(--sld-on,#f5f5f3);max-width:calc(100% - 32px)}
.sld-track{position:relative;width:100%;height:100%;box-sizing:border-box;background:var(--sld-slab,#242424);touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden}
.sld-track[data-stroke="on"]{box-shadow:inset 0 0 0 1px #ffffff35}
.sld-wash{position:absolute;left:4px;top:4px;bottom:4px;z-index:1;background:var(--sld-on,#f5f5f3);pointer-events:none}
.sld-label{position:absolute;inset:0;z-index:0;display:grid;place-items:center;color:#ffffff91;font-size:14px;font-weight:500;letter-spacing:-.01em;pointer-events:none;white-space:nowrap}
.sld-grip{position:absolute;left:4px;top:4px;z-index:2;height:48px;padding:0;border:0;background:var(--sld-on,#f5f5f3);color:#242424;cursor:grab;pointer-events:auto;transform-origin:0% 50%;transition:none}
.sld-track[data-held] .sld-grip{cursor:grabbing}
.sld-arrow,.sld-done{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;pointer-events:none}
@media(prefers-reduced-motion:reduce){.sld-done{transition-duration:160ms}}
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const HEIGHT = 56;
const PAD = 4;
const GRIP = HEIGHT - PAD * 2;

export function SlideConfirm({ corner = 28, speed = 50, width = 280, onConfirm }) {
  const [done, setDone] = useState(false);
  const [hot, setHot] = useState(false);
  const [held, setHeld] = useState(false);
  const track = useRef(null);
  const drag = useRef(null);
  const cleanup = useRef(null);
  const resetTimer = useRef(null);
  const x = useMotionValue(0);
  const anchor = useMotionValue(0);
  const pulse = useMotionValue(1);
  const arrowVisible = useMotionValue(1);

  const span = clamp(Math.round(width), 220, 380);
  const travel = span - PAD * 2 - GRIP;
  const radius = clamp(corner, 0, HEIGHT / 2);
  const gripRadius = Math.max(0, radius - PAD);
  const stiffness = 260 + clamp(speed, 0, 100) / 100 * 640;
  const commitSpring = { type: "spring", stiffness, damping: 2 * Math.sqrt(stiffness * 0.9), mass: 0.9 };
  const returnSpring = { ...commitSpring, damping: 2 * Math.sqrt(stiffness * 0.9) * 0.62 };
  const position = useTransform(x, value => clamp(value, 0, travel));
  const gripWidth = useTransform([position, anchor], ([value, planted]) => GRIP + clamp(planted - value, 0, travel));
  const washWidth = useTransform(position, value => value + GRIP);
  const labelOpacity = useTransform(position, [0, travel * 0.55], [1, 0]);
  const arrowOpacity = useTransform([position, arrowVisible], ([value, visible]) => visible * clamp(1 - (value - travel * 0.55) / (travel * 0.4), 0, 1));
  const overshoot = useTransform(x, value => Math.max(0, -value));
  const squash = useTransform(overshoot, value => 1 - Math.min(0.08, value / 110));
  const scaleX = useTransform(squash, value => value * (hot && !held && !done ? 1.03 : 1));
  const scaleY = useTransform(squash, value => 1 / value * (hot && !held && !done ? 1.03 : 1));

  const localX = clientX => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect) return 0;
    return (clientX - rect.left) / (rect.width / span || 1);
  };

  const unwatch = () => {
    cleanup.current?.();
    cleanup.current = null;
  };

  const finish = () => {
    setDone(true);
    anchor.set(x.get());
    animate(arrowVisible, 0, { duration: 0.16 });
    animate(x, 0, commitSpring);
    animate(pulse, [1, 0.974, 1], { duration: 0.42, times: [0, 0.62, 1], ease: [0.33, 0.55, 0.2, 1], delay: 0.1 });
    onConfirm?.();
    resetTimer.current = window.setTimeout(() => {
      setDone(false);
      animate(arrowVisible, 1, { duration: 0.22, delay: 0.12 });
      animate(anchor, 0, { type: "spring", stiffness: 380, damping: 34, mass: 0.9 });
    }, 1500);
  };

  const move = event => {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    const at = localX(event.clientX);
    if (active.grab === null) {
      active.grab = at - x.get();
      return;
    }
    x.set(clamp(at - active.grab, 0, travel));
  };

  const up = event => {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    drag.current = null;
    unwatch();
    try { track.current?.releasePointerCapture?.(event.pointerId); } catch { /* capture may already be released */ }
    setHeld(false);
    if (x.get() >= travel) finish();
    else animate(x, 0, returnSpring);
  };

  const onPointerDown = event => {
    if (done || event.button !== 0) return;
    event.stopPropagation();
    const startedOnGrip = event.target instanceof Element && Boolean(event.target.closest(".sld-grip"));
    drag.current = { id: event.pointerId, grab: startedOnGrip ? localX(event.clientX) - x.get() : null };
    setHeld(true);
    try { track.current?.setPointerCapture(event.pointerId); } catch { /* synthetic pointer */ }
    unwatch();
    const onMove = nativeEvent => move(nativeEvent);
    const onUp = nativeEvent => up(nativeEvent);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    cleanup.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  };

  useEffect(() => () => {
    window.clearTimeout(resetTimer.current);
    unwatch();
  }, []);

  return (
    <>
      <style>{slideConfirmStyles}</style>
      <div className="sld" style={{ width: span, height: HEIGHT, "--sld-on": "#f5f5f3", "--sld-slab": "#242424" }}>
        <motion.div ref={track} className="sld-track" style={{ borderRadius: radius, scale: pulse }} data-stroke="on" data-held={held || undefined} data-done={done || undefined} onPointerDown={onPointerDown}>
          <motion.i className="sld-wash" aria-hidden="true" style={{ width: washWidth, borderRadius: gripRadius }} />
          <motion.span className="sld-label" style={{ opacity: labelOpacity }}>Slide to confirm</motion.span>
          <motion.button type="button" className="sld-grip" onPointerEnter={() => setHot(true)} onPointerLeave={() => setHot(false)} style={{ x: position, scaleX, scaleY, width: gripWidth, borderRadius: gripRadius }} aria-label={done ? "Confirmed" : "Slide to confirm"}>
            <motion.span className="sld-arrow" style={{ opacity: arrowOpacity }} aria-hidden="true"><ArrowRight size={20} strokeWidth={2} /></motion.span>
            <motion.span className="sld-done" aria-hidden="true" initial={false} animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.7 }} transition={{ duration: 0.16, ease: [0.33, 0.55, 0.2, 1] }}><Check size={20} strokeWidth={2} />Confirmed</motion.span>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
