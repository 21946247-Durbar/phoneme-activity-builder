import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, handleApiError } from "@/lib/apiHelpers";
import { wordCreateSchema } from "@/lib/validators";

// GET /api/words?listId=1 — list words (optionally filtered by list)
export async function GET(req: NextRequest) {
  try {
    const listIdParam = req.nextUrl.searchParams.get("listId");
    const listId = listIdParam ? parseInt(listIdParam, 10) : undefined;

    const words = await prisma.word.findMany({
      where: listId ? { listId } : undefined,
      orderBy: { createdAt: "asc" },
      include: {
        phonemes: { orderBy: { position: "asc" } },
        list: { select: { id: true, name: true } },
      },
    });
    return success(words);
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/words — create a word with phonemes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = wordCreateSchema.parse(body);

    // Ensure the list exists
    const list = await prisma.wordList.findUnique({ where: { id: validated.listId } });
    if (!list) return error("Word list not found", 404);

    const word = await prisma.word.create({
      data: {
        listId: validated.listId,
        english: validated.english,
        transcription: validated.transcription,
        phonemes: {
          create: validated.phonemes.map((symbol, position) => ({ symbol, position })),
        },
      },
      include: { phonemes: { orderBy: { position: "asc" } } },
    });
    return success(word, 201);
  } catch (err) {
    return handleApiError(err);
  }
}