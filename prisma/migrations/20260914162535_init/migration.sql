-- CreateTable
CREATE TABLE "WordList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listId" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Word_listId_fkey" FOREIGN KEY ("listId") REFERENCES "WordList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordPhoneme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "WordPhoneme_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "rows" INTEGER,
    "cols" INTEGER,
    "maxAttempts" INTEGER,
    "listId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Activity_listId_fkey" FOREIGN KEY ("listId") REFERENCES "WordList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityWord" (
    "activityId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,

    PRIMARY KEY ("activityId", "wordId"),
    CONSTRAINT "ActivityWord_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WordList_name_key" ON "WordList"("name");

-- CreateIndex
CREATE INDEX "Word_listId_idx" ON "Word"("listId");

-- CreateIndex
CREATE INDEX "WordPhoneme_wordId_idx" ON "WordPhoneme"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "WordPhoneme_wordId_position_key" ON "WordPhoneme"("wordId", "position");

-- CreateIndex
CREATE INDEX "Activity_listId_idx" ON "Activity"("listId");

-- CreateIndex
CREATE INDEX "ActivityWord_wordId_idx" ON "ActivityWord"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
