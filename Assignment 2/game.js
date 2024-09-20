document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

let sequence = [], playerSequence = [];
let gameState = 'idle'; // 'idle', 'playing_sequence', 'waiting_for_player', 'game_over'
let speed = 1000; // Initial speed for sequence flashing
let currentScore = 0, lastGameScore = 0, highScore = 0; // Score variables

const gameStatusIndicator = document.getElementById('gameStatus');
const startButton = document.querySelector('.button button');
const lastScoreDisplay = document.getElementById('lastScore');
const highScoreDisplay = document.getElementById('highScore');
const messageArea = document.getElementById('messageArea'); // For non-intrusive messages
const colorButtons = {
    red: document.getElementById('red'),
    green: document.getElementById('green'),
    yellow: document.getElementById('yellow'),
    blue: document.getElementById('blue')
};
const startSignal = document.getElementById('startSignal'); // Get the start signal element

function showMessage(message) {
    console.log("Showing message:", message); // Debug log
    messageArea.textContent = message;
    messageArea.style.display = 'block'; // Make sure it's visible
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.style.display = 'none'; // Hide it again
    }, 3000);
}
function initializeGame() {
    attachEventListeners();
    resetGame();
}
function toggleStartSignal(isActive) {
    if (isActive) {
        startSignal.classList.add('active');
    } else {
        startSignal.classList.remove('active');
    }
}


function resetGame() {
    sequence = [];
    playerSequence = [];
    gameState = 'idle';
    currentScore = 0; // Reset current score
    gameStatusIndicator.style.backgroundColor = 'red'; // Game not started
    updateScoreDisplay(); // Update score display on UI
}

function updateScoreDisplay() {
    lastScoreDisplay.textContent = `Last Score: ${lastGameScore}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

function gameStart() {
    resetGame(); // Reset game state and variables
    showMessage("Game is starting!");
    toggleStartSignal(true); // Start the blinking signal
    addColorToSequence();
    setTimeout(nextRound, 3000); // Wait a bit before starting the first round
}

function nextRound() {
    playerSequence = []; // Reset player sequence
    gameState = 'playing_sequence';
    addColorToSequence();
    playSequence();
}

function playSequence() {
    let index = 0;
    gameState = 'playing_sequence';
    gameStatusIndicator.style.backgroundColor = "yellow"; // Indicating the sequence is being shown

    const intervalId = setInterval(() => {
        if (index < sequence.length) {
            flashColor(sequence[index]);
            index++;
        } else {
            clearInterval(intervalId);
            gameState = 'waiting_for_player';
            gameStatusIndicator.style.backgroundColor = "green"; // Indicate it's the player's turn
            showMessage("Your turn!"); // Non-blocking UI indication
        }
    }, speed);
}


function flashColor(color) {
    colorButtons[color].classList.add('active');
    setTimeout(() => colorButtons[color].classList.remove('active'), 500);
}

function addColorToSequence() {
    const colors = ['red', 'green', 'yellow', 'blue'];
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
}

function attachEventListeners() {
    startButton.addEventListener('click', gameStart);
    Object.keys(colorButtons).forEach(color => {
        colorButtons[color].addEventListener('click', () => {
            if (gameState !== 'waiting_for_player') return;
            playerSequence.push(color);
            flashColor(color); // Immediate feedback
            checkPlayerSequence();
        });
    });
}
function showMessage(message) {
    messageArea.textContent = message;
    messageArea.style.display = 'block'; // Make sure it's visible
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.style.display = 'none'; // Hide it again
    }, 3000);
}
function showMessage(message) {
    console.log("Showing message:", message); // Debug log
    messageArea.textContent = message;
    messageArea.style.display = 'block'; // Make sure it's visible
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.style.display = 'none'; // Hide it again
    }, 3000);
}


function checkPlayerSequence() {
    if (sequence.length !== playerSequence.length) {
        return; // Wait until player has finished inputting their sequence
    }
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] !== playerSequence[i]) {
            showMessage("Wrong sequence! Game Over.");
            gameState = 'game_over';
            lastGameScore = currentScore; // Update last game score
            if (currentScore > highScore) {
                highScore = currentScore; // Update high score if current score is greater
            }
            updateScoreDisplay(); // Update score display
            resetGame();
            return;
        }
    }
    currentScore++; // Increase score for correct sequence
    showMessage("Correct sequence! Next round.");
    nextRound();
}
