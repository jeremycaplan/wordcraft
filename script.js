// Word list (we'll use a small list for testing, but you can expand this)
const WORDS = ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HOUSE', 'IMAGE', 'JUICE'];

class WordleGame {
    constructor() {
        this.word = '';
        this.guesses = [];
        this.currentGuess = '';
        this.gameOver = false;
        this.message = document.getElementById('message');
        this.board = document.getElementById('board');
        this.keyboard = document.getElementById('keyboard');
        this.modal = document.getElementById('game-over-modal');
        
        this.initializeGame();
        this.createBoard();
        this.createKeyboard();
        this.addEventListeners();
    }

    initializeGame() {
        // Select a random word
        this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
        console.log('Word:', this.word); // For testing
    }

    createBoard() {
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                row.appendChild(tile);
            }
            
            this.board.appendChild(row);
        }
    }

    createKeyboard() {
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
        ];

        rows.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.textContent = key;
                button.className = 'key';
                if (key === 'ENTER' || key === '⌫') button.className += ' wide';
                button.setAttribute('data-key', key);
                keyboardRow.appendChild(button);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeypress(e));
        this.keyboard.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                const key = e.target.getAttribute('data-key');
                this.handleInput(key);
            }
        });
        
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
        });
    }

    handleKeypress(e) {
        if (this.gameOver) return;
        
        if (e.key === 'Enter') {
            this.handleInput('ENTER');
        } else if (e.key === 'Backspace') {
            this.handleInput('⌫');
        } else if (/^[A-Za-z]$/.test(e.key)) {
            this.handleInput(e.key.toUpperCase());
        }
    }

    handleInput(key) {
        if (this.gameOver) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === '⌫') {
            this.currentGuess = this.currentGuess.slice(0, -1);
        } else if (this.currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
            this.currentGuess += key;
        }

        this.updateBoard();
    }

    submitGuess() {
        if (this.currentGuess.length !== 5) {
            this.showMessage('Not enough letters');
            this.shakeCurrentRow();
            return;
        }

        if (!WORDS.includes(this.currentGuess)) {
            this.showMessage('Not in word list');
            this.shakeCurrentRow();
            return;
        }

        const result = this.checkGuess();
        this.guesses.push(this.currentGuess);
        this.updateColors(result);
        
        if (this.currentGuess === this.word) {
            this.gameOver = true;
            this.showGameOver(true);
        } else if (this.guesses.length === 6) {
            this.gameOver = true;
            this.showGameOver(false);
        }
        
        this.currentGuess = '';
    }

    checkGuess() {
        const result = Array(5).fill('absent');
        const letterCount = {};
        
        // Count letters in the target word
        for (const letter of this.word) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
        
        // First pass: mark correct letters
        for (let i = 0; i < 5; i++) {
            if (this.currentGuess[i] === this.word[i]) {
                result[i] = 'correct';
                letterCount[this.currentGuess[i]]--;
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < 5; i++) {
            if (result[i] !== 'correct' && 
                letterCount[this.currentGuess[i]] > 0) {
                result[i] = 'present';
                letterCount[this.currentGuess[i]]--;
            }
        }
        
        return result;
    }

    updateBoard() {
        const row = this.board.children[this.guesses.length];
        for (let i = 0; i < 5; i++) {
            const tile = row.children[i];
            tile.textContent = this.currentGuess[i] || '';
        }
    }

    updateColors(result) {
        const row = this.board.children[this.guesses.length - 1];
        
        for (let i = 0; i < 5; i++) {
            const tile = row.children[i];
            const letter = this.currentGuess[i];
            const key = document.querySelector(`[data-key="${letter}"]`);
            
            // Add the appropriate class
            tile.classList.add(result[i]);
            
            // Update keyboard colors
            if (key) {
                if (result[i] === 'correct') {
                    key.className = 'key correct';
                } else if (result[i] === 'present' && !key.classList.contains('correct')) {
                    key.className = 'key present';
                } else if (!key.classList.contains('correct') && !key.classList.contains('present')) {
                    key.className = 'key absent';
                }
            }
        }
    }

    showMessage(text) {
        this.message.textContent = text;
        setTimeout(() => {
            this.message.textContent = '';
        }, 2000);
    }

    shakeCurrentRow() {
        const currentRow = this.board.children[this.guesses.length];
        currentRow.classList.add('shake');
        setTimeout(() => {
            currentRow.classList.remove('shake');
        }, 500);
    }

    showGameOver(won) {
        const modal = document.getElementById('game-over-modal');
        const message = document.getElementById('game-over-message');
        const answerReveal = document.getElementById('answer-reveal');
        
        message.textContent = won ? 
            `Congratulations! You won in ${this.guesses.length} ${this.guesses.length === 1 ? 'try' : 'tries'}!` : 
            'Game Over!';
        
        answerReveal.textContent = `The word was: ${this.word}`;
        modal.style.display = 'flex';
    }

    resetGame() {
        // Clear the board
        while (this.board.firstChild) {
            this.board.removeChild(this.board.firstChild);
        }
        
        // Reset keyboard colors
        document.querySelectorAll('.key').forEach(key => {
            key.className = key.classList.contains('wide') ? 'key wide' : 'key';
        });
        
        // Reset game state
        this.guesses = [];
        this.currentGuess = '';
        this.gameOver = false;
        this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
        
        // Hide modal
        this.modal.style.display = 'none';
        
        // Recreate board
        this.createBoard();
        
        console.log('New word:', this.word); // For testing
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});
