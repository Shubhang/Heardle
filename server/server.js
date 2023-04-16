// server/server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Game logic
const songsFolder = path.join(__dirname, '..', 'public', 'songs');
let songList = [];
let currentSong = null;

fs.readdir(songsFolder, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    songList = files.map(file => {
        return {
            filename: file,
            title: path.parse(file).name
        };
    });
});

function pickRandomSong() {
    const index = Math.floor(Math.random() * songList.length);
    return songList[index];
}

function newGame(socket) {
    currentSong = pickRandomSong();
    socket.emit('newSnippet', `/songs/${currentSong.filename}`);
}

io.on('connection', (socket) => {
    newGame(socket);

    socket.on('submitGuess', (guess) => {
        if (guess.toLowerCase() === currentSong.title.toLowerCase()) {
            socket.emit('gameOver', 'Congratulations, you guessed the song!');
            socket.emit('feedback', 'FUCK YEAH');

        } else {
            console.log(currentSong)
            socket.emit('feedback', 'Incorrect, try again!');
        }
    });

    socket.on('requestHint', () => {
        // Add custom hints here, e.g., artist or release year
        socket.emit('hint', 'Hint: First letter is ' + currentSong.title[0]);
    });

    socket.on('playAgain', () => {
        newGame(socket);
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
