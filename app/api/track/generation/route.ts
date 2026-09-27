import { NextRequest } from "next/server";
import { success, handleApiError } from "@/lib/apiHelpers";
import { recordGeneration } from "@/lib/observability";

/**
 * POST /api/track/generation
 *
 * Body: {
 *   activityType: "WORDLE" | "WORDSEARCH",
 *   success: boolean,
 *   wordCount: number,
 *   difficulty: "easy" | "medium" | "hard",
 *   errorMessage?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activityType, success: isSuccess, wordCount, difficulty, errorMessage } = body;

    if (activityType !== "WORDLE" && activityType !== "WORDSEARCH") {
      return success({ ok: false, message: "Invalid activityType" });
    }
    if (typeof isSuccess !== "boolean") {
      return success({ ok: false, message: "Invalid success" });
    }

    await recordGeneration({
      activityType,
      success: isSuccess,
      wordCount: typeof wordCount === "number" ? wordCount : 0,
      difficulty: typeof difficulty === "string" ? difficulty : "medium",
      errorMessage: typeof errorMessage === "string" ? errorMessage : undefined,
    });

    return success({ ok: true }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}