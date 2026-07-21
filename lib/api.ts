import type { AnalysisRequest, CuriosityResult, OrderResult, StandardResponse, SynthesisResult } from "@/lib/schemas";
import type { AnalysisMode } from "@/lib/types";

export async function requestAnalysis<T extends OrderResult | CuriosityResult | StandardResponse | SynthesisResult>(payload: AnalysisRequest): Promise<{ data: T; mode: AnalysisMode }> {
  const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body: { data?: T; mode?: AnalysisMode; error?: string } = await response.json().catch(() => ({}));
  if (!response.ok || !body.data || !body.mode) throw new Error(body.error || "The request could not be completed.");
  return { data: body.data, mode: body.mode };
}
