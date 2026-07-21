import type { AnalysisOperation } from "@/lib/schemas";

export type AnalysisErrorCode = "authentication" | "configuration" | "invalid_output" | "network" | "provider" | "rate_limit" | "refusal" | "safety" | "timeout";

export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: AnalysisErrorCode,
    public readonly lens?: AnalysisOperation
  ) { super(message); }
}

export function stageLabel(lens: AnalysisOperation) {
  return lens === "order" ? "Order" : lens === "curiosity" ? "Curiosity" : lens === "synthesis" ? "Synthesis" : "Standard Response";
}
