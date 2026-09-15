'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [dragStarted, setDragStarted] = useState(false);

  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [showSolution, setShowSolution] = useState(false);

  const [keyboardAnchor, setKeyboardAnchor] = useState<{ row: number; col: number } | null>(null);
  const keyboardAnchorRef = useRef<{ row: number; col: number } | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGameState(generateWordSearch(words, rows, cols));
    setSelectedCells([]);
    setIsSelecting(false);
    setShowSolution(false);
    setKeyboardAnchor(null);
    setDragStarted(false);
    keyboardAnchorRef.current = null;
    setFocusedCell({ row: 0, col: 0 });
  }, [words, rows, cols]);

  const isCellFound = (row: number, col: number): boolean => {
    for (const word of gameState.foundWords) {
      const solution = gameState.solutions.find((s) => s.word === word);
      if (solution?.positions.some((pos) => pos.row === row && pos.col === col)) {
        return true;
      }
    }
    return false;
  };

  const handleCellMouseDown = (row: number, col: number) => {
    if (isCellFound(row, col)) return;
    setIsSelecting(true);
    setDragStarted(false);
    setSelectedCells([{ row, col }]);
    setKeyboardAnchor(null);
    keyboardAnchorRef.current = null;
  };

const handleCellMouseOver = (row: number, col: number) => {
  if (!isSelecting) return;

  const lastCell = selectedCells[selectedCells.length - 1];
  if (!lastCell) return;

  const dr = row - lastCell.row;
  const dc = col - lastCell.col;
  if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
  if (dr === 0 && dc === 0) return;

  // Only mark as dragging once the mouse actually moves to another cell
  if (!dragStarted) {
    setDragStarted(true);
  }

  if (selectedCells.length > 1) {
    const first = selectedCells[0];
    const second = selectedCells[1];
    const ddr = second.row - first.row;
    const ddc = second.col - first.col;
    if (ddr !== 0 && ddc !== 0 && Math.abs(ddr) !== Math.abs(ddc)) return;
    if (ddr !== dr || ddc !== dc) return;
  }

  if (isCellFound(row, col)) return;
  setSelectedCells([...selectedCells, { row, col }]);
};


  const finalizeSelection = (cells: { row: number; col: number }[]) => {
    if (cells.length < 2) return;
    const result = checkWordSearchSelection(gameState, cells);
    if (result.found) {
      const newFoundWords = new Set(gameState.foundWords);
      newFoundWords.add(result.word);
      setGameState({ ...gameState, foundWords: newFoundWords });
    }
    setSelectedCells([]);
    setIsSelecting(false);
  };

