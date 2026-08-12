'use client';

import { useState, useEffect } from 'react';
import { PhonemeWord, WordleGameState } from '@/types';
import {
  createWordleGame,
  updateWordleState,
  checkWordleWin,
  resetWordleGame,
} from '@/lib/wordleEngine';
import PhonemeKeyboard from './PhonemeKeyboard';

interface WordlePreviewProps {
  targetWord: PhonemeWord;
  onGenerateHTML?: () => void;
  maxAttempts?: number;
}

const WordlePreview = ({ targetWord, onGenerateHTML, maxAttempts = 6 }: WordlePreviewProps) => {
  const [gameState, setGameState] = useState<WordleGameState>(() =>
    createWordleGame(targetWord)
  );
  const [usedPhonemes, setUsedPhonemes] = useState<Record<string, 'correct' | 'present' | 'absent'>>(
    {}
  );
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setGameState(createWordleGame(targetWord));
    setUsedPhonemes({});
    setShowHint(false);
  }, [targetWord]);

  const handlePhonemeSelect = (phoneme: string) => {
    const newState = updateWordleState(gameState, phoneme);
    setGameState(newState);

    // Update used phonemes
    if (newState.attempts.length > 0) {
      const lastAttempt = newState.attempts[newState.attempts.length - 1];
      if (lastAttempt && lastAttempt.length === targetWord.phonemes.length) {
        const results = lastAttempt.map((p, i) => {
          if (p === targetWord.phonemes[i]) return 'correct';
          if (targetWord.phonemes.includes(p)) return 'present';
          return 'absent';
        });
        const newUsed = { ...usedPhonemes };
        lastAttempt.forEach((p, i) => {
          if (results[i] === 'correct' || results[i] === 'present') {
            newUsed[p] = results[i] as 'correct' | 'present';
          } else if (!newUsed[p]) {
            newUsed[p] = 'absent';
          }
        });
        setUsedPhonemes(newUsed);
      }
    }

    if (checkWordleWin(newState)) {
      setUsedPhonemes((prev) => {
        const newUsed = { ...prev };
        targetWord.phonemes.forEach((p) => {
          newUsed[p] = 'correct';
        });
        return newUsed;
      });
    }
  };

  const handleReset = () => {
    setGameState(resetWordleGame(targetWord));
    setUsedPhonemes({});
    setShowHint(false);
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const renderGrid = () => {
    const grid = [];
    const attemptsToShow = maxAttempts || 6;

    for (let i = 0; i < attemptsToShow; i++) {
      const row = [];
      for (let j = 0; j < targetWord.phonemes.length; j++) {
        let cellClass = 'grid-cell';
        let content = '';

        if (i < gameState.attempts.length) {
          const attempt = gameState.attempts[i];
          if (attempt && attempt[j]) {
            content = attempt[j];
            const guess = attempt;
            const target = targetWord.phonemes;
            if (guess[j] === target[j]) {
              cellClass += ' correct';
            } else if (target.includes(guess[j])) {
              const isAlreadyCorrect = guess.some((p, idx) => p === guess[j] && p === target[idx]);
              if (!isAlreadyCorrect) {
                cellClass += ' present';
              } else {
                cellClass += ' absent';
              }
            } else {
              cellClass += ' absent';
            }
          } else {
            cellClass += ' empty';
          }
        } else if (i === gameState.currentAttempt && !gameState.gameOver) {
          const currentGuess = gameState.attempts[i] || [];
          if (j < currentGuess.length) {
            content = currentGuess[j] || '';
          } else {
            cellClass += ' empty';
          }
        } else {
          cellClass += ' empty';
        }

        row.push(
          <div
            key={`${i}-${j}`}
            className={cellClass}
            role="gridcell"
            aria-label={`Row ${i + 1}, Column ${j + 1}: ${content || 'empty'}`}
          >
            {content}
          </div>
        );
      }
      grid.push(
        <div key={i} className="flex gap-2 justify-center" role="row">
          {row}
        </div>
      );
    }
    return grid;
  };

  const renderMessage = () => {
    if (gameState.won) {
      return (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg text-center font-semibold animate-fade-in">
          🎉 You won! The word was{' '}
          <span className="font-mono">{gameState.targetWord.phonemes.join(' ')}</span>
          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            ({gameState.targetWord.word})
          </span>
        </div>
      );
    }
    if (gameState.gameOver) {
      return (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg text-center font-semibold animate-fade-in">
          😔 Game over! The word was{' '}
          <span className="font-mono">{gameState.targetWord.phonemes.join(' ')}</span>
          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            ({gameState.targetWord.word})
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Game Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Wordle Grid
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleShowHint}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle hint"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                  aria-label="Reset game"
                >
                  New Game
                </button>
              </div>
            </div>

            <div className="space-y-3">{renderGrid()}</div>

            {showHint && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 Hint: The word has {targetWord.phonemes.length} phonemes.
                  <span className="ml-2 font-mono">
                    {targetWord.phonemes.map((p) => '◻').join(' ')}
                  </span>
                </p>
              </div>
            )}

            {renderMessage()}
          </div>

          {/* Right Column: Phoneme Keyboard */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Phoneme Selection
            </h3>
            <PhonemeKeyboard
              onPhonemeSelect={handlePhonemeSelect}
              usedPhonemes={usedPhonemes}
              disabled={gameState.gameOver}
            />
          </div>
        </div>
      </div>

      {onGenerateHTML && (
        <div className="flex justify-center">
          <button
            onClick={onGenerateHTML}
            className="w-full max-w-md px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            aria-label="Generate standalone HTML file"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Generate Standalone HTML
          </button>
        </div>
      )}
    </div>
  );
};

export default WordlePreview;