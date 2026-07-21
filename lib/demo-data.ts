import type { AnalysisOperation, CuriosityResult, OrderResult, StandardResponse, SynthesisResult } from "@/lib/schemas";

export const demoQuestion = "Should I turn my creative project into a paid product?";

export const demoOrder: OrderResult = {
  summary: "The decision is less about whether the work has value and more about testing whether a specific audience will exchange money for a defined outcome.",
  knowns: ["A creative project already exists.", "The creator is considering charging for it."],
  assumptions: [{ statement: "An audience that appreciates the project will also pay for it.", risk: "high" }, { statement: "Monetization will not reduce creative momentum.", risk: "medium" }],
  missingInformation: ["Who the narrowest paying audience is", "What outcome they would buy", "Time and cost required to deliver it"],
  contradictionsOrTensions: ["Broad creative appeal may conflict with a clear, purchasable offer.", "Early revenue goals may compete with experimentation."],
  risks: [{ risk: "Building a large offer before validating demand", severity: "high", mitigation: "Offer a small paid pilot before investing in production." }, { risk: "Pricing from personal effort rather than customer value", severity: "medium", mitigation: "Interview likely buyers about the problem and alternatives." }],
  confidence: { score: 58, explanation: "The direction is plausible, but audience demand and delivery economics have not been tested." },
  verificationQuestions: ["Which recurring problem does the project solve for a specific person?", "What would ten ideal users pay to try first?"]
};

export const demoCuriosity: CuriosityResult = {
  reframe: "Instead of converting the entire project into a product, treat it as a source of small, testable offers.",
  possibilities: [{ title: "A paid field guide", description: "Package one useful workflow or insight into a focused, lightweight resource.", novelty: "grounded" }, { title: "A live micro-lab", description: "Invite a small cohort to test a structured session and learn what they value.", novelty: "exploratory" }, { title: "An audience-designed artifact", description: "Let early supporters vote on a constrained next artifact in exchange for access.", novelty: "speculative" }],
  connections: [{ domain: "Lean experimentation", connection: "Test a small commitment before building the full solution." }, { domain: "Museum curation", connection: "A compelling collection gains value through framing, selection, and context—not just volume." }],
  whatIfQuestions: ["What if the first product is a paid conversation rather than a digital object?", "What if the project stays free but funds a related service?"],
  inversions: ["Instead of asking how to sell the project, ask what costly uncertainty it removes for someone else."],
  mostPromisingIdea: { title: "A narrow paid pilot", reason: "It creates evidence about demand, price, and delivery while keeping the commitment reversible." }
};

export const demoSynthesis: SynthesisResult = {
  integratedInsight: "The promising move is not a full conversion to a paid product; it is a deliberately narrow offer that reveals whether a defined audience values a specific outcome.",
  agreements: ["Both lenses favor small tests over a large launch.", "Both identify audience definition as the immediate information gap."],
  productiveTensions: [{ tension: "Creative breadth versus a specific offer", interpretation: "A focused pilot can protect the larger project while making one useful entry point legible." }],
  recommendedPath: { title: "Run one paid micro-pilot", rationale: "It limits investment while producing direct evidence about willingness to pay and the actual desired outcome." },
  nextActions: [{ action: "Write a one-sentence offer for one audience and outcome.", timeframe: "now", purpose: "Make the hypothesis testable." }, { action: "Speak with five likely users and invite them to a small paid pilot.", timeframe: "soon", purpose: "Test language, demand, and price." }, { action: "Decide whether to expand, change, or stop based on the pilot.", timeframe: "later", purpose: "Use observed behavior rather than enthusiasm alone." }],
  experiments: [{ name: "Five-conversation demand test", method: "Show a simple offer to five likely users and ask for a paid commitment or a specific reason to decline.", successSignal: "At least two people commit or articulate the same valued outcome.", failureSignal: "Interest remains vague or no one will make a concrete commitment." }],
  remainingUncertainty: ["The audience, price, and delivery effort are still unverified."],
  finalReflection: "A small offer is not a smaller ambition—it is a better instrument for learning what the ambition should become."
};

export const demoStandardResponse: StandardResponse = {
  answer: "Yes—consider monetizing the project, but start with a small offer rather than a full product launch.",
  keyConsiderations: ["Clarify who would pay and what outcome they are buying.", "Test demand before investing heavily in production.", "Choose a format that protects creative momentum."],
  recommendedNextStep: "Describe one narrow paid pilot and invite a few likely users to commit or explain why they would not.",
  uncertainty: "Actual willingness to pay, pricing, and delivery effort remain untested."
};

export function demoFor(operation: AnalysisOperation) {
  if (operation === "order") return demoOrder;
  if (operation === "curiosity") return demoCuriosity;
  if (operation === "synthesis") return demoSynthesis;
  return demoStandardResponse;
}
