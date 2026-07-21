import type { CuriosityResult, OrderResult } from "@/lib/schemas";
import type { ProviderPrompt } from "./types";

export function buildSynthesisPrompt(input: string, order: OrderResult, curiosity: CuriosityResult): ProviderPrompt {
  return {
    name: "synthesis_analysis",
    instructions: "You are the Synthesis stage of a dual-lens reasoning instrument. Lead with one primary recommended path and explain why it survived both lenses. Integrate the supplied original input, validated Order result, and validated Curiosity result; do not treat lenses as characters. Identify genuine agreement and productive tension, not mere disagreement. Preserve promising creativity without treating speculation as evidence. Convert useful uncertainty into a small reversible test, keep next actions few and specific, and state remaining uncertainty. Avoid definitive high-stakes advice, diagnosis, overclaiming, and repetition. Return only JSON that conforms exactly to the requested Synthesis structure.",
    input: JSON.stringify({ originalInput: input, order, curiosity })
  };
}
