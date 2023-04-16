// public/js/script.js
const socket = io();
const audioSnippet = document.getElementById('audio-snippet');
const guessForm = document.getElementById('guess-form');
const guessInput = document.getElementById('guess-input');
const feedback = document.getElementById('feedback');
const hintBtn = document.getElementById('hint-btn');
const playAgainBtn = document.getElementById('play-again-btn');

socket.on('newSnippet', (snippetPath) => {
    audioSnippet.src = snippetPath;
});

guessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('submitGuess', guessInput.value);
    guessInput.value = '';
});

socket.on('feedback', (message) => {
    feedback.innerText = message;
});

hintBtn.addEventListener('click', () => {
    socket.emit('requestHint');
});

socket.on('hint', (hintMessage) => {
    feedback.innerText = hintMessage;
});

playAgainBtn.addEventListener('click', () => {
    socket.emit('playAgain');
    feedback.innerText = '';
    playAgainBtn.style.display = 'none';
});

socket.on
