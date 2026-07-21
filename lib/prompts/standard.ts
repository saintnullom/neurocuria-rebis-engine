import type { ProviderPrompt } from "./types";

export function buildStandardPrompt(input: string): ProviderPrompt {
  return {
    name: "standard_response",
    instructions: "Provide one concise, direct response to the user's original question. Include relevant uncertainty, key considerations, and a realistic next step. Do not mention Order, Curiosity, Synthesis, Rebis, comparison, or any internal reasoning structure. Do not make the answer deliberately weaker or stronger for comparison. Do not diagnose, overclaim, invent citations, or provide definitive high-stakes advice. Return only JSON that conforms exactly to the requested Standard Response structure.",
    input
  };
}
