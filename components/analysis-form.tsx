"use client";

import { useState } from "react";

const examples = [
  "Should I turn my creative project into a paid product?",
  "What assumptions am I making about changing careers?",
  "How could an ordinary delivery route become a laboratory for observation and creative thinking?"
];

export function AnalysisForm({ value, onChange, onSubmit, onClear, busy }: { value: string; onChange: (value: string) => void; onSubmit: () => void; onClear: () => void; busy: boolean }) {
  const [showMethod, setShowMethod] = useState(false);
  const limit = 4000;
  return <section className="input-section" aria-labelledby="question-title">
    <div className="section-head"><div><p className="eyebrow">Input</p><h2 id="question-title">Bring one unfinished question.</h2></div><button className="text-button" type="button" onClick={() => setShowMethod(!showMethod)} aria-expanded={showMethod}>About the method</button></div>
    {showMethod && <p className="method-note">Rebis applies two independent prompts to the same text: one tests support and constraints, the other explores plausible alternatives. A third stage integrates their structured outputs. It may make mistakes and is not professional advice.</p>}
    <label className="sr-only" htmlFor="rebis-question">Your question, problem, decision, hypothesis, or unfinished idea</label>
    <textarea id="rebis-question" value={value} onChange={(event) => onChange(event.target.value)} maxLength={limit} placeholder="For example: What assumptions am I making about changing careers?" rows={6} disabled={busy} />
    <div className="input-meta"><span>{value.length.toLocaleString()} / {limit.toLocaleString()}</span><span>One question at a time</span></div>
    <div className="examples" aria-label="Example prompts"><span>Try an example:</span>{examples.map((example) => <button type="button" key={example} onClick={() => onChange(example)} disabled={busy}>{example}</button>)}</div>
    <div className="input-actions"><button className="primary-button" type="button" onClick={onSubmit} disabled={busy || !value.trim()}>{busy ? "Analyzing…" : "Begin Rebis Analysis"}<span aria-hidden="true">→</span></button><button className="clear-button" type="button" onClick={onClear} disabled={busy || !value}>Clear</button></div>
  </section>;
}
