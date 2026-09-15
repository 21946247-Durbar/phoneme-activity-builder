import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

// Word data imported from Assessment 1 (HCE_WORDS)
// Split into 3 lists by phoneme count for better organisation
const THREE_PHONEME_WORDS = [
  { word: 'bed', phonemes: ['b', 'e', 'd'], transcription: 'b e d' },
  { word: 'bid', phonemes: ['b', 'ɪ', 'd'], transcription: 'b ɪ d' },
  { word: 'bad', phonemes: ['b', 'æ', 'd'], transcription: 'b æ d' },
  { word: 'bud', phonemes: ['b', 'ɐ', 'd'], transcription: 'b ɐ d' },
  { word: 'bird', phonemes: ['b', 'ɜː', 'd'], transcription: 'b ɜː d' },
  { word: 'bark', phonemes: ['b', 'ɐː', 'k'], transcription: 'b ɐː k' },
  { word: 'book', phonemes: ['b', 'ʊ', 'k'], transcription: 'b ʊ k' },
  { word: 'boot', phonemes: ['b', 'ʉː', 't'], transcription: 'b ʉː t' },
  { word: 'boat', phonemes: ['b', 'əʉ', 't'], transcription: 'b əʉ t' },
  { word: 'bike', phonemes: ['b', 'ɑe', 'k'], transcription: 'b ɑe k' },
  { word: 'bait', phonemes: ['b', 'æɪ', 't'], transcription: 'b æɪ t' },
  { word: 'boil', phonemes: ['b', 'oɪ', 'l'], transcription: 'b oɪ l' },
  { word: 'beard', phonemes: ['b', 'ɪə', 'd'], transcription: 'b ɪə d' },
  { word: 'thin', phonemes: ['θ', 'ɪ', 'n'], transcription: 'θ ɪ n' },
  { word: 'then', phonemes: ['ð', 'e', 'n'], transcription: 'ð e n' },
  { word: 'ship', phonemes: ['ʃ', 'ɪ', 'p'], transcription: 'ʃ ɪ p' },
  { word: 'chin', phonemes: ['tʃ', 'ɪ', 'n'], transcription: 'tʃ ɪ n' },
  { word: 'jam', phonemes: ['dʒ', 'æ', 'm'], transcription: 'dʒ æ m' },
  { word: 'yes', phonemes: ['j', 'e', 's'], transcription: 'j e s' },
  { word: 'win', phonemes: ['w', 'ɪ', 'n'], transcription: 'w ɪ n' },
  { word: 'ring', phonemes: ['ɹ', 'ɪ', 'ŋ'], transcription: 'ɹ ɪ ŋ' },
  { word: 'log', phonemes: ['l', 'ɔ', 'g'], transcription: 'l ɔ g' },
  { word: 'fan', phonemes: ['f', 'æ', 'n'], transcription: 'f æ n' },
  { word: 'van', phonemes: ['v', 'æ', 'n'], transcription: 'v æ n' },
  { word: 'sun', phonemes: ['s', 'ɐ', 'n'], transcription: 's ɐ n' },
  { word: 'zip', phonemes: ['z', 'ɪ', 'p'], transcription: 'z ɪ p' },
  { word: 'gum', phonemes: ['g', 'ɐ', 'm'], transcription: 'g ɐ m' },
  { word: 'hat', phonemes: ['h', 'æ', 't'], transcription: 'h æ t' },
  { word: 'fork', phonemes: ['f', 'oː', 'k'], transcription: 'f oː k' },
  { word: 'choice', phonemes: ['tʃ', 'oɪ', 's'], transcription: 'tʃ oɪ s' },
];

