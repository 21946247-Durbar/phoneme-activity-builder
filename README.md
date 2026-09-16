# 🎵 Phoneme Activity Builder

A full-stack, database-driven web application for **Speech Pathology educators** to create interactive **phoneme-based** Wordle and Word Search activities using HCE (Harrington, Cox, Evans) phoneme symbols for Australian English.

**Assessment 2** extends the **Assessment 1** frontend with a **Prisma + SQLite backend**, **RESTful CRUD APIs**, **Zod validation**, a **health check endpoint**, and **Docker containerisation**.

## 📋 Project Overview

The Phoneme Activity Builder is an ongoing project across the CSE3CWA subject. It allows Speech Pathology teachers to:

- **Manage phoneme-based word lists** through a full CRUD interface
- Create **phoneme-based Wordle games** where students guess words using HCE phoneme symbols
- Generate **phoneme-based Word Search puzzles** for classroom activities
- Export **standalone HTML files** that work offline in any browser
- Persist preferences (theme, difficulty, hints) across sessions

### Who is this for?

- **Speech Pathology teachers** — create engaging classroom activities
- **Speech Pathology students** — practise phoneme recognition interactively

### Why phonemes?

Australian English uses **HCE (Harrington, Cox, Evans)** broad phoneme symbols. This tool helps students recognise and practise these sounds, which is essential for speech pathology education. The system stores each phoneme as a **separate database row**, so **multi-character symbols** (e.g., `/tʃ/`, `/iː/`, `/æɪ/`, `/əʉ/`) are handled correctly rather than being split into individual letters.

---

## 🆕 What Assessment 2 Adds

| Feature              | Assessment 1                             | Assessment 2                                           |
| -------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Word data source     | Hard-coded array in `lib/phonemeData.ts` | SQLite database via Prisma ORM                         |
| Word list management | ❌                                       | ✅ Full CRUD UI at `/word-lists`                       |
| Backend APIs         | ❌                                       | ✅ RESTful routes under `/api/*`                       |
| Validation           | Client-side only                         | ✅ Zod schemas on every write                          |
| Health check         | ❌                                       | ✅ `GET /api/health` returns 200                       |
| Deployment           | Local `npm run dev`                      | ✅ Multi-stage Docker image                            |
| Persistence          | Cookies only                             | ✅ SQLite DB + cookies                                 |
| Phoneme storage      | Array in TypeScript                      | ✅ Dedicated `WordPhoneme` table (one row per phoneme) |

---

## 🛠️ Tech Stack

| Technology                  | Purpose                              |
| --------------------------- | ------------------------------------ |
| **Next.js 16** (App Router) | Full-stack React framework           |
| **React 19**                | UI library                           |
| **TypeScript**              | Type safety                          |
| **Prisma 6 + SQLite**       | Database ORM and storage             |
| **Zod**                     | Input validation (shared schemas)    |
| **Tailwind CSS**            | Styling                              |
| **Docker**                  | Containerisation                     |
| **js-cookie**               | Client-side cookie storage for theme |
| **Git / GitHub**            | Version control                      |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **npm 10+**
- **Docker Desktop** (for containerised mode)

### Local development

```bash
# 1. Clone the repository
git clone https://github.com/21946247-Durbar/phoneme-activity-builder.git
cd phoneme-activity-builder

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Default DATABASE_URL is: file:./dev.db

# 4. Apply migrations and create the SQLite database
npx prisma migrate dev

# 5. Seed with 90 phoneme words and default settings
npx prisma db seed

# 6. Run the dev server
npm run dev
```

Open http://localhost:3000.

### Docker (Production Mode)

```bash
# Build the image (multi-stage, includes baked-in seed data)
npm run docker:build

# Run the container
docker run -d --name phoneme-builder -p 3000:3000 phoneme-activity-builder

# Verify health
curl http://localhost:3000/api/health
```

The Docker image:

- Uses a multi-stage build (`deps` $\rightarrow$ `builder` $\rightarrow$ `runner`)
- Bakes `prisma migrate deploy` and `prisma db seed` into the build, so the **container starts with 90 pre-seeded words**
- Runs as a non-root user
- Includes a healthcheck hitting `/api/health`

---

## 🗄️ Database Schema

Six models under `prisma/schema.prisma`:

| Model            | Purpose                                               |
| :--------------- | :---------------------------------------------------- |
| **WordList**     | A named collection of words (e.g., "3-Phoneme Words") |
| **Word**         | An English word with its transcription                |
| **WordPhoneme**  | One row per phoneme — `symbol` + `position`           |
| **Activity**     | A saved Wordle or Word Search configuration           |
| **ActivityWord** | Join table linking activities $\leftrightarrow$ words |
| **Setting**      | Global app defaults (theme, difficulty, hints)        |

---

