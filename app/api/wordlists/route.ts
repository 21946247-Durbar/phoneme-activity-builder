import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, handleApiError } from "@/lib/apiHelpers";
import { wordListCreateSchema } from "@/lib/validators";

// GET /api/wordlists — list all word lists with word counts
export async function GET() {
  try {
    const lists = await prisma.wordList.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { words: true, activities: true } },
      },
    });
    return success(lists);
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/wordlists — create a new word list
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = wordListCreateSchema.parse(body);

    const list = await prisma.wordList.create({
      data: validated,
    });
    return success(list, 201);
  } catch (err) {
    return handleApiError(err);
  }
}