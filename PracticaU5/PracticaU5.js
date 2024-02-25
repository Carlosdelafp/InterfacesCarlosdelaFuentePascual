const contenedorJuego = document.getElementById('contenedor-juego');
const instrucciones = document.getElementById('instrucciones');
const menuPrincipal = document.getElementById('menu-principal');
const tamanoLaberinto = 10; 
const tamanoCelda = 40; 
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
const jugador = document.createElement('div');
jugador.classList.add('jugador');

function crearLaberintoAsync() {
    return new Promise((resolve, reject) => {
        try {
            contenedorJuego.innerHTML = '';
            contenedorJuego.style.display = 'block';
            contenedorJuego.style.width = tamanoLaberinto * tamanoCelda + 'px';
            contenedorJuego.style.height = tamanoLaberinto * tamanoCelda + 'px';

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

            contenedorJuego.appendChild(jugador);
            jugador.style.top = '0px';
            jugador.style.left = '0px';

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

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
    instrucciones.style.display = 'block';
}

function ocultarControles() {
    menuPrincipal.style.display = 'block';
    instrucciones.style.display = 'none';
}

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

        if (objetivoArriba >= (tamanoLaberinto - 1) * tamanoCelda && objetivoIzquierda >= (tamanoLaberinto - 1) * tamanoCelda) {
            clearTimeout(idTemporizador);
            mostrarPantallaGanar();
            document.removeEventListener('keydown', moverJugador);
        }
    }
}

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

function iniciarJuego() {
    menuPrincipal.style.display = 'none';
    instrucciones.style.display = 'none';

    crearLaberintoAsync().then(() => {
        document.addEventListener('keydown', moverJugador);
        iniciarTemporizador();

        const celdaFinal = document.querySelector('.celda:nth-child(' + tamanoLaberinto + 'n):nth-last-child(1)');
        celdaFinal.classList.add('meta');
    }).catch(error => {
        console.error('Error creando laberinto:', error);
    });
}

let idTemporizador;

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

    const actualizarContador = () => {
        segundosRestantes--;
        nuevoContadorElemento.innerText = 'Tiempo restante: ' + segundosRestantes + 's';

        if (segundosRestantes === 3) {
            nuevoContadorElemento.style.color = 'red';
        }

        if (segundosRestantes > 0) {
            idTemporizador = setTimeout(actualizarContador, 1000);
        } else {
            mostrarPantallaPerder();
        }
    };

    actualizarContador();
}

function mostrarPantallaGanar() {
    const pantallaGanar = document.createElement('div');
    pantallaGanar.id = 'pantalla-ganar';
    pantallaGanar.innerHTML = `
        <h2>¡Felicidades, has ganado!</h2>
        <p>¡Has completado el laberinto con éxito!</p>
        <button id="botonReiniciar">Jugar de nuevo</button>
    `;
    document.body.appendChild(pantallaGanar);

    const botonReiniciar = document.getElementById('botonReiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);
}

function mostrarPantallaPerder() {
    const pantallaPerder = document.createElement('div');
    pantallaPerder.id = 'pantalla-perder';
    pantallaPerder.innerHTML = `
        <h2>¡Has perdido!</h2>
        <p>Lo siento, no lograste llegar al final a tiempo. Inténtalo de nuevo.</p>
        <button id="botonReiniciar">Volver a jugar</button>
    `;
    document.body.appendChild(pantallaPerder);

    const botonReiniciar = document.getElementById('botonReiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);

    document.removeEventListener('keydown', moverJugador);
}

function reiniciarJuego() {
    const pantallaPerder = document.getElementById('pantalla-perder');
    if (pantallaPerder) {
        pantallaPerder.remove();
    }
    const pantallaGanar = document.getElementById('pantalla-ganar');
    if (pantallaGanar) {
        pantallaGanar.remove();
    }
    iniciarJuego();
}

document.getElementById('botonVolver').addEventListener('click', function() {
    ocultarInstrucciones();
});
