'use client';

import { useState, useEffect } from 'react';
import { PhonemeWord, WordSearchGameState } from '@/types';
import { generateWordSearch, checkWordSearchSelection } from '@/lib/wordSearchEngine';

interface WordSearchPreviewProps {
  words: PhonemeWord[];
  rows: number;
  cols: number;
  onGenerateHTML?: () => void;
}

const WordSearchPreview = ({
  words,
  rows,
  cols,
  onGenerateHTML,
}: WordSearchPreviewProps) => {
  const [gameState, setGameState] = useState<WordSearchGameState>(() =>
    generateWordSearch(words, rows, cols)
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setGameState(generateWordSearch(words, rows, cols));
    setSelectedCells([]);
    setIsSelecting(false);
    setShowSolution(false);
  }, [words, rows, cols]);

  const handleCellMouseDown = (row: number, col: number) => {
    // Check if cell is already found
    const cellPhoneme = gameState.grid[row]?.[col] || '';
    let isFound = false;
    for (const word of gameState.foundWords) {
      const solution = gameState.solutions.find(s => s.word === word);
      if (solution) {
        if (solution.positions.some(pos => pos.row === row && pos.col === col)) {
          isFound = true;
          break;
        }
      }
    }
    if (isFound) return;
    
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseOver = (row: number, col: number) => {
    if (!isSelecting) return;
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    const dr = row - lastCell.row;
    const dc = col - lastCell.col;
    if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
    if (dr === 0 && dc === 0) return;

    // Ensure straight line
    if (selectedCells.length > 1) {
      const first = selectedCells[0];
      const second = selectedCells[1];
      const ddr = second.row - first.row;
      const ddc = second.col - first.col;
      if (ddr !== 0 && ddc !== 0 && Math.abs(ddr) !== Math.abs(ddc)) return;
      if (ddr !== dr || ddc !== dc) return;
    }

    // Check if the cell is already found
    let isFound = false;
    for (const word of gameState.foundWords) {
      const solution = gameState.solutions.find(s => s.word === word);
      if (solution) {
        if (solution.positions.some(pos => pos.row === row && pos.col === col)) {
          isFound = true;
          break;
        }
      }
    }
    if (isFound) return;

    setSelectedCells([...selectedCells, { row, col }]);
  };

  const handleCellMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    if (selectedCells.length >= 2) {
      const result = checkWordSearchSelection(gameState, selectedCells);
      if (result.found) {
        const newFoundWords = new Set(gameState.foundWords);
        newFoundWords.add(result.word);
        setGameState({ ...gameState, foundWords: newFoundWords });
        
        // Clear selection after finding a word
        setSelectedCells([]);
        return;
      }
    }
    setSelectedCells([]);
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const handleReset = () => {
    setGameState(generateWordSearch(words, rows, cols));
    setSelectedCells([]);
    setIsSelecting(false);
    setShowSolution(false);
  };

  const renderGrid = () => {
    const cellSize = Math.max(40, Math.min(60, 600 / cols));

    return (
      <div 
        className="grid gap-1 justify-center" 
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const phoneme = gameState.grid[r]?.[c] || '';

            // Check if this cell is part of a found word
            let isFound = false;
            for (const word of gameState.foundWords) {
              const solution = gameState.solutions.find(s => s.word === word);
              if (solution) {
                if (solution.positions.some(pos => pos.row === r && pos.col === c)) {
                  isFound = true;
                  break;
                }
              }
            }

            // Check if selected
            const isSelected = selectedCells.some(cell => cell.row === r && cell.col === c);

            // Check if solution visible
            let isSolution = false;
            if (showSolution) {
              for (const solution of gameState.solutions) {
                if (!gameState.foundWords.has(solution.word)) {
                  if (solution.positions.some(pos => pos.row === r && pos.col === c)) {
                    isSolution = true;
                    break;
                  }
                }
              }
            }

            // Determine cell style
            let backgroundColor = 'white';
            let textColor = '#1e293b';
            let borderColor = '#e2e8f0';
            let transform = 'scale(1)';
            let boxShadow = 'none';

            if (isFound) {
              backgroundColor = '#bbf7d0';
              textColor = '#166534';
              borderColor = '#86efac';
            } else if (isSelected) {
              backgroundColor = '#93c5fd';
              textColor = '#1e40af';
              borderColor = '#3b82f6';
              transform = 'scale(1.05)';
              boxShadow = 'inset 0 0 0 2px #3b82f6';
            } else if (isSolution) {
              backgroundColor = '#fbcfe8';
              textColor = '#9d174d';
              borderColor = '#f9a8d4';
            }

            return (
              <div
                key={`${r}-${c}`}
                style={{ 
                  width: cellSize, 
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: cellSize > 50 ? '1rem' : '0.8rem',
                  fontWeight: 600,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '4px',
                  cursor: isFound ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: backgroundColor,
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                  userSelect: 'none',
                  transform: transform,
                  boxShadow: boxShadow,
                  opacity: isFound ? 0.85 : 1,
                }}
                onMouseDown={() => !isFound && handleCellMouseDown(r, c)}
                onMouseOver={() => !isFound && handleCellMouseOver(r, c)}
                onMouseUp={handleCellMouseUp}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!isFound) handleCellMouseDown(r, c);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (element && !isFound) {
                    const dataRow = element.getAttribute('data-row');
                    const dataCol = element.getAttribute('data-col');
                    if (dataRow && dataCol) {
                      handleCellMouseOver(parseInt(dataRow), parseInt(dataCol));
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleCellMouseUp();
                }}
                data-row={r}
                data-col={c}
                role="gridcell"
                aria-label={`Cell ${r + 1}, ${c + 1}: ${phoneme}`}
              >
                {phoneme}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderWordList = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {gameState.words.map((word) => {
          const wordStr = word.phonemes.join('');
          const isFound = gameState.foundWords.has(wordStr);
          return (
            <div
              key={wordStr}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                isFound
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 line-through'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {wordStr}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStats = () => {
    const total = gameState.words.length;
    const found = gameState.foundWords.size;
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Found {found} of {total} words
        {found === total && (
          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
            🎉 Completed!
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Word Search Preview
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleToggleSolution}
              className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle solution"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              aria-label="Reset puzzle"
            >
              New Puzzle
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {renderStats()}
          <div className="flex justify-center overflow-auto">
            {renderGrid()}
          </div>
          {renderWordList()}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          💡 Click and drag across cells to select a word. Words can be horizontal, vertical, or diagonal.
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

export default WordSearchPreview;