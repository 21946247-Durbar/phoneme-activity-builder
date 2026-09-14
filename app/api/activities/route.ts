import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, handleApiError } from "@/lib/apiHelpers";
import { activityCreateSchema } from "@/lib/validators";

// GET /api/activities — list all activities
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        list: { select: { id: true, name: true } },
        _count: { select: { words: true } },
      },
    });
    return success(activities);
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/activities — create an activity with linked words
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = activityCreateSchema.parse(body);

    const list = await prisma.wordList.findUnique({ where: { id: validated.listId } });
    if (!list) return error("Word list not found", 404);

    const activity = await prisma.activity.create({
      data: {
        name: validated.name,
        type: validated.type,
        difficulty: validated.difficulty,
        rows: validated.rows,
        cols: validated.cols,
        maxAttempts: validated.maxAttempts,
        listId: validated.listId,
        words: validated.wordIds?.length
          ? {
              create: validated.wordIds.map((wordId) => ({ wordId })),
            }
          : undefined,
      },
      include: {
        list: { select: { id: true, name: true } },
        words: { include: { word: { include: { phonemes: { orderBy: { position: "asc" } } } } } },
      },
    });
    return success(activity, 201);
  } catch (err) {
    return handleApiError(err);
  }
}