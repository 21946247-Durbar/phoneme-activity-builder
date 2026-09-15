import { z } from "zod";

// ----- Phoneme -----
// Multi-character symbols allowed (tʃ, iː, æɪ, θ, etc.)
export const phonemeSymbolSchema = z
  .string()
  .trim()
  .min(1, "Phoneme symbol cannot be empty")
  .max(3, "Phoneme symbol cannot exceed 3 characters");

// ----- Word -----
export const wordCreateSchema = z.object({
  listId: z.number().int().positive("listId must be a positive integer"),
  english: z
    .string()
    .trim()
    .min(1, "English word is required")
    .max(50, "English word cannot exceed 50 characters"),
  transcription: z
    .string()
    .trim()
    .min(1, "Transcription is required")
    .max(100, "Transcription cannot exceed 100 characters"),
  phonemes: z
    .array(phonemeSymbolSchema)
    .min(1, "At least one phoneme is required")
    .max(10, "Cannot exceed 10 phonemes"),
});

export const wordUpdateSchema = z.object({
  english: z.string().trim().min(1).max(50).optional(),
  transcription: z.string().trim().min(1).max(100).optional(),
  phonemes: z.array(phonemeSymbolSchema).min(1).max(10).optional(),
  listId: z.number().int().positive().optional(),
});

// ----- WordList -----
export const wordListCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(80, "Name cannot exceed 80 characters"),
  description: z.string().trim().max(300).optional(),
});

export const wordListUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(300).optional(),
});

// ----- Activity -----
export const activityTypeSchema = z.enum(["WORDLE", "WORDSEARCH"]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const activityCreateSchema = z.object({
  name: z.string().trim().min(1).max(80),
  type: activityTypeSchema,
  difficulty: difficultySchema.default("medium"),
  rows: z.number().int().min(5).max(50).optional(),
  cols: z.number().int().min(5).max(50).optional(),
  maxAttempts: z.number().int().min(1).max(20).optional(),
  listId: z.number().int().positive(),
  wordIds: z.array(z.number().int().positive()).optional(),
});

export const activityUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  difficulty: difficultySchema.optional(),
  rows: z.number().int().min(5).max(50).optional(),
  cols: z.number().int().min(5).max(50).optional(),
  maxAttempts: z.number().int().min(1).max(20).optional(),
  wordIds: z.array(z.number().int().positive()).optional(),
});