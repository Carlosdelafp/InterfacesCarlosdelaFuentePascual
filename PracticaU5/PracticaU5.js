document.getElementById('btnControls').addEventListener('click', function() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
});

document.getElementById('btnStart').addEventListener('click', function() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    startGame();
});

document.getElementById('btnBack').addEventListener('click', function() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
});

function startGame() {
    // Generar el laberinto
    const gameContainer = document.getElementById('game-container');
    const mazeSize = 10; // Tamaño del laberinto (10x10)
    const cellSize = 40; // Tamaño de cada celda del laberinto

    // Genera el laberinto
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (Math.random() > 0.7) {
                cell.classList.add('wall');
            }
            cell.style.top = (i * cellSize) + 'px';
            cell.style.left = (j * cellSize) + 'px';
            gameContainer.appendChild(cell);
        }
    }
}