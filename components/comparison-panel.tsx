"use client";

import { compactRebisSummary } from "@/lib/presentation";
import type { CuriosityResult, OrderResult, StandardResponse, SynthesisResult } from "@/lib/schemas";

type Props = {
  input: string;
  order: OrderResult;
  curiosity: CuriosityResult;
  synthesis: SynthesisResult;
  data?: StandardResponse;
  error?: string;
  loading: boolean;
  onCompare: () => void;
  onCopy: (text: string) => void;
};

export function ComparisonPanel({ input, order, curiosity, synthesis, data, error, loading, onCompare, onCopy }: Props) {
  const summary = compactRebisSummary(order.summary, curiosity.mostPromisingIdea.title, synthesis.recommendedPath.title);
  return <section className="comparison-panel" aria-labelledby="comparison-title">
    <header><div><p className="eyebrow">Optional comparison</p><h2 id="comparison-title">Compare with Standard Response</h2><p>Inspect a concise single-pass answer beside Rebis’s visible reasoning structure.</p></div>{!data && <button className="secondary-button" type="button" onClick={onCompare} disabled={loading} aria-label="Compare this question with a standard response">{loading ? "Preparing comparison…" : "Compare with Standard Response"}</button>}</header>
    <p className="comparison-note">This comparison highlights differences in reasoning structure. It is not a controlled benchmark, and outputs may vary.</p>
    {error && <div className="panel-error" role="alert"><p>{error}</p><button className="small-button" type="button" onClick={onCompare}>Retry comparison</button></div>}
    {data && <div className="comparison-grid"><article className="standard-response"><div className="comparison-title"><p className="eyebrow">Standard Response</p><button className="icon-button" type="button" onClick={() => onCopy(JSON.stringify(data, null, 2))} aria-label="Copy standard comparison result">Copy</button></div><p className="lead">{data.answer}</p><h3>Key considerations</h3><ul>{data.keyConsiderations.map((item, index) => <li key={index}>{item}</li>)}</ul><h3>Recommended next step</h3><p>{data.recommendedNextStep}</p><h3>Remaining uncertainty</h3><p>{data.uncertainty}</p></article>
      <article className="rebis-compact"><p className="eyebrow">Rebis</p><h3>Three-lens summary</h3>{summary.map((item) => <div className="compact-item" key={item.label}><b>{item.label}</b><p>{item.value}</p></div>)}</article></div>}
    {!data && !error && <p className="comparison-question">Original question: <q>{input}</q></p>}
  </section>;
}
