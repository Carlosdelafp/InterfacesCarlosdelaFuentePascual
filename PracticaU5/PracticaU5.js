const contenedorJuego = document.getElementById('contenedor-juego');
const instrucciones = document.getElementById('instrucciones');
const controles = document.getElementById('controles');
const menuPrincipal = document.getElementById('menu-principal');

// Creo un laberinto tamaño 10x10 
const tamanoLaberinto = 10; 
const tamanoCelda = 40; 

// Creo la estructura del laberinto, los 0 son casilla y los 1 pared
const laberinto = [
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

// Crear al jugador en el laberinto
const jugador = document.createElement('div');
jugador.classList.add('jugador');

// Función asincrónica para crear el laberinto en el contenedor
function crearLaberintoAsync() {
    return new Promise((resolve, reject) => {
        try {
            // Limpio el contenedor y ajustar su tamaño
            contenedorJuego.innerHTML = '';
            contenedorJuego.style.display = 'block';
            contenedorJuego.style.width = tamanoLaberinto * tamanoCelda + 'px';
            contenedorJuego.style.height = tamanoLaberinto * tamanoCelda + 'px';

            // recorro el  laberinto para crear las celdas y paredes
            for (let i = 0; i < tamanoLaberinto; i++) {
                for (let j = 0; j < tamanoLaberinto; j++) {
                    const celda = document.createElement('div');
                    celda.classList.add('celda');
                    if (laberinto[i][j] === 1) {
                        celda.classList.add('pared');
                    }
                    celda.style.top = (i * tamanoCelda) + 'px';
                    celda.style.left = (j * tamanoCelda) + 'px';
                    contenedorJuego.appendChild(celda);
                }
            }

            // Coloco al jugador en la posición inicial
            contenedorJuego.appendChild(jugador);
            jugador.style.top = '0px';
            jugador.style.left = '0px';

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Funciones para mostrar y ocultar instrucciones y controles
function mostrarInstrucciones() {
    menuPrincipal.style.display = 'none';
    instrucciones.style.display = 'block';
}

function ocultarInstrucciones() {
    menuPrincipal.style.display = 'block';
    instrucciones.style.display = 'none';
}

function mostrarControles() {
    menuPrincipal.style.display = 'none';
    controles.style.display = 'block'; 
}

function ocultarControles() {
    menuPrincipal.style.display = 'block';
    controles.style.display = 'none'; 
}

// Función recursiva para mover al jugador de manera animada para que quede más suave el movimiento
let idAnimacion;

function moverJugadorAnimado(tecla, objetivoArriba, objetivoIzquierda) {
    const jugadorArriba = parseInt(jugador.style.top);
    const jugadorIzquierda = parseInt(jugador.style.left);

    const distanciaArriba = objetivoArriba - jugadorArriba;
    const distanciaIzquierda = objetivoIzquierda - jugadorIzquierda;

    const paso = 5;

    if (Math.abs(distanciaArriba) > paso || Math.abs(distanciaIzquierda) > paso) {
        jugador.style.top = (jugadorArriba + Math.sign(distanciaArriba) * paso) + 'px';
        jugador.style.left = (jugadorIzquierda + Math.sign(distanciaIzquierda) * paso) + 'px';
        idAnimacion = requestAnimationFrame(() => moverJugadorAnimado(tecla, objetivoArriba, objetivoIzquierda));
    } else {
        jugador.style.top = objetivoArriba + 'px';
        jugador.style.left = objetivoIzquierda + 'px';
        cancelAnimationFrame(idAnimacion);

        // Si el jugador llega al final del laberinto, mostrar pantalla de ganar
        if (objetivoArriba >= (tamanoLaberinto - 1) * tamanoCelda && objetivoIzquierda >= (tamanoLaberinto - 1) * tamanoCelda) {
            clearTimeout(idTemporizador);
            mostrarPantallaGanar();
            document.removeEventListener('keydown', moverJugador);
        }
    }
}

// Función para mover al jugador según la tecla presionada
function moverJugador(evento) {
    const tecla = evento.key;
    const jugadorArriba = parseInt(jugador.style.top);
    const jugadorIzquierda = parseInt(jugador.style.left);

    switch (tecla) {
        case 'ArrowUp':
            if (jugadorArriba > 0 && laberinto[Math.floor(jugadorArriba / tamanoCelda) - 1][Math.floor(jugadorIzquierda / tamanoCelda)] === 0) {
                moverJugadorAnimado(tecla, jugadorArriba - tamanoCelda, jugadorIzquierda);
            }
            break;
        case 'ArrowDown':
            if (jugadorArriba < (tamanoLaberinto - 1) * tamanoCelda && laberinto[Math.floor(jugadorArriba / tamanoCelda) + 1][Math.floor(jugadorIzquierda / tamanoCelda)] === 0) {
                moverJugadorAnimado(tecla, jugadorArriba + tamanoCelda, jugadorIzquierda);
            }
            break;
        case 'ArrowLeft':
            if (jugadorIzquierda > 0 && laberinto[Math.floor(jugadorArriba / tamanoCelda)][Math.floor(jugadorIzquierda / tamanoCelda) - 1] === 0) {
                moverJugadorAnimado(tecla, jugadorArriba, jugadorIzquierda - tamanoCelda);
            }
            break;
        case 'ArrowRight':
            if (jugadorIzquierda < (tamanoLaberinto - 1) * tamanoCelda && laberinto[Math.floor(jugadorArriba / tamanoCelda)][Math.floor(jugadorIzquierda / tamanoCelda) + 1] === 0) {
                moverJugadorAnimado(tecla, jugadorArriba, jugadorIzquierda + tamanoCelda);
            }
            break;
    }
}

// Función para iniciar el juego
function iniciarJuego() {
    menuPrincipal.style.display = 'none';
    instrucciones.style.display = 'none';

    // Creo el laberinto, agrego eventos de teclado y comienzo el temporizador
    crearLaberintoAsync().then(() => {
        document.addEventListener('keydown', moverJugador);
        iniciarTemporizador();

        // Marco la celda final del laberinto como meta
        const celdaFinal = document.querySelector('.celda:nth-child(' + tamanoLaberinto + 'n):nth-last-child(1)');
        celdaFinal.classList.add('meta');
    }).catch(error => {
        console.error('Error creando laberinto:', error);
    });
}

// Variable para el manejo del temporizador
let idTemporizador;

// Función para iniciar el temporizador
function iniciarTemporizador() {
    let segundosRestantes = 10;
    const contadorElemento = document.getElementById('contador');
    if (contadorElemento) {
        contadorElemento.remove();
    }
    const nuevoContadorElemento = document.createElement('div');
    nuevoContadorElemento.id = 'contador';
    nuevoContadorElemento.innerText = 'Tiempo restante: ' + segundosRestantes + 's';
    document.body.appendChild(nuevoContadorElemento);

    // Función recursiva para actualizar el contador cada segundo
    const actualizarContador = () => {
        segundosRestantes--;
        nuevoContadorElemento.innerText = 'Tiempo restante: ' + segundosRestantes + 's';

        // Cambiar color del contador cuando quedan pocos segundos
        if (segundosRestantes === 3) {
            nuevoContadorElemento.style.color = 'red';
        }

        // Si quedan segundos, continuar actualizando el contador
        if (segundosRestantes > 0) {
            idTemporizador = setTimeout(actualizarContador, 1000);
        } else {
            // Si se agota el tiempo, mostrar pantalla de perder
            mostrarPantallaPerder();
        }
    };

    // Iniciar el contador
    actualizarContador();
}

// Función para mostrar la pantalla de ganar
function mostrarPantallaGanar() {
    const pantallaGanar = document.createElement('div');
    pantallaGanar.id = 'pantalla-ganar';
    pantallaGanar.innerHTML = `
        <h2>¡Felicidades, has ganado!</h2>
        <p>¡Has completado el laberinto con éxito!</p>
        <button id="botonReiniciar">Jugar de nuevo</button>
    `;
    document.body.appendChild(pantallaGanar);

    // Agregar evento al botón para reiniciar el juego
    const botonReiniciar = document.getElementById('botonReiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);
}

// Función para mostrar la pantalla de perder
function mostrarPantallaPerder() {
    const pantallaPerder = document.createElement('div');
    pantallaPerder.id = 'pantalla-perder';
    pantallaPerder.innerHTML = `
        <h2>¡Has perdido!</h2>
        <p>Lo siento, no lograste llegar al final a tiempo. Inténtalo de nuevo.</p>
        <button id="botonReiniciar">Volver a jugar</button>
    `;
    document.body.appendChild(pantallaPerder);

    // Agregar evento al botón para reiniciar el juego
    const botonReiniciar = document.getElementById('botonReiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // Remover el evento de teclado para evitar movimientos del jugador
    document.removeEventListener('keydown', moverJugador);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Remover las pantallas de ganar o perder
    const pantallaPerder = document.getElementById('pantalla-perder');
    if (pantallaPerder) {
        pantallaPerder.remove();
    }
    const pantallaGanar = document.getElementById('pantalla-ganar');
    if (pantallaGanar) {
        pantallaGanar.remove();
    }
    // Iniciar nuevamente el juego
    iniciarJuego();
}

// Agregar eventos a los botones de volver a instrucciones y controles
document.getElementById('botonVolverInstrucciones').addEventListener('click', function() {
    ocultarInstrucciones();
});

document.getElementById('botonVolverControles').addEventListener('click', function() {
    ocultarControles();
});
