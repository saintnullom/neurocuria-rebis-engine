import type { Lens } from "@/lib/schemas";

export const loadingMessages: Record<Lens, readonly string[]> = {
  order: ["Testing assumptions…", "Mapping constraints…", "Separating evidence from inference…"],
  curiosity: ["Exploring possibilities…", "Searching for useful connections…", "Opening alternate paths…"],
  synthesis: ["Reconciling perspectives…", "Testing the strongest convergence…", "Turning tension into a next step…"]
};

export function loadingMessage(lens: Lens, index = 0) {
  const messages = loadingMessages[lens];
  return messages[index % messages.length];
}

export function confidenceLabel(score: number) {
  return `Reasoning-confidence estimate: ${score} out of 100. This is not a statistical guarantee.`;
}

export function noveltyLabel(novelty: "grounded" | "exploratory" | "speculative") {
  return novelty === "grounded" ? "Grounded possibility" : novelty === "exploratory" ? "Exploratory possibility" : "Speculative possibility";
}

export function compactRebisSummary(orderSummary: string, promisingIdea: string, recommendedPath: string) {
  return [
    { label: "Order clarified", value: orderSummary },
    { label: "Curiosity expanded", value: promisingIdea },
    { label: "Synthesis recommended", value: recommendedPath }
  ];
}
