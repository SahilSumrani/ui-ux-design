import React, { useEffect, useRef } from "react";
import { mountDaylightToggle } from "./daylight-toggle.js";
import "./daylight-toggle.css";

/** Daylight Toggle by @Lattice_Node (MIT). */
export function DaylightToggle() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return mountDaylightToggle(rootRef.current);
  }, []);

  return (
    <div ref={rootRef} data-ld-part="toggle-daylight" lang="ja">
      <canvas className="scene" aria-hidden="true" />
      <button
        className="hit"
        type="button"
        role="switch"
        aria-checked="false"
        aria-label="昼"
      />
      <span className="vh" role="status" aria-live="polite" data-status />
      <span className="probe" aria-hidden="true" />
    </div>
  );
}
