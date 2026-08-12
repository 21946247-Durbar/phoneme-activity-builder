import { PhonemeWord, WordSearchGameState } from '@/types';

export const generateWordSearch = (
  words: PhonemeWord[],
  rows: number,
  cols: number
): WordSearchGameState => {
  // Initialize empty grid
  const grid: string[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(''));
  
  // Store solutions with their positions
  const solutions: { word: string; positions: { row: number; col: number }[] }[] = [];
  
  // Complete list of ALL HCE phoneme symbols for filling empty cells
  const allPhonemes = [
    // Plosives & Nasals
    'p', 'b', 't', 'd', 'k', 'g', 'n', 'm', 'ŋ',
    // Fricatives & Approximants
    'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'l', 'ɹ', 'w', 'j', 'tʃ', 'dʒ',
    // Monophthongs
    'iː', 'ɪ', 'e', 'eː', 'æ', 'ɐ', 'ɐː', 'ɜː', 'ʉː', 'ɔ', 'oː', 'ʊ',
    // Diphthongs & Schwa
    'æɪ', 'ɑe', 'oɪ', 'əʉ', 'æɔ', 'ɪə', 'ə'
  ];

  // All 8 possible directions for word placement
  const directions = [
    [0, 1],   // Right
    [1, 0],   // Down
    [1, 1],   // Diagonal down-right
    [1, -1],  // Diagonal down-left
    [0, -1],  // Left
    [-1, 0],  // Up
    [-1, -1], // Diagonal up-left
    [-1, 1],  // Diagonal up-right
  ];

  // Place each word in the grid
  words.forEach((word) => {
    const wordStr = word.phonemes.join('');
    let placed = false;

    // Try up to 200 random attempts to place the word
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      // Pick a random direction
      const dir = directions[Math.floor(Math.random() * directions.length)];
      // Pick a random starting position
      const startRow = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * cols);

      let canPlace = true;
      const positions: { row: number; col: number }[] = [];

      // Check if the word fits in this position
      for (let i = 0; i < word.phonemes.length; i++) {
        const row = startRow + dir[0] * i;
        const col = startCol + dir[1] * i;

        // Check boundaries
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
          canPlace = false;
          break;
        }

        // Check if cell is empty OR contains the same phoneme
        if (grid[row][col] && grid[row][col] !== word.phonemes[i]) {
          canPlace = false;
          break;
        }
        positions.push({ row, col });
      }

      // If we can place the word, do it
      if (canPlace) {
        positions.forEach((pos, i) => {
          grid[pos.row][pos.col] = word.phonemes[i];
        });
        solutions.push({ word: wordStr, positions });
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`⚠️ Could not place word: ${wordStr} - Try increasing grid size`);
    }
  });

  // Fill remaining empty cells with random phonemes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) {
        // Pick a random phoneme from the list
        const randomIndex = Math.floor(Math.random() * allPhonemes.length);
        grid[r][c] = allPhonemes[randomIndex];
      }
    }
  }

  // Return the complete game state
  return {
    words,
    grid,
    foundWords: new Set(),
    selectedCells: [],
    solutions,
  };
};

export const checkWordSearchSelection = (
  state: WordSearchGameState,
  cells: { row: number; col: number }[]
): { found: boolean; word: string } => {
  // Get the phonemes from the selected cells
  const selectedPhonemes = cells.map((cell) => state.grid[cell.row][cell.col]);
  const selectedStr = selectedPhonemes.join('');

  // Check if selection matches any word (forward or backward)
  for (const word of state.words) {
    const wordStr = word.phonemes.join('');
    const reversedStr = word.phonemes.slice().reverse().join('');

    // Check if selection matches the word or its reverse
    if (selectedStr === wordStr || selectedStr === reversedStr) {
      // Make sure we haven't already found this word
      if (!state.foundWords.has(wordStr)) {
        return { found: true, word: wordStr };
      }
    }
  }

  // No match found
  return { found: false, word: '' };
};