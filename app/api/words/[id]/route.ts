import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, handleApiError } from "@/lib/apiHelpers";
import { wordUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// GET /api/words/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const wordId = parseInt(id, 10);
    if (isNaN(wordId)) return error("Invalid id", 400);

    const word = await prisma.word.findUnique({
      where: { id: wordId },
      include: {
        phonemes: { orderBy: { position: "asc" } },
        list: { select: { id: true, name: true } },
      },
    });
    if (!word) return error("Word not found", 404);
    return success(word);
  } catch (err) {
    return handleApiError(err);
  }
}

// PUT /api/words/[id] — update word and (optionally) replace phonemes
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const wordId = parseInt(id, 10);
    if (isNaN(wordId)) return error("Invalid id", 400);

    const body = await req.json();
    const validated = wordUpdateSchema.parse(body);

    const existing = await prisma.word.findUnique({ where: { id: wordId } });
    if (!existing) return error("Word not found", 404);

    const updated = await prisma.$transaction(async (tx) => {
      // If phonemes provided, replace them (delete + recreate)
      if (validated.phonemes) {
        await tx.wordPhoneme.deleteMany({ where: { wordId } });
        await tx.wordPhoneme.createMany({
          data: validated.phonemes.map((symbol, position) => ({
            wordId,
            symbol,
            position,
          })),
        });
      }

      return tx.word.update({
        where: { id: wordId },
        data: {
          english: validated.english,
          transcription: validated.transcription,
          listId: validated.listId,
        },
        include: { phonemes: { orderBy: { position: "asc" } } },
      });
    });

    return success(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/words/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const wordId = parseInt(id, 10);
    if (isNaN(wordId)) return error("Invalid id", 400);

    const existing = await prisma.word.findUnique({ where: { id: wordId } });
    if (!existing) return error("Word not found", 404);

    await prisma.word.delete({ where: { id: wordId } });
    return success({ deleted: true, id: wordId });
  } catch (err) {
    return handleApiError(err);
  }
}