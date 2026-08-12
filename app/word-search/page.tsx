'use client';

import { useState, useEffect } from 'react';
import WordSearchPreview from '../components/WordSearchPreview';
import WordListSelector from '../components/WordListSelector';
import { HCE_WORDS } from '@/lib/phonemeData';
import { PhonemeWord } from '@/types';
import { generateWordSearchHTML } from '@/lib/htmlExport';

export default function WordSearchPage() {
  const [selectedWords, setSelectedWords] = useState<PhonemeWord[]>([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [wordCount, setWordCount] = useState(5);

  // Get grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case 'easy': return { rows: 8, cols: 8 };
      case 'medium': return { rows: 10, cols: 10 };
      case 'hard': return { rows: 12, cols: 12 };
      default: return { rows: 10, cols: 10 };
    }
  };

  // Get suggested word count based on difficulty
  const getSuggestedWordCount = () => {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 5;
      case 'hard': return 8;
      default: return 5;
    }
  };

  // Filter words based on difficulty
  const getFilteredWordsForDifficulty = () => {
    let filtered = [...HCE_WORDS];
    switch (difficulty) {
      case 'easy':
        // Easy: Only 3-phoneme words
        filtered = filtered.filter(w => w.phonemes.length === 3);
        break;
      case 'medium':
        // Medium: 3-4 phoneme words
        filtered = filtered.filter(w => w.phonemes.length >= 3 && w.phonemes.length <= 4);
        break;
      case 'hard':
        // Hard: 4-5 phoneme words
        filtered = filtered.filter(w => w.phonemes.length >= 4 && w.phonemes.length <= 5);
        break;
      default:
        break;
    }
    return filtered;
  };

  // Auto-select words based on difficulty
  const autoSelectWordsForDifficulty = () => {
    const filteredWords = getFilteredWordsForDifficulty();
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
    const suggestedCount = getSuggestedWordCount();
    const count = Math.min(suggestedCount, 10, shuffled.length);
    const randomWords = shuffled.slice(0, count);
    setSelectedWords(randomWords);
  };

  // Update everything when difficulty changes
  useEffect(() => {
    const { rows: newRows, cols: newCols } = getGridSize();
    setRows(newRows);
    setCols(newCols);
    setWordCount(getSuggestedWordCount());
    autoSelectWordsForDifficulty();
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    autoSelectWordsForDifficulty();
  }, []);

  const handleWordSelect = (word: PhonemeWord) => {
    if (selectedWords.length < 10) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleWordDeselect = (word: PhonemeWord) => {
    setSelectedWords(selectedWords.filter(w => w.word !== word.word));
  };

  const handleClearSelection = () => {
    setSelectedWords([]);
  };

  const handleRandomSelect = () => {
    setSelectedWords([]);
    const filteredWords = getFilteredWordsForDifficulty();
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
    const count = Math.min(wordCount, 10, shuffled.length);
    const randomWords = shuffled.slice(0, count);
    setSelectedWords(randomWords);
  };

  const handleGenerateHTML = () => {
    if (selectedWords.length === 0) return;
    const html = generateWordSearchHTML(selectedWords, rows, cols, difficulty);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
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
            <label htmlFor="rows" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rows:
            </label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Math.min(40, Math.max(10, parseInt(e.target.value) || 10)))}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              aria-label="Number of rows"
              min="10"
              max="40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="cols" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cols:
            </label>
            <input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) => setCols(Math.min(40, Math.max(10, parseInt(e.target.value) || 10)))}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              aria-label="Number of columns"
              min="10"
              max="40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="word-search-difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty:
            </label>
            <select
              id="word-search-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              aria-label="Select difficulty level"
            >
              <option value="easy">Easy (8x8, 3 words, 3 phonemes)</option>
              <option value="medium">Medium (10x10, 5 words, 3-4 phonemes)</option>
              <option value="hard">Hard (12x12, 8 words, 4-5 phonemes)</option>
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
            
            {/* Random Selection Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <label htmlFor="wordCount" className="text-sm text-gray-600 dark:text-gray-400">
                Select:
              </label>
              <input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-12 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-center"
                min="1"
                max="10"
                aria-label="Number of words to select"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">words</span>
              <button
                onClick={handleRandomSelect}
                className="px-3 py-1 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                aria-label="Select random words"
              >
                🎲 Random
              </button>
              {selectedWords.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                  aria-label="Clear all selected words"
                >
                  Clear All
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Selected: {selectedWords.length}/10 words
            </p>
            
            <WordListSelector
              selectedWords={selectedWords}
              onWordSelect={handleWordSelect}
              onWordDeselect={handleWordDeselect}
              maxWords={10}
              minWords={1}
              onClearSelection={handleClearSelection}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedWords.length >= 1 ? (
            <WordSearchPreview
              words={selectedWords}
              rows={rows}
              cols={cols}
              onGenerateHTML={handleGenerateHTML}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Please select at least 1 word to generate a word search puzzle.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                You can manually select words from the list below or use the Random button above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}