const FOUR_PHONEME_WORDS = [
  { word: 'stop', phonemes: ['s', 't', 'ɔ', 'p'], transcription: 's t ɔ p' },
  { word: 'frog', phonemes: ['f', 'ɹ', 'ɔ', 'g'], transcription: 'f ɹ ɔ g' },
  { word: 'clap', phonemes: ['k', 'l', 'æ', 'p'], transcription: 'k l æ p' },
  { word: 'slip', phonemes: ['s', 'l', 'ɪ', 'p'], transcription: 's l ɪ p' },
  { word: 'drum', phonemes: ['d', 'ɹ', 'ɐ', 'm'], transcription: 'd ɹ ɐ m' },
  { word: 'grin', phonemes: ['g', 'ɹ', 'ɪ', 'n'], transcription: 'g ɹ ɪ n' },
  { word: 'train', phonemes: ['t', 'ɹ', 'æɪ', 'n'], transcription: 't ɹ æɪ n' },
  { word: 'cloud', phonemes: ['k', 'l', 'æɔ', 'd'], transcription: 'k l æɔ d' },
  { word: 'snake', phonemes: ['s', 'n', 'æɪ', 'k'], transcription: 's n æɪ k' },
  { word: 'smile', phonemes: ['s', 'm', 'ɑe', 'l'], transcription: 's m ɑe l' },
  { word: 'milk', phonemes: ['m', 'ɪ', 'l', 'k'], transcription: 'm ɪ l k' },
  { word: 'hand', phonemes: ['h', 'æ', 'n', 'd'], transcription: 'h æ n d' },
  { word: 'tent', phonemes: ['t', 'e', 'n', 't'], transcription: 't e n t' },
  { word: 'jump', phonemes: ['dʒ', 'ɐ', 'm', 'p'], transcription: 'dʒ ɐ m p' },
  { word: 'lamp', phonemes: ['l', 'æ', 'm', 'p'], transcription: 'l æ m p' },
  { word: 'bank', phonemes: ['b', 'æ', 'ŋ', 'k'], transcription: 'b æ ŋ k' },
  { word: 'frame', phonemes: ['f', 'ɹ', 'æɪ', 'm'], transcription: 'f ɹ æɪ m' },
  { word: 'cold', phonemes: ['k', 'əʉ', 'l', 'd'], transcription: 'k əʉ l d' },
  { word: 'wind', phonemes: ['w', 'ɪ', 'n', 'd'], transcription: 'w ɪ n d' },
  { word: 'soft', phonemes: ['s', 'ɔ', 'f', 't'], transcription: 's ɔ f t' },
  { word: 'gift', phonemes: ['g', 'ɪ', 'f', 't'], transcription: 'g ɪ f t' },
  { word: 'desk', phonemes: ['d', 'e', 's', 'k'], transcription: 'd e s k' },
  { word: 'left', phonemes: ['l', 'e', 'f', 't'], transcription: 'l e f t' },
  { word: 'pond', phonemes: ['p', 'ɔ', 'n', 'd'], transcription: 'p ɔ n d' },
  { word: 'golf', phonemes: ['g', 'ɔ', 'l', 'f'], transcription: 'g ɔ l f' },
  { word: 'silk', phonemes: ['s', 'ɪ', 'l', 'k'], transcription: 's ɪ l k' },
  { word: 'great', phonemes: ['g', 'ɹ', 'æɪ', 't'], transcription: 'g ɹ æɪ t' },
  { word: 'crab', phonemes: ['k', 'ɹ', 'æ', 'b'], transcription: 'k ɹ æ b' },
  { word: 'plug', phonemes: ['p', 'l', 'ɐ', 'g'], transcription: 'p l ɐ g' },
  { word: 'quiz', phonemes: ['k', 'w', 'ɪ', 'z'], transcription: 'k w ɪ z' },
];

