import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, handleApiError } from "@/lib/apiHelpers";
import { activityUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// GET /api/activities/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) return error("Invalid id", 400);

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        list: { select: { id: true, name: true } },
        words: {
          include: { word: { include: { phonemes: { orderBy: { position: "asc" } } } } },
        },
      },
    });
    if (!activity) return error("Activity not found", 404);
    return success(activity);
  } catch (err) {
    return handleApiError(err);
  }
}

// PUT /api/activities/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) return error("Invalid id", 400);

    const body = await req.json();
    const validated = activityUpdateSchema.parse(body);

    const existing = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!existing) return error("Activity not found", 404);

    const updated = await prisma.$transaction(async (tx) => {
      if (validated.wordIds) {
        await tx.activityWord.deleteMany({ where: { activityId } });
        await tx.activityWord.createMany({
          data: validated.wordIds.map((wordId) => ({ activityId, wordId })),
        });
      }

      return tx.activity.update({
        where: { id: activityId },
        data: {
          name: validated.name,
          difficulty: validated.difficulty,
          rows: validated.rows,
          cols: validated.cols,
          maxAttempts: validated.maxAttempts,
        },
        include: {
          list: { select: { id: true, name: true } },
          words: { include: { word: { include: { phonemes: { orderBy: { position: "asc" } } } } } },
        },
      });
    });

    return success(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/activities/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) return error("Invalid id", 400);

    const existing = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!existing) return error("Activity not found", 404);

    await prisma.activity.delete({ where: { id: activityId } });
    return success({ deleted: true, id: activityId });
  } catch (err) {
    return handleApiError(err);
  }
}