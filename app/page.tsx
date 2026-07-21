"use client";

import { useCallback, useRef, useState } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { ComparisonPanel } from "@/components/comparison-panel";
import { CuriosityPanel, OrderPanel, SynthesisPanel } from "@/components/result-panels";
import { StatusProgress } from "@/components/status-progress";
import { requestAnalysis } from "@/lib/api";
import { claimRequest, releaseRequest } from "@/lib/request-gate";
import type { CuriosityResult, Lens, OrderResult, StandardResponse, SynthesisResult } from "@/lib/schemas";
import type { AnalysisMode } from "@/lib/types";

type Errors = Partial<Record<Lens, string>>;
type Loading = Partial<Record<Lens, boolean>>;

export default function Home() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<OrderResult>();
  const [curiosity, setCuriosity] = useState<CuriosityResult>();
  const [synthesis, setSynthesis] = useState<SynthesisResult>();
  const [comparison, setComparison] = useState<StandardResponse>();
  const [errors, setErrors] = useState<Errors>({});
  const [comparisonError, setComparisonError] = useState("");
  const [loading, setLoading] = useState<Loading>({});
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [converging, setConverging] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>();
  const activeLenses = useRef(new Set<Lens>());
  const analysisInFlight = useRef(false);
  const comparisonInFlight = useRef(false);
  const setLensLoading = (lens: Lens, active: boolean) => setLoading((current) => ({ ...current, [lens]: active }));

  const runLens = useCallback(async <T extends OrderResult | CuriosityResult | SynthesisResult>(lens: Lens, inputValue = input, orderValue = order, curiosityValue = curiosity): Promise<T | undefined> => {
    if (!claimRequest(activeLenses.current, lens)) return undefined;
    setErrors((current) => ({ ...current, [lens]: undefined }));
    setLensLoading(lens, true);
    try {
      const response = lens === "order"
        ? await requestAnalysis<T>({ lens, input: inputValue })
        : lens === "curiosity"
          ? await requestAnalysis<T>({ lens, input: inputValue })
          : orderValue && curiosityValue
            ? await requestAnalysis<T>({ lens, input: inputValue, order: orderValue, curiosity: curiosityValue })
            : (() => { throw new Error("Synthesis needs valid Order and Curiosity results."); })();
      setAnalysisMode(response.mode);
      if (lens === "order") setOrder(response.data as OrderResult);
      if (lens === "curiosity") setCuriosity(response.data as CuriosityResult);
      if (lens === "synthesis") setSynthesis(response.data as SynthesisResult);
      return response.data;
    } catch (error) {
      setErrors((current) => ({ ...current, [lens]: error instanceof Error ? error.message : "This lens could not be completed." }));
      return undefined;
    } finally { releaseRequest(activeLenses.current, lens); setLensLoading(lens, false); }
  }, [input, order, curiosity]);

  const runSynthesis = async (question: string, orderResult: OrderResult, curiosityResult: CuriosityResult) => {
    setConverging(true);
    try { await runLens<SynthesisResult>("synthesis", question, orderResult, curiosityResult); }
    finally { setConverging(false); }
  };

  const begin = async () => {
    if (analysisInFlight.current) return;
    const question = input.trim();
    if (!question) { setErrors({ order: "Enter a question or idea to begin." }); return; }
    analysisInFlight.current = true;
    try {
      setOrder(undefined); setCuriosity(undefined); setSynthesis(undefined); setComparison(undefined); setComparisonError(""); setErrors({});
      const [orderResult, curiosityResult] = await Promise.all([runLens<OrderResult>("order", question), runLens<CuriosityResult>("curiosity", question)]);
      if (orderResult && curiosityResult) await runSynthesis(question, orderResult, curiosityResult);
    } finally { analysisInFlight.current = false; }
  };

  const retry = async (lens: Lens) => {
    if (lens === "synthesis") { if (order && curiosity) await runSynthesis(input, order, curiosity); return; }
    const result = await runLens<OrderResult | CuriosityResult>(lens);
    const nextOrder = lens === "order" ? result as OrderResult : order;
    const nextCuriosity = lens === "curiosity" ? result as CuriosityResult : curiosity;
    if (nextOrder && nextCuriosity) await runSynthesis(input, nextOrder, nextCuriosity);
  };

  const compare = async () => {
    if (!input.trim() || comparisonLoading || comparisonInFlight.current || !synthesis) return;
    comparisonInFlight.current = true;
    setComparisonError(""); setComparisonLoading(true);
    try { const response = await requestAnalysis<StandardResponse>({ lens: "standard", input }); setComparison(response.data); setAnalysisMode(response.mode); }
    catch (error) { setComparisonError(error instanceof Error ? error.message : "The comparison could not be completed. Please retry."); }
    finally { comparisonInFlight.current = false; setComparisonLoading(false); }
  };

  const clear = () => { setInput(""); setOrder(undefined); setCuriosity(undefined); setSynthesis(undefined); setComparison(undefined); setErrors({}); setComparisonError(""); setCopyMessage(""); setAnalysisMode(undefined); };
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); setCopyMessage("Result copied to your clipboard."); } catch { setCopyMessage("Copy failed. Select the result text and copy it manually."); } };
  const busy = Object.values(loading).some(Boolean);
  const hasResults = order || curiosity || synthesis || Object.keys(errors).length > 0 || busy;

  return <main><header className="site-header"><a className="wordmark" href="#top" aria-label="NeuroCuria home">NEUROCURIA</a><span className="header-rule" /><p>Build Week Prototype</p></header>
    <section className="hero" id="top"><div className="orbital-mark" aria-hidden="true"><i /><b /></div><p className="eyebrow">A dual-lens AI reasoning instrument</p><h1>Rebis Engine</h1><p className="tagline">Examine what is supported. Explore what is possible. Synthesize what comes next.</p>{analysisMode === "demo" && <p className="demo-badge">Demo mode · results are predefined sample responses</p>}</section>
    <AnalysisForm value={input} onChange={setInput} onSubmit={begin} onClear={clear} busy={busy || comparisonLoading} />
    <StatusProgress loading={loading} converging={converging} />
    {hasResults && <section className="results" aria-label="Analysis results"><div className="lens-grid"><OrderPanel data={order} error={errors.order} loading={loading.order} retry={() => retry("order")} copy={copy} copyMessage={copyMessage} /><CuriosityPanel data={curiosity} error={errors.curiosity} loading={loading.curiosity} retry={() => retry("curiosity")} copy={copy} copyMessage={copyMessage} /></div><SynthesisPanel data={synthesis} error={errors.synthesis} loading={loading.synthesis} retry={() => retry("synthesis")} copy={copy} copyMessage={copyMessage} />{order && curiosity && synthesis && <ComparisonPanel input={input} order={order} curiosity={curiosity} synthesis={synthesis} data={comparison} error={comparisonError} loading={comparisonLoading} onCompare={compare} onCopy={copy} />}</section>}
    <footer><span>Experimental prototype · AI can be wrong.</span><span>Use qualified professional guidance for high-stakes decisions.</span><span>NeuroCuria / Rebis Engine</span></footer>
  </main>;
}