const FIVE_PHONEME_WORDS = [
  { word: 'stamp', phonemes: ['s', 't', 'æ', 'm', 'p'], transcription: 's t æ m p' },
  { word: 'plant', phonemes: ['p', 'l', 'æ', 'n', 't'], transcription: 'p l æ n t' },
  { word: 'blank', phonemes: ['b', 'l', 'æ', 'ŋ', 'k'], transcription: 'b l æ ŋ k' },
  { word: 'grand', phonemes: ['g', 'ɹ', 'æ', 'n', 'd'], transcription: 'g ɹ æ n d' },
  { word: 'clamp', phonemes: ['k', 'l', 'æ', 'm', 'p'], transcription: 'k l æ m p' },
  { word: 'twist', phonemes: ['t', 'w', 'ɪ', 's', 't'], transcription: 't w ɪ s t' },
  { word: 'trust', phonemes: ['t', 'ɹ', 'ɐ', 's', 't'], transcription: 't ɹ ɐ s t' },
  { word: 'drink', phonemes: ['d', 'ɹ', 'ɪ', 'ŋ', 'k'], transcription: 'd ɹ ɪ ŋ k' },
  { word: 'brisk', phonemes: ['b', 'ɹ', 'ɪ', 's', 'k'], transcription: 'b ɹ ɪ s k' },
  { word: 'shrimp', phonemes: ['ʃ', 'ɹ', 'ɪ', 'm', 'p'], transcription: 'ʃ ɹ ɪ m p' },
  { word: 'scrap', phonemes: ['s', 'k', 'ɹ', 'æ', 'p'], transcription: 's k ɹ æ p' },
  { word: 'scribe', phonemes: ['s', 'k', 'ɹ', 'ɑe', 'b'], transcription: 's k ɹ ɑe b' },
  { word: 'scream', phonemes: ['s', 'k', 'ɹ', 'iː', 'm'], transcription: 's k ɹ iː m' },
  { word: 'splash', phonemes: ['s', 'p', 'l', 'æ', 'ʃ'], transcription: 's p l æ ʃ' },
  { word: 'spring', phonemes: ['s', 'p', 'ɹ', 'ɪ', 'ŋ'], transcription: 's p ɹ ɪ ŋ' },
  { word: 'strap', phonemes: ['s', 't', 'ɹ', 'æ', 'p'], transcription: 's t ɹ æ p' },
  { word: 'street', phonemes: ['s', 't', 'ɹ', 'iː', 't'], transcription: 's t ɹ iː t' },
  { word: 'scrub', phonemes: ['s', 'k', 'ɹ', 'ɐ', 'b'], transcription: 's k ɹ ɐ b' },
  { word: 'flask', phonemes: ['f', 'l', 'ɐː', 's', 'k'], transcription: 'f l ɐː s k' },
  { word: 'clasp', phonemes: ['k', 'l', 'ɐː', 's', 'p'], transcription: 'k l ɐː s p' },
  { word: 'cleft', phonemes: ['k', 'l', 'e', 'f', 't'], transcription: 'k l e f t' },
  { word: 'glint', phonemes: ['g', 'l', 'ɪ', 'n', 't'], transcription: 'g l ɪ n t' },
  { word: 'blend', phonemes: ['b', 'l', 'e', 'n', 'd'], transcription: 'b l e n d' },
  { word: 'strain', phonemes: ['s', 't', 'ɹ', 'æɪ', 'n'], transcription: 's t ɹ æɪ n' },
  { word: 'thrust', phonemes: ['θ', 'ɹ', 'ɐ', 's', 't'], transcription: 'θ ɹ ɐ s t' },
  { word: 'sprawl', phonemes: ['s', 'p', 'ɹ', 'oː', 'l'], transcription: 's p ɹ oː l' },
  { word: 'scrawl', phonemes: ['s', 'k', 'ɹ', 'oː', 'l'], transcription: 's k ɹ oː l' },
  { word: 'sprig', phonemes: ['s', 'p', 'ɹ', 'ɪ', 'g'], transcription: 's p ɹ ɪ g' },
  { word: 'sprout', phonemes: ['s', 'p', 'ɹ', 'æɔ', 't'], transcription: 's p ɹ æɔ t' },
  { word: 'smoked', phonemes: ['s', 'm', 'əʉ', 'k', 't'], transcription: 's m əʉ k t' },
];

async function seedList(
  name: string,
  description: string,
  words: { word: string; phonemes: string[]; transcription: string }[]
) {
  const list = await prisma.wordList.upsert({
    where: { name },
    update: {},
    create: { name, description },
  });

  for (const w of words) {
    const existing = await prisma.word.findFirst({
      where: { listId: list.id, english: w.word },
    });

    if (existing) continue;

    await prisma.word.create({
      data: {
        listId: list.id,
        english: w.word,
        transcription: w.transcription,
        phonemes: {
          create: w.phonemes.map((symbol, position) => ({
            symbol,
            position,
          })),
        },
      },
    });
  }

  console.log(`✅ Seeded "${name}" with ${words.length} words`);
}

async function main() {
  console.log("🌱 Seeding database...");

  await seedList(
    "3-Phoneme Words",
    "Short words with exactly three phonemes — ideal for beginner activities.",
    THREE_PHONEME_WORDS
  );

  await seedList(
    "4-Phoneme Words",
    "Medium-length words with four phonemes — good for intermediate Wordle and Word Search.",
    FOUR_PHONEME_WORDS
  );

  await seedList(
    "5-Phoneme Words",
    "Longer words with five phonemes — challenge activities for advanced practice.",
    FIVE_PHONEME_WORDS
  );

  const defaults = [
    { key: "theme", value: "light" },
    { key: "defaultDifficulty", value: "medium" },
    { key: "showHints", value: "true" },
  ];

  for (const s of defaults) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("✅ Seeded default settings");
  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });