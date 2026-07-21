"use client";

import { confidenceLabel, noveltyLabel } from "@/lib/presentation";
import type { CuriosityResult, Lens, OrderResult, SynthesisResult } from "@/lib/schemas";

type BaseProps = { copy: (text: string) => void; copyMessage?: string; retry?: () => void; error?: string; loading?: boolean };

function PanelShell({ lens, title, purpose, children, retry, error, loading, onCopy, copyMessage }: BaseProps & { lens: Lens; title: string; purpose: string; children?: React.ReactNode; onCopy: () => void }) {
  return <article className={`panel ${lens}`} aria-labelledby={`${lens}-title`}>
    <header className="panel-header"><div><p className="eyebrow">{lens === "synthesis" ? "Convergence" : "Reasoning lens"}</p><h2 id={`${lens}-title`}>{title}</h2><p>{purpose}</p></div><button className="icon-button" type="button" onClick={onCopy} aria-label={`Copy ${title} result`}>Copy</button></header>
    {loading && <div className="panel-loading"><span className={`pulse ${lens}`} aria-hidden="true" />{title} is processing.</div>}
    {error && <div className="panel-error" role="alert"><p>{error}</p>{retry && <button className="small-button" type="button" onClick={retry}>Retry {title}</button>}</div>}
    {!loading && !error && children}
    {copyMessage && <p className="copy-message" role="status">{copyMessage}</p>}
  </article>;
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <section className="data-block"><h3>{title}</h3><ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></section>;
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="detail"><summary>{title}<span aria-hidden="true">+</span></summary><div className="detail-content">{children}</div></details>;
}

export function OrderPanel({ data, ...props }: BaseProps & { data?: OrderResult }) {
  const copy = () => { if (data) props.copy(JSON.stringify(data, null, 2)); };
  return <PanelShell {...props} onCopy={copy} lens="order" title="Order" purpose="What is supported, uncertain, constrained, and worth testing?">
    {data && <div className="panel-body">
      <p className="lead">{data.summary}</p>
      <section className="confidence" aria-label={confidenceLabel(data.confidence.score)}><div className="confidence-head"><span>Reasoning confidence</span><strong>{data.confidence.score}<small>/100</small></strong></div><div className="confidence-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.confidence.score} aria-valuetext={confidenceLabel(data.confidence.score)}><span className="confidence-fill" style={{ width: `${data.confidence.score}%` }} /></div><p>{data.confidence.explanation}</p><em>Estimate, not a statistical guarantee.</em></section>
      <section className="data-block primary-block"><h3>Risks and mitigations</h3>{data.risks.map((item, i) => <div className="item-card" key={i}><span className={`tag ${item.severity}`}>{item.severity} severity</span><p><b>{item.risk}</b><br />{item.mitigation}</p></div>)}</section>
      <Detail title="Evidence, assumptions, and unknowns"><List title="Known conditions" items={data.knowns} /><section className="data-block"><h3>Assumptions</h3>{data.assumptions.map((item, i) => <div className="item-card" key={i}><span className={`tag ${item.risk}`}>{item.risk} risk</span><p>{item.statement}</p></div>)}</section><List title="Missing information" items={data.missingInformation} /><List title="Tensions" items={data.contradictionsOrTensions} /><List title="Verification questions" items={data.verificationQuestions} /></Detail>
    </div>}
  </PanelShell>;
}

export function CuriosityPanel({ data, ...props }: BaseProps & { data?: CuriosityResult }) {
  const copy = () => { if (data) props.copy(JSON.stringify(data, null, 2)); };
  return <PanelShell {...props} onCopy={copy} lens="curiosity" title="Curiosity" purpose="What else could this become, mean, reveal, or connect to?">
    {data && <div className="panel-body"><p className="lead">{data.reframe}</p>
      <section className="promising"><p className="eyebrow">Most promising</p><h3>{data.mostPromisingIdea.title}</h3><p>{data.mostPromisingIdea.reason}</p></section>
      <section className="data-block primary-block possibilities"><h3>Possibilities</h3>{data.possibilities.map((item, i) => <div className="item-card luminous" key={i}><span className={`tag novelty-${item.novelty}`} aria-label={noveltyLabel(item.novelty)}>{item.novelty}</span><p><b>{item.title}</b><br />{item.description}</p></div>)}</section>
      <Detail title="Connections, questions, and inversions"><section className="data-block"><h3>Useful connections</h3>{data.connections.map((item, i) => <div className="item-card" key={i}><p><b>{item.domain}</b><br />{item.connection}</p></div>)}</section><List title="What if…" items={data.whatIfQuestions} /><List title="Inversions" items={data.inversions} /></Detail>
    </div>}
  </PanelShell>;
}

export function SynthesisPanel({ data, ...props }: BaseProps & { data?: SynthesisResult }) {
  const copy = () => { if (data) props.copy(JSON.stringify(data, null, 2)); };
  return <PanelShell {...props} onCopy={copy} lens="synthesis" title="Synthesis" purpose="What is the most promising path forward, and how can it be tested?">
    {data && <div className="panel-body"><section className="recommended"><p className="eyebrow">Recommended path</p><h3>{data.recommendedPath.title}</h3><p>{data.recommendedPath.rationale}</p></section><p className="lead integrated">{data.integratedInsight}</p>
      <section className="data-block primary-block"><h3>Next actions</h3>{data.nextActions.map((item, i) => <div className="item-card action" key={i}><span className="tag timeframe">{item.timeframe}</span><p><b>{item.action}</b><br />{item.purpose}</p></div>)}</section>
      <Detail title="Agreement, tension, and experiments"><List title="Where the lenses agree" items={data.agreements} /><section className="data-block"><h3>Productive tensions</h3>{data.productiveTensions.map((item, i) => <div className="item-card" key={i}><p><b>{item.tension}</b><br />{item.interpretation}</p></div>)}</section><section className="data-block"><h3>Small experiments</h3>{data.experiments.map((item, i) => <div className="experiment" key={i}><h4>{item.name}</h4><p><b>Method:</b> {item.method}</p><p><b>Signal:</b> {item.successSignal}</p><p><b>Would weaken it:</b> {item.failureSignal}</p></div>)}</section><List title="Remaining uncertainty" items={data.remainingUncertainty} /></Detail><p className="reflection">{data.finalReflection}</p>
    </div>}
  </PanelShell>;
}
