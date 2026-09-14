"use client";

import { useState, useEffect } from "react";
import WordSearchPreview from "../components/WordSearchPreview";
import WordListSelector from "../components/WordListSelector";
import { useWordLists } from "@/hooks/useWordLists";
import { useWords } from "@/hooks/useWords";
import { toPhonemeWord, type ApiWord } from "@/lib/apiClient";
import type { PhonemeWord } from "@/types";
import { generateWordSearchHTML } from "@/lib/htmlExport";

export default function WordSearchPage() {
  const { lists, loading: listsLoading } = useWordLists();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { words, loading: wordsLoading, error: wordsError } = useWords(
    selectedListId ?? undefined
  );

  const [selectedWords, setSelectedWords] = useState<ApiWord[]>([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [wordCount, setWordCount] = useState(5);

  // Auto-select first list
  useEffect(() => {
    if (lists.length > 0 && selectedListId === null) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  const getGridSize = () => {
    switch (difficulty) {
      case 'easy': return { rows: 8, cols: 8 };
      case 'medium': return { rows: 10, cols: 10 };
      case 'hard': return { rows: 12, cols: 12 };
      default: return { rows: 10, cols: 10 };
    }
  };

  const getSuggestedWordCount = () => {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 5;
      case 'hard': return 8;
      default: return 5;
    }
  };

  const getFilteredWordsForDifficulty = () => {
    switch (difficulty) {
      case 'easy': return words.filter((w) => w.phonemes.length === 3);
      case 'medium': return words.filter((w) => w.phonemes.length >= 3 && w.phonemes.length <= 4);
      case 'hard': return words.filter((w) => w.phonemes.length >= 4 && w.phonemes.length <= 5);
      default: return words;
    }
  };

  const autoSelectWordsForDifficulty = () => {
    const filtered = getFilteredWordsForDifficulty();
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const count = Math.min(getSuggestedWordCount(), 10, shuffled.length);
    setSelectedWords(shuffled.slice(0, count));
  };

  useEffect(() => {
    const { rows: newRows, cols: newCols } = getGridSize();
    setRows(newRows);
    setCols(newCols);
    setWordCount(getSuggestedWordCount());
    autoSelectWordsForDifficulty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, words]);

  const handleWordSelect = (word: ApiWord) => {
    if (selectedWords.length < 10) setSelectedWords([...selectedWords, word]);
  };

  const handleWordDeselect = (word: ApiWord) => {
    setSelectedWords(selectedWords.filter((w) => w.id !== word.id));
  };

  const handleClearSelection = () => setSelectedWords([]);

  const handleRandomSelect = () => {
    autoSelectWordsForDifficulty();
  };

  const handleGenerateHTML = () => {
    if (selectedWords.length === 0) return;
    const phonemeWords: PhonemeWord[] = selectedWords.map(toPhonemeWord);
    const html = generateWordSearchHTML(phonemeWords, rows, cols, difficulty);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wordsearch-${selectedWords.length}-words.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🔍 Word Search Activity Builder
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="list-select-ws" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              List:
            </label>
            <select
              id="list-select-ws"
              value={selectedListId ?? ""}
              onChange={(e) => setSelectedListId(e.target.value ? parseInt(e.target.value) : null)}
              disabled={listsLoading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list._count?.words ?? 0} words)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rows" className="text-sm font-medium text-gray-700 dark:text-gray-300">Rows:</label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Math.min(40, Math.max(10, parseInt(e.target.value) || 10)))}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="10"
              max="40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="cols" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cols:</label>
            <input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) => setCols(Math.min(40, Math.max(10, parseInt(e.target.value) || 10)))}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="10"
              max="40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="ws-difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</label>
            <select
              id="ws-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="easy">Easy (8x8, 3 words)</option>
              <option value="medium">Medium (10x10, 5 words)</option>
              <option value="hard">Hard (12x12, 8 words)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Select Words (1-10)
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <label htmlFor="wordCount" className="text-sm text-gray-600 dark:text-gray-400">
                Select:
              </label>
              <input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-12 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                min="1"
                max="10"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">words</span>
              <button
                onClick={handleRandomSelect}
                className="px-3 py-1 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
              >
                🎲 Random
              </button>
              {selectedWords.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-lg"
                >
                  Clear All
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Selected: {selectedWords.length}/10 words
            </p>

            <WordListSelector
              words={words}
              selectedWords={selectedWords}
              onWordSelect={handleWordSelect}
              onWordDeselect={handleWordDeselect}
              maxWords={10}
              minWords={1}
              onClearSelection={handleClearSelection}
              loading={wordsLoading}
              error={wordsError}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedWords.length >= 1 ? (
            <WordSearchPreview
              words={selectedWords.map(toPhonemeWord)}
              rows={rows}
              cols={cols}
              onGenerateHTML={handleGenerateHTML}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {wordsLoading
                  ? "Loading words..."
                  : "Please select at least 1 word to generate a word search puzzle."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}