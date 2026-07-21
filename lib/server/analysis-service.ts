import type { AnalysisRequest, AnalysisResult } from "@/lib/schemas";
import { DemoAnalysisProvider, type AnalysisProvider } from "@/lib/server/analysis-provider";
import { createOpenAIProvider } from "@/lib/server/openai-provider";
import { AnalysisError } from "@/lib/server/errors";

export type AnalysisMode = "demo" | "live";
export type AnalysisRun = { data: AnalysisResult; mode: AnalysisMode };
type ProviderFactory = (apiKey: string, model: string) => AnalysisProvider;
type AnalysisEnvironment = { DEMO_MODE?: string; OPENAI_API_KEY?: string; OPENAI_MODEL?: string };

const defaultModel = "gpt-4.1-mini";

function environmentFromProcess(): AnalysisEnvironment {
  return { DEMO_MODE: process.env.DEMO_MODE, OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_MODEL: process.env.OPENAI_MODEL };
}

export function selectAnalysisProvider(environment: AnalysisEnvironment = environmentFromProcess(), createProvider: ProviderFactory = createOpenAIProvider): { provider: AnalysisProvider; mode: AnalysisMode } {
  if (environment.DEMO_MODE !== "false") return { provider: new DemoAnalysisProvider(), mode: "demo" };
  const apiKey = environment.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new AnalysisError("Live analysis is not configured. Add OPENAI_API_KEY on the server or enable demo mode.", 503, "configuration");
  return { provider: createProvider(apiKey, environment.OPENAI_MODEL?.trim() || defaultModel), mode: "live" };
}

export async function runAnalysis(request: AnalysisRequest, environment: AnalysisEnvironment = environmentFromProcess(), createProvider?: ProviderFactory): Promise<AnalysisRun> {
  const selection = selectAnalysisProvider(environment, createProvider);
  return { data: await selection.provider.analyze(request), mode: selection.mode };
}
