
const gameContainer = document.getElementById('game-container');
const instructions = document.getElementById('instructions');
const mainMenu = document.getElementById('main-menu');
const mazeSize = 10; 
const cellSize = 40; 
const maze = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
];
const player = document.createElement('div');
player.classList.add('player');

function createMaze() {
    gameContainer.innerHTML = ''; 
    gameContainer.style.display = 'block'; 
    gameContainer.style.width = mazeSize * cellSize + 'px'; 
    gameContainer.style.height = mazeSize * cellSize + 'px'; 

    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[i][j] === 1) {
                cell.classList.add('wall');
            }
            cell.style.top = (i * cellSize) + 'px';
            cell.style.left = (j * cellSize) + 'px';
            gameContainer.appendChild(cell);
        }
    }

    gameContainer.appendChild(player);
    player.style.top = '0px';
    player.style.left = '0px';
}

function showInstructions() {
    mainMenu.style.display = 'none'; 
    instructions.style.display = 'block'; 
}

function hideInstructions() {
    mainMenu.style.display = 'block'; 
    instructions.style.display = 'none'; 
}

function movePlayer(event) {
    const key = event.key;
    const playerTop = parseInt(player.style.top);
    const playerLeft = parseInt(player.style.left);

    switch (key) {
        case 'ArrowUp':
            if (playerTop > 0 && maze[Math.floor(playerTop / cellSize) - 1][Math.floor(playerLeft / cellSize)] === 0) {
                player.style.top = (playerTop - cellSize) + 'px';
            }
            break;
        case 'ArrowDown':
            if (playerTop < (mazeSize - 1) * cellSize && maze[Math.floor(playerTop / cellSize) + 1][Math.floor(playerLeft / cellSize)] === 0) {
                player.style.top = (playerTop + cellSize) + 'px';
            }
            break;
        case 'ArrowLeft':
            if (playerLeft > 0 && maze[Math.floor(playerTop / cellSize)][Math.floor(playerLeft / cellSize) - 1] === 0) {
                player.style.left = (playerLeft - cellSize) + 'px';
            }
            break;
        case 'ArrowRight':
            if (playerLeft < (mazeSize - 1) * cellSize && maze[Math.floor(playerTop / cellSize)][Math.floor(playerLeft / cellSize) + 1] === 0) {
                player.style.left = (playerLeft + cellSize) + 'px';
            }
            break;
    }

    if (playerTop >= (mazeSize - 1) * cellSize && playerLeft >= (mazeSize - 1) * cellSize) {
        clearInterval(timerInterval); 
        alert('¡Felicidades! ¡Has escapado del laberinto!');
    }
}

function startGame() {
    mainMenu.style.display = 'none'; 
    instructions.style.display = 'none'; 
    createMaze(); 
    document.addEventListener('keydown', movePlayer); 
    startCountdown(); // Iniciar cuenta regresiva al comenzar el juego
}

let countdownTimer;

function startCountdown() {
    let secondsLeft = 10;
    const countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';
    document.body.appendChild(countdownElement);

    countdownTimer = setInterval(() => {
        secondsLeft--;
        countdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';

        if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
            showGameOverScreen();
        }
    }, 1000);
}

function showGameOverScreen() {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.innerHTML = `
        <h2>¡Has perdido!</h2>
        <button id="btnRestart">Volver a jugar</button>
    `;
    document.body.appendChild(gameOverScreen);

    const btnRestart = document.getElementById('btnRestart');
    btnRestart.addEventListener('click', restartGame);
}

function restartGame() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.remove(); // Eliminar pantalla de "Has perdido"
    startGame(); // Reiniciar el juego
}

document.getElementById('btnBack').addEventListener('click', function() {
    hideInstructions();
});