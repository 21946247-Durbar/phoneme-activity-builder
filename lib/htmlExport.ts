import { PhonemeWord } from '@/types';

export const generateWordleHTML = (
  targetWord: PhonemeWord,
  difficulty: 'easy' | 'medium' | 'hard'
): string => {
  const wordDisplay = targetWord.phonemes.join(' ');
  const wordHtml = targetWord.phonemes
    .map((p) => `<span class="phoneme-letter">${p}</span>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phoneme Wordle - ${targetWord.word}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      margin-bottom: 8px;
      color: #2563eb;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 24px;
      font-size: 0.9rem;
    }
    .word-display {
      text-align: center;
      font-size: 1.2rem;
      margin-bottom: 20px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .phoneme-letter {
      display: inline-block;
      font-family: 'Courier New', monospace;
      font-size: 1.4rem;
      font-weight: bold;
      margin: 0 4px;
      padding: 4px 8px;
      background: #e2e8f0;
      border-radius: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(${targetWord.phonemes.length}, 1fr);
      gap: 6px;
      max-width: 400px;
      margin: 0 auto 24px;
    }
    .grid-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      transition: all 0.3s ease;
      min-height: 50px;
      font-family: 'Courier New', monospace;
    }
    .grid-cell.correct {
      background: #22c55e;
      border-color: #16a34a;
      color: white;
      transform: scale(1.05);
    }
    .grid-cell.present {
      background: #eab308;
      border-color: #ca8a04;
      color: white;
      transform: scale(1.05);
    }
    .grid-cell.absent {
      background: #94a3b8;
      border-color: #64748b;
      color: white;
    }
    .grid-cell.empty {
      background: transparent;
      border-color: #e2e8f0;
    }
    .message {
      text-align: center;
      font-size: 1.1rem;
      padding: 12px;
      margin: 16px 0;
      border-radius: 8px;
      font-weight: 600;
    }
    .message.win {
      background: #dcfce7;
      color: #166534;
    }
    .message.lose {
      background: #fee2e2;
      color: #991b1b;
    }
    .keyboard {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
      margin-top: 16px;
    }
    .key {
      padding: 8px 12px;
      min-width: 32px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .key:hover {
      background: #e2e8f0;
      transform: scale(1.05);
    }
    .key.used-correct {
      background: #22c55e;
      color: white;
      border-color: #16a34a;
    }
    .key.used-present {
      background: #eab308;
      color: white;
      border-color: #ca8a04;
    }
    .key.used-absent {
      background: #94a3b8;
      color: white;
      border-color: #64748b;
      opacity: 0.5;
    }
    .hint {
      margin-top: 20px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
      text-align: center;
      font-size: 0.9rem;
      color: #64748b;
    }
    .controls {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 16px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }
    .btn-secondary:hover {
      background: #cbd5e1;
    }
    @media (max-width: 480px) {
      .container {
        padding: 20px;
      }
      .grid-cell {
        min-height: 40px;
        font-size: 1.2rem;
      }
      .key {
        padding: 6px 8px;
        min-width: 28px;
        font-size: 0.9rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 Phoneme Wordle</h1>
    <p class="subtitle">Guess the ${targetWord.phonemes.length}-phoneme word</p>

    <div id="grid" class="grid"></div>
    <div id="message" class="message" style="display: none;"></div>
    <div id="keyboard" class="keyboard"></div>
    <div class="hint">
      💡 Hover over phoneme keys to see pronunciation hints
    </div>
    <div class="controls">
      <button class="btn btn-secondary" onclick="resetGame()">🔄 New Game</button>
      <button class="btn btn-secondary" onclick="showHint()">💡 Hint</button>
    </div>
  </div>

  <script>
    const targetWord = [${targetWord.phonemes.map(p => `'${p}'`).join(', ')}];
    const maxAttempts = 6;
    let attempts = [];
    let currentAttempt = 0;
    let currentPosition = 0;
    let gameOver = false;
    let won = false;

    const phonemes = [
      'p', 'b', 't', 'd', 'k', 'g', 'n', 'm', 'ŋ',
      'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h',
      'l', 'ɹ', 'w', 'j', 'tʃ', 'dʒ',
      'iː', 'ɪ', 'e', 'eː', 'æ', 'ɐ', 'ɐː', 'ɜː',
      'ʉː', 'ɔ', 'oː', 'ʊ',
      'æɪ', 'ɑe', 'oɪ', 'əʉ', 'æɔ', 'ɪə', 'ə'
    ];

    const phonemeHints = {
      'θ': 'TH as in thin',
      'ð': 'TH as in then',
      'ʃ': 'SH as in ship',
      'ʒ': 'ZH as in vision',
      'tʃ': 'CH as in chin',
      'dʒ': 'J as in jam',
      'ŋ': 'NG as in sing',
      'ɹ': 'R as in right',
      'j': 'Y as in yes',
      'iː': 'EE as in beet',
      'ɪ': 'I as in bit',
      'e': 'E as in bet',
      'eː': 'AY as in bait',
      'æ': 'A as in bat',
      'ɐ': 'U as in but',
      'ɐː': 'AR as in bark',
      'ɜː': 'IR as in bird',
      'ʉː': 'OO as in boot',
      'ɔ': 'O as in log',
      'oː': 'OR as in fork',
      'ʊ': 'OO as in book',
      'æɪ': 'AY as in bait',
      'ɑe': 'IE as in bike',
      'oɪ': 'OY as in boil',
      'əʉ': 'OH as in boat',
      'æɔ': 'OW as in cloud',
      'ɪə': 'EAR as in beard',
      'ə': 'A as in about'
    };

    function renderGrid() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(' + targetWord.length + ', 1fr)';

      for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < targetWord.length; j++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.row = i;
          cell.dataset.col = j;

          if (i < attempts.length) {
            cell.textContent = attempts[i][j] || '';
            const result = getResult(i, j);
            if (result) cell.classList.add(result);
          } else if (i === currentAttempt && !gameOver) {
            const guess = attempts[currentAttempt] || [];
            if (j < guess.length) {
              cell.textContent = guess[j] || '';
            } else {
              cell.classList.add('empty');
            }
          } else {
            cell.classList.add('empty');
          }
          grid.appendChild(cell);
        }
      }
    }

    function getResult(row, col) {
      const guess = attempts[row] || [];
      if (guess.length < targetWord.length) return null;

      const targetCopy = [...targetWord];
      const results = new Array(targetWord.length).fill('absent');

      for (let i = 0; i < targetWord.length; i++) {
        if (guess[i] === targetWord[i]) {
          results[i] = 'correct';
          targetCopy[i] = null;
        }
      }

      for (let i = 0; i < targetWord.length; i++) {
        if (results[i] === 'correct') continue;
        const index = targetCopy.indexOf(guess[i]);
        if (index !== -1) {
          results[i] = 'present';
          targetCopy[index] = null;
        }
      }

      return results[col];
    }

    function renderKeyboard() {
      const keyboard = document.getElementById('keyboard');
      keyboard.innerHTML = '';

      const groups = [
        ['p', 'b', 't', 'd', 'k', 'g', 'n', 'm', 'ŋ'],
        ['f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'l', 'ɹ', 'w', 'j', 'tʃ', 'dʒ'],
        ['iː', 'ɪ', 'e', 'eː', 'æ', 'ɐ', 'ɐː', 'ɜː', 'ʉː', 'ɔ', 'oː', 'ʊ'],
        ['æɪ', 'ɑe', 'oɪ', 'əʉ', 'æɔ', 'ɪə', 'ə']
      ];

      groups.forEach(group => {
        group.forEach(symbol => {
          const key = document.createElement('button');
          key.className = 'key';
          key.textContent = symbol;
          key.title = phonemeHints[symbol] || 'Phoneme symbol';
          key.dataset.phoneme = symbol;
          key.onclick = () => handleKeyClick(symbol);
          keyboard.appendChild(key);
        });
      });
    }

    function handleKeyClick(phoneme) {
      if (gameOver) return;
      if (currentPosition >= targetWord.length) return;

      if (!attempts[currentAttempt]) {
        attempts[currentAttempt] = [];
      }
      attempts[currentAttempt][currentPosition] = phoneme;
      currentPosition++;
      renderGrid();

      if (currentPosition === targetWord.length) {
        checkGuess();
      }
    }

    function checkGuess() {
      const guess = attempts[currentAttempt] || [];
      if (guess.length < targetWord.length) return;

      const isCorrect = guess.every((p, i) => p === targetWord[i]);

      if (isCorrect) {
        won = true;
        gameOver = true;
        showMessage('🎉 You won! The word was ' + targetWord.join(' ') + ' (' + '${targetWord.word}' + ')', 'win');
      } else if (currentAttempt >= maxAttempts - 1) {
        gameOver = true;
        showMessage('😔 Game over! The word was ' + targetWord.join(' ') + ' (' + '${targetWord.word}' + ')', 'lose');
      } else {
        currentAttempt++;
        currentPosition = 0;
        updateKeyboardColors();
      }
      renderGrid();
    }

    function updateKeyboardColors() {
      const usedPhonemes = {};
      for (let i = 0; i < attempts.length; i++) {
        const guess = attempts[i] || [];
        guess.forEach((p, j) => {
          if (p && j < targetWord.length) {
            if (p === targetWord[j]) {
              usedPhonemes[p] = 'used-correct';
            } else if (targetWord.includes(p) && usedPhonemes[p] !== 'used-correct') {
              usedPhonemes[p] = 'used-present';
            } else if (!usedPhonemes[p]) {
              usedPhonemes[p] = 'used-absent';
            }
          }
        });
      }

      document.querySelectorAll('.key').forEach(key => {
        const p = key.dataset.phoneme;
        if (usedPhonemes[p]) {
          key.classList.add(usedPhonemes[p]);
        }
      });
    }

    function showMessage(text, type) {
      const msg = document.getElementById('message');
      msg.textContent = text;
      msg.className = 'message ' + type;
      msg.style.display = 'block';
    }

    function resetGame() {
      attempts = [];
      currentAttempt = 0;
      currentPosition = 0;
      gameOver = false;
      won = false;
      document.getElementById('message').style.display = 'none';
      document.querySelectorAll('.key').forEach(key => {
        key.className = 'key';
      });
      renderGrid();
    }

    function showHint() {
      if (gameOver) return;
      const guess = attempts[currentAttempt] || [];
      if (guess.length < targetWord.length) {
        const hint = targetWord[guess.length];
        alert('Hint: Try using the phoneme ' + hint + ' (' + (phonemeHints[hint] || hint) + ')');
      }
    }

    renderGrid();
    renderKeyboard();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (currentPosition === targetWord.length && !gameOver) {
          checkGuess();
        }
        return;
      }

      const keyMap = {
        'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
        'n': 'n', 'm': 'm', 'f': 'f', 'v': 'v', 's': 's', 'z': 'z',
        'h': 'h', 'l': 'l', 'r': 'ɹ', 'w': 'w', 'y': 'j',
        'i': 'ɪ', 'a': 'æ', 'u': 'ɐ', 'o': 'ɔ', 'e': 'e'
      };

      if (keyMap[e.key]) {
        handleKeyClick(keyMap[e.key]);
      }
    });
  </script>
</body>
</html>`;
};

export const generateWordSearchHTML = (
  words: PhonemeWord[],
  rows: number,
  cols: number,
  difficulty: 'easy' | 'medium' | 'hard'
): string => {
  // ✅ FIX: Generate both grid data AND solutions
  const result = generateWordSearchGrid(words, rows, cols);
  const gridData = result.grid;
  const solutions = result.solutions;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phoneme Word Search</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      margin-bottom: 8px;
      color: #2563eb;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 24px;
      font-size: 0.9rem;
    }
    .grid-container {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      gap: 3px;
      background: #e2e8f0;
      padding: 3px;
      border-radius: 8px;
      max-width: 100%;
    }
    .cell {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 600;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Courier New', monospace;
    }
    .cell.found {
      background: #bbf7d0;
      color: #166534;
    }
    .cell.highlighted {
      background: #fde68a;
    }
    .cell.selected {
      background: #93c5fd;
    }
    .cell.solution {
      background: #fbcfe8;
    }
    .word-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin: 16px 0;
    }
    .word-item {
      padding: 6px 12px;
      background: #f1f5f9;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    .word-item.found {
      background: #bbf7d0;
      color: #166534;
      text-decoration: line-through;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-top: 16px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }
    .btn-secondary:hover {
      background: #cbd5e1;
    }
    .btn-success {
      background: #22c55e;
      color: white;
    }
    .btn-success:hover {
      background: #16a34a;
    }
    .message {
      text-align: center;
      padding: 12px;
      margin: 12px 0;
      border-radius: 8px;
      font-weight: 500;
    }
    .message.success {
      background: #dcfce7;
      color: #166534;
    }
    @media (max-width: 480px) {
      .container {
        padding: 16px;
      }
      .cell {
        width: 32px;
        height: 32px;
        font-size: 0.8rem;
      }
      .word-item {
        font-size: 0.8rem;
        padding: 4px 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Phoneme Word Search</h1>
    <p class="subtitle">Find all ${words.length} phoneme-based words in the grid</p>

    <div id="grid-container" class="grid-container">
      <div id="grid" class="grid" style="grid-template-columns: repeat(${cols}, 1fr);"></div>
    </div>

    <div class="word-list" id="wordList"></div>

    <div id="message" class="message" style="display: none;"></div>

    <div class="controls">
      <button class="btn btn-secondary" onclick="toggleSolution()">👁️ Show Solution</button>
      <button class="btn btn-success" onclick="resetGame()">🔄 New Game</button>
    </div>
  </div>

  <script>
    const words = [${words.map(w => `'${w.phonemes.join('')}'`).join(', ')}];
    const gridData = ${JSON.stringify(gridData)};
    const rows = ${rows};
    const cols = ${cols};
    // ✅ FIX: Now 'solutions' is properly defined from the server
    const solutions = ${JSON.stringify(solutions)};

    let foundWords = new Set();
    let isSelecting = false;
    let selectedCells = [];
    let isSolutionVisible = false;

    const phonemeHints = {
      'θ': 'TH as in thin',
      'ð': 'TH as in then',
      'ʃ': 'SH as in ship',
      'ʒ': 'ZH as in vision',
      'tʃ': 'CH as in chin',
      'dʒ': 'J as in jam',
      'ŋ': 'NG as in sing',
      'ɹ': 'R as in right',
      'j': 'Y as in yes',
      'iː': 'EE as in beet',
      'ɪ': 'I as in bit',
      'e': 'E as in bet',
      'eː': 'AY as in bait',
      'æ': 'A as in bat',
      'ɐ': 'U as in but',
      'ɐː': 'AR as in bark',
      'ɜː': 'IR as in bird',
      'ʉː': 'OO as in boot',
      'ɔ': 'O as in log',
      'oː': 'OR as in fork',
      'ʊ': 'OO as in book',
      'æɪ': 'AY as in bait',
      'ɑe': 'IE as in bike',
      'oɪ': 'OY as in boil',
      'əʉ': 'OH as in boat',
      'æɔ': 'OW as in cloud',
      'ɪə': 'EAR as in beard',
      'ə': 'A as in about'
    };

    function renderGrid() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.textContent = gridData[r][c];
          cell.title = phonemeHints[gridData[r][c]] || '';
          cell.onmousedown = () => startSelection(r, c);
          cell.onmouseover = () => continueSelection(r, c);
          cell.onmouseup = () => endSelection();
          cell.ontouchstart = (e) => {
            e.preventDefault();
            startSelection(r, c);
          };
          cell.ontouchmove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el && el.classList.contains('cell')) {
              continueSelection(parseInt(el.dataset.row), parseInt(el.dataset.col));
            }
          };
          cell.ontouchend = (e) => {
            e.preventDefault();
            endSelection();
          };
          grid.appendChild(cell);
        }
      }
    }

    function renderWordList() {
      const list = document.getElementById('wordList');
      list.innerHTML = '';
      words.forEach((word) => {
        const item = document.createElement('div');
        item.className = 'word-item';
        if (foundWords.has(word)) {
          item.classList.add('found');
        }
        item.textContent = word;
        list.appendChild(item);
      });
    }

    function getCell(row, col) {
      return document.querySelector('.cell[data-row="' + row + '"][data-col="' + col + '"]');
    }

    function startSelection(row, col) {
      isSelecting = true;
      selectedCells = [];
      clearHighlights();
      const cell = getCell(row, col);
      if (cell && !cell.classList.contains('found')) {
        cell.classList.add('selected');
        selectedCells.push({ row, col });
      }
    }

    function continueSelection(row, col) {
      if (!isSelecting) return;
      const lastCell = selectedCells[selectedCells.length - 1];
      if (!lastCell) return;

      const dr = row - lastCell.row;
      const dc = col - lastCell.col;
      if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
      if (dr === 0 && dc === 0) return;

      if (selectedCells.length > 1) {
        const first = selectedCells[0];
        const second = selectedCells[1];
        const ddr = second.row - first.row;
        const ddc = second.col - first.col;
        if (ddr !== 0 && ddc !== 0 && Math.abs(ddr) !== Math.abs(ddc)) return;
        if (ddr !== dr || ddc !== dc) return;
      }

      const cell = getCell(row, col);
      if (cell && !cell.classList.contains('found')) {
        cell.classList.add('selected');
        selectedCells.push({ row, col });
      }
    }

    function endSelection() {
      if (!isSelecting || selectedCells.length < 2) {
        isSelecting = false;
        clearHighlights();
        selectedCells = [];
        return;
      }

      const selectedStr = selectedCells.map(({ row, col }) => gridData[row][col]).join('');
      const reversedStr = selectedStr.split('').reverse().join('');

      let foundWord = null;
      for (const word of words) {
        if ((selectedStr === word || reversedStr === word) && !foundWords.has(word)) {
          foundWord = word;
          break;
        }
      }

      if (foundWord) {
        foundWords.add(foundWord);
        selectedCells.forEach(({ row, col }) => {
          const cell = getCell(row, col);
          if (cell) {
            cell.classList.remove('selected');
            cell.classList.add('found');
          }
        });
        renderWordList();
        showMessage('✅ Found: ' + foundWord, 'success');
        checkWin();
      } else {
        clearHighlights();
        selectedCells.forEach(({ row, col }) => {
          const cell = getCell(row, col);
          if (cell) cell.classList.remove('selected');
        });
        showMessage('❌ No match found. Try again!', '');
      }

      isSelecting = false;
      selectedCells = [];
    }

    function clearHighlights() {
      document.querySelectorAll('.cell.selected, .cell.highlighted').forEach(cell => {
        cell.classList.remove('selected', 'highlighted');
      });
    }

    function checkWin() {
      if (foundWords.size === words.length) {
        showMessage('🎉 Congratulations! You found all ' + words.length + ' words!', 'success');
      }
    }

    function showMessage(text, type) {
      const msg = document.getElementById('message');
      msg.textContent = text;
      msg.className = 'message';
      if (type) msg.classList.add(type);
      msg.style.display = 'block';
      setTimeout(() => {
        msg.style.display = 'none';
      }, 3000);
    }

    function toggleSolution() {
        isSolutionVisible = !isSolutionVisible;
        // Remove existing solution highlights
        document.querySelectorAll('.cell.solution').forEach(cell => {
            cell.classList.remove('solution');
        });       
        if (isSolutionVisible) {
            let solutionsFound = 0;    
            // Loop through all words and their positions
            for (let s = 0; s < solutions.length; s++) {
                const solution = solutions[s];
                const wordStr = solution.word;
                // Only show solutions for words not yet found
                if (!foundWords.has(wordStr)) {
                    // Highlight each cell of this word
                    for (let p = 0; p < solution.positions.length; p++) {
                        const pos = solution.positions[p];
                        const cell = document.querySelector('.cell[data-row="' + pos.row + '"][data-col="' + pos.col + '"]');
                        if (cell && !cell.classList.contains('found')) {
                            cell.classList.add('solution');
                            solutionsFound++;
                        }
                    }
                }
            }
            
            if (solutionsFound > 0) {
                showMessage('👁️ Showing solution cells', '');
            } else {
                showMessage('✅ All words found!', 'success');
            }
        } else {
            showMessage('Solution hidden', '');
        }
    }

    function resetGame() {
      foundWords = new Set();
      renderGrid();
      renderWordList();
      document.getElementById('message').style.display = 'none';
      isSolutionVisible = false;
    }

    renderGrid();
    renderWordList();
  </script>
