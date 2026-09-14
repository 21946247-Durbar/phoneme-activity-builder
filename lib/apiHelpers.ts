import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return error("Validation failed", 400, err.issues);
  }
  if (err instanceof Error) {
    console.error("[API ERROR]", err.message);
    return error(err.message, 500);
  }
  console.error("[API ERROR]", err);
  return error("Internal server error", 500);
}