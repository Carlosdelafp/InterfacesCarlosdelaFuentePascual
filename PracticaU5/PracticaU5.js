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
    // Aquí comienza el juego
    console.log('Comienza el juego...');
}