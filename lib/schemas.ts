import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "high"]);
export const noveltySchema = z.enum(["grounded", "exploratory", "speculative"]);
export const timeframeSchema = z.enum(["now", "soon", "later"]);

export const orderSchema = z.object({
  summary: z.string().min(1),
  knowns: z.array(z.string()),
  assumptions: z.array(z.object({ statement: z.string(), risk: riskLevelSchema })),
  missingInformation: z.array(z.string()),
  contradictionsOrTensions: z.array(z.string()),
  risks: z.array(z.object({ risk: z.string(), severity: riskLevelSchema, mitigation: z.string() })),
  confidence: z.object({ score: z.number().int().min(0).max(100), explanation: z.string() }),
  verificationQuestions: z.array(z.string())
});

export const curiositySchema = z.object({
  reframe: z.string().min(1),
  possibilities: z.array(z.object({ title: z.string(), description: z.string(), novelty: noveltySchema })),
  connections: z.array(z.object({ domain: z.string(), connection: z.string() })),
  whatIfQuestions: z.array(z.string()),
  inversions: z.array(z.string()),
  mostPromisingIdea: z.object({ title: z.string(), reason: z.string() })
});

export const synthesisSchema = z.object({
  integratedInsight: z.string().min(1),
  agreements: z.array(z.string()),
  productiveTensions: z.array(z.object({ tension: z.string(), interpretation: z.string() })),
  recommendedPath: z.object({ title: z.string(), rationale: z.string() }),
  nextActions: z.array(z.object({ action: z.string(), timeframe: timeframeSchema, purpose: z.string() })),
  experiments: z.array(z.object({ name: z.string(), method: z.string(), successSignal: z.string(), failureSignal: z.string() })),
  remainingUncertainty: z.array(z.string()),
  finalReflection: z.string()
});

export const standardResponseSchema = z.object({
  answer: z.string().min(1),
  keyConsiderations: z.array(z.string()),
  recommendedNextStep: z.string().min(1),
  uncertainty: z.string().min(1)
});

export const lensSchema = z.enum(["order", "curiosity", "synthesis"]);
const inputSchema = z.string().trim().min(1, "Enter a question or idea to begin.").max(4000, "Keep the question under 4,000 characters.");

export const orderRequestSchema = z.object({ lens: z.literal("order"), input: inputSchema });
export const curiosityRequestSchema = z.object({ lens: z.literal("curiosity"), input: inputSchema });
export const synthesisRequestSchema = z.object({
  lens: z.literal("synthesis"),
  input: inputSchema,
  order: orderSchema,
  curiosity: curiositySchema
});
export const standardRequestSchema = z.object({ lens: z.literal("standard"), input: inputSchema });

export const analysisRequestSchema = z.discriminatedUnion("lens", [orderRequestSchema, curiosityRequestSchema, synthesisRequestSchema, standardRequestSchema]);

export type OrderResult = z.infer<typeof orderSchema>;
export type CuriosityResult = z.infer<typeof curiositySchema>;
export type SynthesisResult = z.infer<typeof synthesisSchema>;
export type StandardResponse = z.infer<typeof standardResponseSchema>;
export type Lens = z.infer<typeof lensSchema>;
export type AnalysisOperation = z.infer<typeof analysisRequestSchema>["lens"];
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
export type AnalysisResult = OrderResult | CuriosityResult | SynthesisResult | StandardResponse;