## Key design decision — multi-character phonemes

Storing phonemes as a delimited string (`"b,e,d"` or `"b e d"`) would break for multi-character symbols like `tʃ`, `iː`, `æɪ`, `œ`, `əʊ`. Splitting `tʃɪn` on letters gives `t`, `ʃ`, `ɪ`, `n` — wrong; it should be `tʃ`, `ɪ`, `n`.

**Our solution:** a `WordPhoneme` table where each phoneme is its own row with an explicit `position` field. This:

- Correctly handles 1-, 2-, and 3-character IPA symbols
- Preserves phoneme order deterministically
- Enables clean indexing and querying per phoneme

```prisma
model WordPhoneme {
  id       Int      @id @default(autoincrement())
  wordId   Int
  symbol   String // "tʃ", "iː", "æɪ" — stored as one unit
  position Int
  word     Word     @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([wordId, position])
}
```

### API Endpoints

- `GET /api/health` — Health check — returns 200 OK
- `GET /api/wordlists` — List all word lists with word counts
- `POST /api/wordlists` — Create a word list
- `GET /api/wordlists/[id]` — Fetch a word list with its words
- `PUT /api/wordlists/[id]` — Update a word list
- `DELETE /api/wordlists/[id]` — Delete a word list (cascades to words)
- `GET /api/words` — List words (optional `?listId=`)
- `POST /api/words` — Create a word with phonemes
- `GET /api/words/[id]` — Fetch a single word
- `PUT /api/words/[id]` — Update a word and replace its phonemes
- `DELETE /api/words/[id]` — Delete a word
- `GET /api/activities` — List saved activities
- `POST /api/activities` — Create an activity with linked words
- `GET /api/activities/[id]` — Fetch an activity
- `PUT /api/activities/[id]` — Update an activity
- `DELETE /api/activities/[id]` — Delete an activity

## Validation

- Every POST/PUT request is validated with **Zod** (`lib/validators.ts`).
- Invalid input returns **HTTP 400** with per-field details.
- Missing resources return **404**.
- Unique-constraint returns **409**.
- Unhandled errors return **500** with a generic message (details logged server-side only).

### Project Directory Structure

