import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/server/analysis-service";
import { AnalysisError } from "@/lib/server/errors";
import { analysisRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = analysisRequestSchema.parse(await request.json());
    const result = await runAnalysis(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AnalysisError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The request could not be understood or the returned result was invalid. Please retry." }, { status: 400 });
  }
}
