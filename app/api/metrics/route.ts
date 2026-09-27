import { success, handleApiError } from "@/lib/apiHelpers";
import { getMetrics, getAlerts } from "@/lib/observability";

/**
 * GET /api/metrics
 *
 * Returns aggregated dashboard metrics + alerts.
 * Used by the /dashboard page.
 */
export async function GET() {
  try {
    const [metrics, alerts] = await Promise.all([getMetrics(), getAlerts()]);
    return success({ metrics, alerts });
  } catch (err) {
    return handleApiError(err);
  }
}