```
phoneme-activity-builder/
├── app/
│   ├── api/                            # Backend API routes
│   │   ├── health/route.ts
│   │   ├── wordlists/route.ts
│   │   ├── wordlists/[id]/route.ts
│   │   ├── words/route.ts
│   │   ├── words/[id]/route.ts
│   │   ├── activities/route.ts
│   │   └── activities/[id]/route.ts
│   ├── components/
│   │   ├── ConfirmDialog.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── PhonemeKeyboard.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── WordListSelector.tsx
│   │   ├── WordlePreview.tsx
│   │   └── WordSearchPreview.tsx
│   ├── word-lists/page.tsx             # CRUD UI
│   ├── wordle/page.tsx
│   ├── word-search/page.tsx
│   ├── settings/page.tsx
│   ├── about/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── hooks/
│   ├── useWordLists.ts
│   └── useWords.ts
├── lib/
│   ├── apiClient.ts
│   ├── apiHelpers.ts
│   ├── cookies.ts
│   ├── htmlExport.ts
│   ├── phonemeData.ts
│   ├── prisma.ts
│   ├── theme.tsx
│   ├── validators.ts
│   ├── wordleEngine.ts
│   └── wordSearchEngine.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── types/
│   └── index.ts
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── prisma.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🎮 Features

### Wordle Activity Builder

- Fetches words from the **database** (any list the teacher selects)
- Interactive preview with real-time phoneme feedback
- Colour-coded grid: 🟢 correct · 🟡 wrong position · ⚪ absent
- Phoneme keyboard grouped by articulatory class
- Hover tooltips: `/θ/` $\rightarrow$ "th as in thin"
- Difficulty controls
- **Exports standalone HTML** — no external dependencies

### Word Search Activity Builder

- Fetches words from the **database**
- Configurable grid dimensions (10–40 rows/cols)
- Random selection or manual pick (1–10 words)
- **Mouse drag** and **keyboard** word selection
- Show/hide solution toggle
- **Exports standalone HTML**

---

## Word List Manager ( `/word-lists` )

- Full CRUD: create, rename, and delete word lists
- **Teachers can add arbitrary phoneme words** — not limited to the pre-seeded corpus
- Add, edit, and delete individual words with their phonemes
- Inline editing for renames
- Accessible confirmation modal for deletions

## Settings

- **Theme: Light / Dark / System** (System follows the OS preference)
- Shared `ThemeProvider` context for consistent theme across the app
- Difficulty defaults
- Hint visibility toggle
- Animation speed

---

## ♿ Accessibility

- Semantic HTML with ARIA labels on interactive controls
- Keyboard navigation: `Tab`, `Enter`, `Space`, `Escape` supported throughout
- Word Search supports keyboard word selection as an alternative to click-and-drag
- Confirmation modal traps focus and closes on `Escape` or backdrop click
- Phoneme keys provide descriptive `aria-label` and English-equivalence hints
- Colour contrast meets WCAG 2.1 AA
- Responsive layout with a mobile hamburger menu
- Theme toggle cycles Light $\rightarrow$ Dark $\rightarrow$ System with no flash-of-wrong-theme on load

---

## 🧭 Architectural Decisions & Trade-offs

- **SQLite vs. Postgres** — SQLite keeps the container self-contained and reproducible with zero external services. Trade-off: no concurrent multi-user writes. Suitable for a classroom builder; Postgres can be swapped by changing the Prisma provider and `DATABASE_URL`.
- **Prisma vs. raw SQL** — Prisma provides type-safe queries, migrations, and a clear schema. Trade-off: an extra build step (`prisma generate`) and slightly larger image, mitigated by `serverExternalPackages` in `next.config.js`.
- **Server Components vs. client fetching** — the games require rich client interactivity, so pages are client components that call the API. Trade-off: slightly slower first paint vs. simpler state management.
- **Baked-in seed vs. runtime seeding** — the Docker image runs `prisma migrate deploy` and `prisma db seed` at build time. Trade-off: the image is slightly larger, but the container starts instantly with data and needs no volume mount.
- **Zod at the boundary** — every API route parses input through a Zod schema, giving one source of truth for validation and types. Trade-off: small runtime cost per request, worth it for correctness.
- **Three-stage Dockerfile** — separating deps, builder, and runner keeps the final image minimal and reproducible across environments.
- **Normalised phoneme storage** — one row per phoneme in `WordPhoneme` enables clean support for multi-character IPA symbols at the cost of one extra join. This is essential for correct HCE handling and is preferred over a delimited string.
- **Theme via React Context + cookie + localStorage** — ensures persistence, follows the OS preference when in "System" mode, and avoids hydration flash through an inline pre-hydration script in the root layout.

---

## 👨‍🎓 Student Information

| Field           | Details                                                       |
| :-------------- | :------------------------------------------------------------ |
| **Name**        | Sudipta Biswas Durbar                                         |
| **Student ID**  | 21946247                                                      |
| **Subject**     | CSE3CWA — Cloud-based Web Application                         |
| **Assessment**  | Assessment 2: Backend Implementation and Database Integration |
| **Institution** | La Trobe University                                           |

---

## 📜 Scripts Reference

| Script                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Start Next.js in development mode         |
| `npm run build`          | Production build                          |
| `npm start`              | Start production server                   |
| `npm run lint`           | Run ESLint                                |
| `npm run db:generate`    | Generate Prisma Client                    |
| `npm run db:migrate`     | Create and apply a new migration (dev)    |
| `npm run db:deploy`      | Apply migrations (production)             |
| `npm run db:seed`        | Seed the database                         |
| `npm run db:reset`       | Reset the DB and re-run migrations + seed |
| `npm run db:studio`      | Open Prisma Studio                        |
| `npm run docker:build`   | Build the Docker image                    |
| `npm run docker:run`     | Run the Docker container                  |
| `npm run docker:compose` | Build and run via Docker Compose          |
| `npm run docker:stop`    | Stop the Docker Compose stack             |

---

## 🔐 Environment Variables

All environment variables are documented in `.env.example`:

| Variable       | Description          | Default         |
| -------------- | -------------------- | --------------- |
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `NODE_ENV`     | Runtime environment  | `development`   |

## In Docker, `DATABASE_URL` is set to `file:/app/prisma/dev.db` by the Dockerfile.

## 📚 References

- Cox, F. (2012). _Australian English pronunciation and transcription_. Cambridge University Press.
- Harrington, J., & Cox, F. (2008). The acoustic characteristics of Australian English vowels. _Journal of Phonetics_, 36(2), 328–344. https://doi.org/10.1016/j.wocn.2007.09.002
- Moats, L. (2020). _Speech to print: Language essentials for teachers_ (3rd ed.). Paul H. Brookes Publishing.
- Prisma. (2024). _Prisma ORM documentation_. https://www.prisma.io/docs
- W3C Web Accessibility Initiative. (2023). _Web Content Accessibility Guidelines (WCAG) 2.1_. https://www.w3.org/TR/WCAG21/
- Docker. (2024). _Docker documentation_. https://docs.docker.com/
- Zod. (2024). _Zod: TypeScript-first schema validation_. https://zod.dev/

---

## 🙏 Acknowledgments

- La Trobe University for the assignment brief and guidance
- Speech Pathology educators for domain guidance
- HCE Phoneme Corpus for the Australian English phoneme dataset

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
