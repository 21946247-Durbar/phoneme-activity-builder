import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, handleApiError } from "@/lib/apiHelpers";
import { wordListUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// GET /api/wordlists/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const listId = parseInt(id, 10);
    if (isNaN(listId)) return error("Invalid id", 400);

    const list = await prisma.wordList.findUnique({
      where: { id: listId },
      include: { words: { include: { phonemes: { orderBy: { position: "asc" } } } } },
    });
    if (!list) return error("Word list not found", 404);
    return success(list);
  } catch (err) {
    return handleApiError(err);
  }
}

// PUT /api/wordlists/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const listId = parseInt(id, 10);
    if (isNaN(listId)) return error("Invalid id", 400);

    const body = await req.json();
    const validated = wordListUpdateSchema.parse(body);

    const existing = await prisma.wordList.findUnique({ where: { id: listId } });
    if (!existing) return error("Word list not found", 404);

    const updated = await prisma.wordList.update({
      where: { id: listId },
      data: validated,
    });
    return success(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/wordlists/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const listId = parseInt(id, 10);
    if (isNaN(listId)) return error("Invalid id", 400);

    const existing = await prisma.wordList.findUnique({ where: { id: listId } });
    if (!existing) return error("Word list not found", 404);

    await prisma.wordList.delete({ where: { id: listId } });
    return success({ deleted: true, id: listId });
  } catch (err) {
    return handleApiError(err);
  }
}