</body>
</html>`;
};

// ✅ FIXED: Now returns BOTH grid AND solutions
function generateWordSearchGrid(
  words: PhonemeWord[],
  rows: number,
  cols: number
): { grid: string[][]; solutions: { word: string; positions: { row: number; col: number }[] }[] } {
  const grid: string[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(''));
  const solutions: { word: string; positions: { row: number; col: number }[] }[] = [];
  
  // ✅ FIX: Use actual phoneme symbols instead of alphabet letters
  const allPhonemes = [
    'p', 'b', 't', 'd', 'k', 'g', 'n', 'm', 'ŋ',
    'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h',
    'l', 'ɹ', 'w', 'j', 'tʃ', 'dʒ',
    'iː', 'ɪ', 'e', 'eː', 'æ', 'ɐ', 'ɐː', 'ɜː',
    'ʉː', 'ɔ', 'oː', 'ʊ',
    'æɪ', 'ɑe', 'oɪ', 'əʉ', 'æɔ', 'ɪə', 'ə'
  ];

  const directions = [
    [0, 1],   // Right
    [1, 0],   // Down
    [1, 1],   // Diagonal down-right
    [1, -1],  // Diagonal down-left
    [0, -1],  // Left
    [-1, 0],  // Up
    [-1, -1], // Diagonal up-left
    [-1, 1]   // Diagonal up-right
  ];

  words.forEach((word) => {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * cols);

      let canPlace = true;
      const positions: { row: number; col: number }[] = [];

      for (let i = 0; i < word.phonemes.length; i++) {
        const row = startRow + dir[0] * i;
        const col = startCol + dir[1] * i;
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
          canPlace = false;
          break;
        }
        if (grid[row][col] && grid[row][col] !== word.phonemes[i]) {
          canPlace = false;
          break;
        }
        positions.push({ row, col });
      }

      if (canPlace) {
        for (let i = 0; i < word.phonemes.length; i++) {
          const row = startRow + dir[0] * i;
          const col = startCol + dir[1] * i;
          grid[row][col] = word.phonemes[i];
        }
        // ✅ FIX: Store the word and its positions for solutions
        solutions.push({
          word: word.phonemes.join(''),
          positions: positions
        });
        placed = true;
      }
    }
  });

  // Fill remaining cells with random phonemes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) {
        grid[r][c] = allPhonemes[Math.floor(Math.random() * allPhonemes.length)];
      }
    }
  }

  // ✅ FIX: Return BOTH grid and solutions
  return { grid, solutions };
}