const handleCellMouseUp = () => {
  if (!isSelecting) return;

  // If the user never dragged (single click), just clear selection silently
  if (!dragStarted) {
    setIsSelecting(false);
    setDragStarted(false);
    setSelectedCells([]);
    return;
  }

  finalizeSelection(selectedCells);
  setIsSelecting(false);
  setDragStarted(false);
};

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      let nextRow = row;
      let nextCol = col;
      if (e.key === 'ArrowUp') nextRow = Math.max(0, row - 1);
      if (e.key === 'ArrowDown') nextRow = Math.min(rows - 1, row + 1);
      if (e.key === 'ArrowLeft') nextCol = Math.max(0, col - 1);
      if (e.key === 'ArrowRight') nextCol = Math.min(cols - 1, col + 1);

      setFocusedCell({ row: nextRow, col: nextCol });
      const nextEl = gridRef.current?.querySelector<HTMLDivElement>(
        `[data-row="${nextRow}"][data-col="${nextCol}"]`
      );
      nextEl?.focus();
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isCellFound(row, col)) return;

      const anchor = keyboardAnchorRef.current;
      if (!anchor) {
        keyboardAnchorRef.current = { row, col };
        setKeyboardAnchor({ row, col });
        setSelectedCells([{ row, col }]);
      } else {
        const path = buildPath(anchor, { row, col });
        if (path.length >= 2) {
          finalizeSelection(path);
        }
        keyboardAnchorRef.current = null;
        setKeyboardAnchor(null);
      }
      return;
    }

    if (e.key === 'Escape') {
      keyboardAnchorRef.current = null;
      setKeyboardAnchor(null);
      setSelectedCells([]);
    }
  };

  const buildPath = (
    start: { row: number; col: number },
    end: { row: number; col: number }
  ): { row: number; col: number }[] => {
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return [start];
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];

    const stepRow = Math.sign(dr);
    const stepCol = Math.sign(dc);
    const path = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
    }
    return path;
  };

  const handleToggleSolution = () => setShowSolution(!showSolution);

  const handleReset = () => {
    setGameState(generateWordSearch(words, rows, cols));
    setSelectedCells([]);
    setIsSelecting(false);
    setShowSolution(false);
    setKeyboardAnchor(null);
    keyboardAnchorRef.current = null;
    setFocusedCell({ row: 0, col: 0 });
  };

  const renderGrid = () => {
    const cellSize = Math.max(40, Math.min(60, 600 / cols));

    return (
      <div
        ref={gridRef}
        className="grid gap-1 justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          maxWidth: '100%',
        }}
        role="grid"
        aria-label="Word search grid"
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const phoneme = gameState.grid[r]?.[c] || '';
            const isFound = isCellFound(r, c);
            const isSelected = selectedCells.some((cell) => cell.row === r && cell.col === c);
            const isAnchor = keyboardAnchor?.row === r && keyboardAnchor?.col === c;
            const isFocused = focusedCell.row === r && focusedCell.col === c;

            let isSolution = false;
            if (showSolution) {
              for (const solution of gameState.solutions) {
                if (!gameState.foundWords.has(solution.word)) {
                  if (solution.positions.some((pos) => pos.row === r && pos.col === c)) {
                    isSolution = true;
                    break;
                  }
                }
              }
            }

            let backgroundColor = 'white';
            let textColor = '#1e293b';
            let borderColor = '#e2e8f0';
            let transform = 'scale(1)';
            let boxShadow = 'none';

            if (isFound) {
              backgroundColor = '#bbf7d0';
              textColor = '#166534';
              borderColor = '#86efac';
            } else if (isSelected || isAnchor) {
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

            if (isFocused) {
              boxShadow = boxShadow === 'none' ? 'inset 0 0 0 2px #2563eb' : boxShadow + ', inset 0 0 0 4px #93c5fd';
            }

            return (
              <div
                key={`${r}-${c}`}
                tabIndex={0}
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
                  backgroundColor,
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                  userSelect: 'none',
                  transform,
                  boxShadow,
                  opacity: isFound ? 0.85 : 1,
                  outline: isFocused ? '3px solid #2563eb' : 'none',
                  outlineOffset: '2px',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.focus();
                  if (!isFound) handleCellMouseDown(r, c);
                }}
                onMouseOver={() => !isFound && handleCellMouseOver(r, c)}
                onMouseUp={handleCellMouseUp}
                onFocus={() => setFocusedCell({ row: r, col: c })}
                onKeyDown={(e) => handleCellKeyDown(e, r, c)}
                data-row={r}
                data-col={c}
                role="gridcell"
                aria-selected={isSelected || isAnchor}
                aria-label={`Row ${r + 1}, column ${c + 1}: phoneme ${phoneme}${isFound ? ', already found' : ''}`}
              >
                {phoneme}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderWordList = () => (
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

  const renderStats = () => {
    const total = gameState.words.length;
    const found = gameState.foundWords.size;
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Found {found} of {total} words
        {found === total && (
          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">🎉 Completed!</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Word Search Preview</h3>
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
          <div className="flex justify-center overflow-auto">{renderGrid()}</div>
          {renderWordList()}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center space-y-1">
          <p>💡 <span className="font-medium">Mouse:</span> click and drag across cells to select a word.</p>
          <p>⌨️ <span className="font-medium">Keyboard:</span> Tab into the grid, use arrow keys to move, press Space to start a selection, move to the last cell, press Space again to confirm. Escape cancels.</p>
        </div>
      </div>

      {onGenerateHTML && (
        <div className="flex justify-center">
          <button
            onClick={onGenerateHTML}
            className="w-full max-w-md px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            aria-label="Generate standalone HTML file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate Standalone HTML
          </button>
        </div>
      )}
    </div>
  );
};

export default WordSearchPreview;