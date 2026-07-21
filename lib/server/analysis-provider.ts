import { curiositySchema, orderSchema, standardResponseSchema, synthesisSchema, type AnalysisRequest, type AnalysisResult } from "@/lib/schemas";
import { demoFor } from "@/lib/demo-data";

/** A future hosted-model adapter can implement this without changing the UI or route contract. */
export interface AnalysisProvider {
  analyze(request: AnalysisRequest): Promise<AnalysisResult>;
}

export class DemoAnalysisProvider implements AnalysisProvider {
  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const data = demoFor(request.lens);
    if (request.lens === "order") return orderSchema.parse(data);
    if (request.lens === "curiosity") return curiositySchema.parse(data);
    if (request.lens === "synthesis") return synthesisSchema.parse(data);
    return standardResponseSchema.parse(data);
  }
}
