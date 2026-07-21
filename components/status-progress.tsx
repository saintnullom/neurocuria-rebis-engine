"use client";

import { useEffect, useState } from "react";
import { loadingMessage } from "@/lib/presentation";
import type { Lens } from "@/lib/schemas";

export function StatusProgress({ loading, converging = false }: { loading: Partial<Record<Lens, boolean>>; converging?: boolean }) {
  const [step, setStep] = useState(0);
  const active = (Object.keys(loading) as Lens[]).filter((lens) => loading[lens]);

  useEffect(() => {
    if (!active.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(0); return; }
    const timer = window.setInterval(() => setStep((current) => current + 1), 2400);
    return () => window.clearInterval(timer);
  }, [active.length]);

  if (!active.length && !converging) return null;
  return <section className="progress" aria-live="polite" aria-label="Analysis progress">
    {active.length > 0 && <><p className="eyebrow">Processing stages</p>{active.map((lens) => <div className="progress-item" key={lens}><span className={`pulse ${lens}`} aria-hidden="true" /><span><b>{lens}</b> · {loadingMessage(lens, step)}</span></div>)}</>}
    {converging && <div className="convergence" role="status"><span className="convergence-line order-line" aria-hidden="true" /><span className="convergence-line curiosity-line" aria-hidden="true" /><p><b>Converging perspectives</b><br />Preparing Synthesis from the completed lenses.</p></div>}
  </section>;
}
