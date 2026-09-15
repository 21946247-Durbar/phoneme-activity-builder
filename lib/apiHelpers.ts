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
  // 1. Validation errors — safe to expose, they describe the request
  if (err instanceof ZodError) {
    return error("Validation failed", 400, err.issues);
  }

  // 2. Prisma "record not found" style errors — surface a 404
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: string }).code === "P2025"
  ) {
    return error("Resource not found", 404);
  }

  // 3. Prisma unique-constraint violations — surface a 409
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  ) {
    return error("A resource with that value already exists", 409);
  }

  // 4. Everything else — log fully on the server, return a safe generic message
  if (err instanceof Error) {
    console.error("[API ERROR]", err.message, err.stack);
  } else {
    console.error("[API ERROR]", err);
  }
  return error("Internal server error", 500);
}