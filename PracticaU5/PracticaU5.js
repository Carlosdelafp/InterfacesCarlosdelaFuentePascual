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

function createMazeAsync() {
    return new Promise((resolve, reject) => {
        try {
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

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function showInstructions() {
    mainMenu.style.display = 'none';
    instructions.style.display = 'block';
}

function hideInstructions() {
    mainMenu.style.display = 'block';
    instructions.style.display = 'none';
}

let animationId;

function movePlayerAnimated(key, targetTop, targetLeft) {
    const playerTop = parseInt(player.style.top);
    const playerLeft = parseInt(player.style.left);

    const distanceTop = targetTop - playerTop;
    const distanceLeft = targetLeft - playerLeft;

    const step = 5;

    if (Math.abs(distanceTop) > step || Math.abs(distanceLeft) > step) {
        player.style.top = (playerTop + Math.sign(distanceTop) * step) + 'px';
        player.style.left = (playerLeft + Math.sign(distanceLeft) * step) + 'px';
        animationId = requestAnimationFrame(() => movePlayerAnimated(key, targetTop, targetLeft));
    } else {
        player.style.top = targetTop + 'px';
        player.style.left = targetLeft + 'px';
        cancelAnimationFrame(animationId);

        if (targetTop >= (mazeSize - 1) * cellSize && targetLeft >= (mazeSize - 1) * cellSize) {
            clearTimeout(timerId);
            showWinScreen();
            document.removeEventListener('keydown', movePlayer);
        }
    }
}

function movePlayer(event) {
    const key = event.key;
    const playerTop = parseInt(player.style.top);
    const playerLeft = parseInt(player.style.left);

    switch (key) {
        case 'ArrowUp':
            if (playerTop > 0 && maze[Math.floor(playerTop / cellSize) - 1][Math.floor(playerLeft / cellSize)] === 0) {
                movePlayerAnimated(key, playerTop - cellSize, playerLeft);
            }
            break;
        case 'ArrowDown':
            if (playerTop < (mazeSize - 1) * cellSize && maze[Math.floor(playerTop / cellSize) + 1][Math.floor(playerLeft / cellSize)] === 0) {
                movePlayerAnimated(key, playerTop + cellSize, playerLeft);
            }
            break;
        case 'ArrowLeft':
            if (playerLeft > 0 && maze[Math.floor(playerTop / cellSize)][Math.floor(playerLeft / cellSize) - 1] === 0) {
                movePlayerAnimated(key, playerTop, playerLeft - cellSize);
            }
            break;
        case 'ArrowRight':
            if (playerLeft < (mazeSize - 1) * cellSize && maze[Math.floor(playerTop / cellSize)][Math.floor(playerLeft / cellSize) + 1] === 0) {
                movePlayerAnimated(key, playerTop, playerLeft + cellSize);
            }
            break;
    }
}

function startGame() {
    mainMenu.style.display = 'none';
    instructions.style.display = 'none';

    createMazeAsync().then(() => {
        document.addEventListener('keydown', movePlayer);
        startCountdown();

        const finalCell = document.querySelector('.cell:nth-child(' + mazeSize + 'n):nth-last-child(1)');
        finalCell.classList.add('goal');
    }).catch(error => {
        console.error('Error creating maze:', error);
    });
}

let timerId;

function startCountdown() {
    let secondsLeft = 10;
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.remove();
    }
    const newCountdownElement = document.createElement('div');
    newCountdownElement.id = 'countdown';
    newCountdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';
    document.body.appendChild(newCountdownElement);

    const updateCountdown = () => {
        secondsLeft--;
        newCountdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';

        if (secondsLeft === 3) {
            newCountdownElement.style.color = 'red';
        }

        if (secondsLeft > 0) {
            timerId = setTimeout(updateCountdown, 1000);
        } else {
            showGameOverScreen();
        }
    };

    updateCountdown();
}

function showWinScreen() {
    const winScreen = document.createElement('div');
    winScreen.id = 'win-screen';
    winScreen.innerHTML = `
        <h2>¡Felicidades, has ganado!</h2>
        <p>¡Has completado el laberinto con éxito!</p>
        <button id="btnRestart">Jugar de nuevo</button>
    `;
    document.body.appendChild(winScreen);

    const btnRestart = document.getElementById('btnRestart');
    btnRestart.addEventListener('click', restartGame);
}

function showGameOverScreen() {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.innerHTML = `
        <h2>¡Has perdido!</h2>
        <p>Lo siento, no lograste llegar al final a tiempo. Inténtalo de nuevo.</p>
        <button id="btnRestart">Volver a jugar</button>
    `;
    document.body.appendChild(gameOverScreen);

    const btnRestart = document.getElementById('btnRestart');
    btnRestart.addEventListener('click', restartGame);

    document.removeEventListener('keydown', movePlayer);
}

function restartGame() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
        gameOverScreen.remove();
    }
    const winScreen = document.getElementById('win-screen');
    if (winScreen) {
        winScreen.remove();
    }
    startGame();
}

document.getElementById('btnBack').addEventListener('click', function() {
    hideInstructions();
});