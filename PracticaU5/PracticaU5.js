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

        let animationId;

        function movePlayerAnimated(key, targetTop, targetLeft) {
            const playerTop = parseInt(player.style.top);
            const playerLeft = parseInt(player.style.left);

            const distanceTop = targetTop - playerTop;
            const distanceLeft = targetLeft - playerLeft;

            const step = 5; // Ajusta la velocidad de la animación

            if (Math.abs(distanceTop) > step || Math.abs(distanceLeft) > step) {
                player.style.top = (playerTop + Math.sign(distanceTop) * step) + 'px';
                player.style.left = (playerLeft + Math.sign(distanceLeft) * step) + 'px';
                animationId = requestAnimationFrame(() => movePlayerAnimated(key, targetTop, targetLeft));
            } else {
                // Asegúrate de que el jugador esté en la posición exacta
                player.style.top = targetTop + 'px';
                player.style.left = targetLeft + 'px';
                cancelAnimationFrame(animationId);

                // Verificar si el jugador ha llegado a la casilla final
                if (targetTop >= (mazeSize - 1) * cellSize && targetLeft >= (mazeSize - 1) * cellSize) {
                    clearTimeout(timerId); // Cancelar el temporizador
                    showWinScreen(); // Mostrar mensaje de victoria
                    document.removeEventListener('keydown', movePlayer); // Detener detección de teclas
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
            createMaze(); 
            document.addEventListener('keydown', movePlayer); 
            startCountdown(); // Iniciar cuenta regresiva al comenzar el juego

            // Marcar la casilla final de color rojo
            const finalCell = document.querySelector('.cell:nth-child(' + mazeSize + 'n):nth-last-child(1)');
            finalCell.classList.add('goal');
        }

        let timerId;

        function startCountdown() {
            let secondsLeft = 10;
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.remove(); // Eliminar contador de tiempo existente
            }
            const newCountdownElement = document.createElement('div');
            newCountdownElement.id = 'countdown';
            newCountdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';
            document.body.appendChild(newCountdownElement);

            const updateCountdown = () => {
                secondsLeft--;
                newCountdownElement.innerText = 'Tiempo restante: ' + secondsLeft + 's';

                // Cuando queden 3 segundos, cambiar el color a rojo
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

            // Detener la detección de teclas cuando se muestra el mensaje de Game Over
            document.removeEventListener('keydown', movePlayer);
        }

        function restartGame() {
            const gameOverScreen = document.getElementById('game-over-screen');
            if (gameOverScreen) {
                gameOverScreen.remove(); // Eliminar pantalla de "Has perdido"
            }
            const winScreen = document.getElementById('win-screen');
            if (winScreen) {
                winScreen.remove(); // Eliminar pantalla de victoria
            }
            startGame(); // Reiniciar el juego
        }

        document.getElementById('btnBack').addEventListener('click', function() {
            hideInstructions();
        });