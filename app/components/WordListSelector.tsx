"use client";

import { useState } from "react";
import type { ApiWord } from "@/lib/apiClient";

interface WordListSelectorProps {
  words: ApiWord[];
  selectedWords: ApiWord[];
  onWordSelect: (word: ApiWord) => void;
  onWordDeselect: (word: ApiWord) => void;
  maxWords?: number;
  minWords?: number;
  onClearSelection?: () => void;
  loading?: boolean;
  error?: string | null;
}

const WordListSelector = ({
  words,
  selectedWords,
  onWordSelect,
  onWordDeselect,
  maxWords = 10,
  minWords = 1,
  onClearSelection,
  loading = false,
  error = null,
}: WordListSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLength, setFilterLength] = useState<number | null>(null);

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.transcription.includes(searchTerm);
    const matchesLength = filterLength ? word.phonemes.length === filterLength : true;
    return matchesSearch && matchesLength;
  });

  const isSelected = (word: ApiWord) =>
    selectedWords.some((w) => w.id === word.id);

  const handleToggleWord = (word: ApiWord) => {
    if (isSelected(word)) {
      onWordDeselect(word);
    } else if (selectedWords.length < maxWords) {
      onWordSelect(word);
    }
  };

  const handleClearSelection = () => {
    if (onClearSelection) onClearSelection();
    else selectedWords.forEach((word) => onWordDeselect(word));
  };

  if (loading) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading words...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Search for words"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterLength || ""}
            onChange={(e) => setFilterLength(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Filter by phoneme length"
          >
            <option value="">All lengths</option>
            <option value="3">3 phonemes</option>
            <option value="4">4 phonemes</option>
            <option value="5">5 phonemes</option>
          </select>
          {selectedWords.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
              aria-label="Clear all selected words"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Selected: {selectedWords.length} / {maxWords} words
        </span>
        <span>Showing: {filteredWords.length} words</span>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800/50">
        {filteredWords.map((word) => {
          const selected = isSelected(word);
          const sortedPhonemes = [...word.phonemes].sort(
            (a, b) => a.position - b.position
          );
          return (
            <button
              key={word.id}
              onClick={() => handleToggleWord(word)}
              disabled={!selected && selectedWords.length >= maxWords}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                selected
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              } ${
                !selected && selectedWords.length >= maxWords
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-label={`${selected ? "Deselect" : "Select"} word ${word.english}`}
            >
              <span className="flex items-center gap-2">
                <span className="font-semibold">{word.english}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  /{sortedPhonemes.map((p) => p.symbol).join(" ")}/
                </span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {word.phonemes.length} phonemes
                {selected && (
                  <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                )}
              </span>
            </button>
          );
        })}
        {filteredWords.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            No words match your search
          </p>
        )}
      </div>
    </div>
  );
};

export default WordListSelector;