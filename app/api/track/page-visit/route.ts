import { NextRequest } from "next/server";
import { success, handleApiError } from "@/lib/apiHelpers";
import { recordPageVisit, recordDwellTime } from "@/lib/observability";

/**
 * POST /api/track/page-visit
 *
 * Body: { sessionId: string, path: string }
 * Response: { visitId: number }
 *
 * Also handles PATCH to update an existing visit with dwell time:
 * Body: { visitId: number, dwellMs: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, path } = body;

    if (typeof sessionId !== "string" || sessionId.length === 0) {
      return success({ visitId: null, message: "Invalid sessionId" });
    }
    if (typeof path !== "string" || path.length === 0) {
      return success({ visitId: null, message: "Invalid path" });
    }

    const visit = await recordPageVisit({ sessionId, path });
    return success({ visitId: visit.id }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitId, dwellMs } = body;

    if (typeof visitId !== "number" || typeof dwellMs !== "number") {
      return success({ ok: false, message: "Invalid payload" });
    }

    await recordDwellTime({ visitId, dwellMs });
    return success({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}