'use client';

import { useState, useEffect } from 'react';
import WordlePreview from '../components/WordlePreview';
import WordListSelector from '../components/WordListSelector';
import { HCE_WORDS } from '@/lib/phonemeData';
import { PhonemeWord } from '@/types';
import { generateWordleHTML } from '@/lib/htmlExport';

export default function WordlePage() {
  const [selectedWords, setSelectedWords] = useState<PhonemeWord[]>([]);
  const [targetWord, setTargetWord] = useState<PhonemeWord | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Get max attempts based on difficulty
  const getMaxAttempts = () => {
    switch (difficulty) {
      case 'easy': return 8;
      case 'medium': return 6;
      case 'hard': return 4;
      default: return 6;
    }
  };

  // Filter words based on difficulty
  const getFilteredWords = () => {
    switch (difficulty) {
      case 'easy': return HCE_WORDS.filter(w => w.phonemes.length <= 3);
      case 'medium': return HCE_WORDS.filter(w => w.phonemes.length <= 4);
      case 'hard': return HCE_WORDS.filter(w => w.phonemes.length >= 4);
      default: return HCE_WORDS;
    }
  };

  useEffect(() => {
    // Set a default word if none selected
    if (selectedWords.length === 0) {
      const filtered = getFilteredWords();
      if (filtered.length > 0) {
        const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
        setSelectedWords([randomWord]);
      }
    }
  }, [difficulty]);

  useEffect(() => {
    if (selectedWords.length > 0) {
      setTargetWord(selectedWords[0]);
    } else {
      setTargetWord(null);
    }
  }, [selectedWords]);

  const handleWordSelect = (word: PhonemeWord) => {
    setSelectedWords([word]);
  };

  const handleWordDeselect = (word: PhonemeWord) => {
    setSelectedWords(selectedWords.filter(w => w.word !== word.word));
  };

  const handleClearSelection = () => {
    setSelectedWords([]);
    setTargetWord(null);
  };

  const handleGenerateHTML = () => {
    if (!targetWord) return;
    const html = generateWordleHTML(targetWord, difficulty);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordle-${targetWord.word}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🎯 Wordle Activity Builder
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            aria-label="Select difficulty level"
          >
            <option value="easy">Easy (8 attempts, 3-4 phonemes)</option>
            <option value="medium">Medium (6 attempts, 4-5 phonemes)</option>
            <option value="hard">Hard (4 attempts, 5+ phonemes)</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Target Word
            </h2>
            <WordListSelector
              selectedWords={selectedWords}
              onWordSelect={handleWordSelect}
              onWordDeselect={handleWordDeselect}
              maxWords={1}
              minWords={1}
              onClearSelection={handleClearSelection}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {targetWord ? (
            <WordlePreview
              targetWord={targetWord}
              onGenerateHTML={handleGenerateHTML}
              maxAttempts={getMaxAttempts()}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Please select a target word from the list to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}