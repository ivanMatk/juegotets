// ========================================
// SARMIENTO TEST - MEMO TEST
// ========================================

// 1. ELEMENTOS DEL HTML

const tablero = document.getElementById("tablero-memoria");

const movimientosTexto = document.getElementById("movimientos");
const parejasTexto = document.getElementById("parejas-encontradas");

const modalHistoria = document.getElementById("modal-historia");
const imagenHistoria = document.getElementById("imagen-historia");
const tituloHistoria = document.getElementById("titulo-historia");
const textoHistoria = document.getElementById("texto-historia");

const botonCerrar = document.getElementById("cerrar-historia");
const botonContinuar = document.getElementById("continuar-juego");
const botonReiniciar = document.getElementById("reiniciar-juego");
const botonJugarDeNuevo = document.getElementById("jugar-de-nuevo");

const mensajeFinal = document.getElementById("mensaje-final");


// ========================================
// 2. HISTORIAS DE LAS IMÁGENES
// ========================================

const historias = {

    balneario: {
        titulo: "El balneario",
        imagen: "imagenes/balneario.jpg",
        texto: "Aquí puedes contar la historia del balneario de San Francisco, su origen, la importancia que tuvo para la comunidad y los recuerdos que guarda este lugar."
    },

    cine: {
        titulo: "El cine",
        imagen: "imagenes/cine.jpg",
        texto: "El 20 de septiembre de 1889, Pedro Diale y un núcleo de quince compatriotas fundaron formalmente la Sociedad Italiana de Socorros Mutuos Roma Intangibile — la mutual más antigua de Capitán Sarmiento. Su propósito era claro: llenar el vacío y la nostalgia de la tierra natal, y construir una red de protección ante las necesidades sanitarias de una colectividad que echaba raíces en tierras bonaerenses."
    },

    elisa: {
        titulo: "Elisa",
        imagen: "imagenes/elisa.jpg",
        texto: "Estancia La Elisa, ubicada en el partido de Capitán Sarmiento (Buenos Aires), es un histórico casco de estilo palaciego italiano cuya construcción fue concluida en 1887.  Fue encargada por el expresidente de la Nación Miguel Juárez Celman, quien bautizó la residencia en honor a su esposa, Elisa Funes (cuñada del expresidente Julio Argentino Roca)."
    },

    monumento: {
        titulo: "El monumento",
        imagen: "imagenes/monumento.jpg",
        texto: "Aquí puedes contar cuándo se construyó este monumento, a quién o a qué conmemora y qué significado tiene para los habitantes de San Francisco."
    },

    museo: {
        titulo: "El museo",
        imagen: "imagenes/museo.jpg",
        texto: "Aquí puedes contar la historia del museo, cómo nació, qué objetos conserva y por qué es importante preservar el patrimonio histórico y cultural de la comunidad."
    },

    plaza: {
        titulo: "La plaza",
        imagen: "imagenes/plaza.jpg",
        texto: "Aquí puedes contar la historia de esta plaza, cómo era antiguamente, qué acontecimientos ocurrieron allí y cómo se convirtió en un punto de encuentro para la comunidad."
    }

};


// ========================================
// 3. VARIABLES DEL JUEGO
// ========================================

let primeraCarta = null;
let segundaCarta = null;

let bloqueoTablero = false;
let movimientos = 0;
let parejasEncontradas = 0;

let juegoTerminado = false;


// ========================================
// 4. PREPARAR LAS CARTAS
// ========================================

function prepararCartas() {

    const cartas = tablero.querySelectorAll(".carta");

    cartas.forEach(carta => {

        const id = carta.dataset.id;
        const imagen = carta.querySelector("img");

        // Guardamos la imagen correspondiente.
        carta.dataset.imagen = historias[id].imagen;

        // Todas las cartas empiezan ocultas visualmente.
        imagen.src = historias[id].imagen;
        imagen.alt = "Carta oculta";

        carta.classList.remove("volteada", "encontrada");
        carta.disabled = false;

        // Evitamos registrar el mismo evento más de una vez.
        carta.removeEventListener("click", voltearCarta);
        carta.addEventListener("click", voltearCarta);

    });

}


// ========================================
// 5. VOLTEAR UNA CARTA
// ========================================

function voltearCarta() {

    if (bloqueoTablero || juegoTerminado) {
        return;
    }

    if (this === primeraCarta) {
        return;
    }

    if (
        this.classList.contains("volteada") ||
        this.classList.contains("encontrada")
    ) {
        return;
    }

    const id = this.dataset.id;
    const imagen = this.querySelector("img");

    // Mostramos la imagen.
    imagen.src = historias[id].imagen;
    imagen.alt = historias[id].titulo;

    this.classList.add("volteada");

    // Guardamos la primera carta seleccionada.
    if (primeraCarta === null) {
        primeraCarta = this;
        return;
    }

    // Guardamos la segunda carta.
    segundaCarta = this;

    movimientos++;
    movimientosTexto.textContent = movimientos;

    comprobarPareja();

}


// ========================================
// 6. COMPROBAR SI LAS CARTAS COINCIDEN
// ========================================

function comprobarPareja() {

    const coinciden =
        primeraCarta.dataset.id === segundaCarta.dataset.id;

    if (coinciden) {

        bloquearPareja();

    } else {

        ocultarCartas();

    }

}


// ========================================
// 7. PAREJA CORRECTA
// ========================================

function bloquearPareja() {

    bloqueoTablero = true;

    primeraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");

    primeraCarta.disabled = true;
    segundaCarta.disabled = true;

    parejasEncontradas++;

    parejasTexto.textContent = parejasEncontradas;

    // Identificamos la historia de la pareja encontrada.
    const idHistoria = primeraCarta.dataset.id;

    // Abrimos la ventana con su historia.
    mostrarHistoria(idHistoria);

    // Comprobamos si el jugador terminó el juego.
    if (parejasEncontradas === Object.keys(historias).length) {

        juegoTerminado = true;

    }

}


// ========================================
// 8. MOSTRAR LA HISTORIA
// ========================================

function mostrarHistoria(id) {

    const historia = historias[id];

    if (!historia) {
        return;
    }

    imagenHistoria.src = historia.imagen;
    imagenHistoria.alt = historia.titulo;

    tituloHistoria.textContent = historia.titulo;
    textoHistoria.textContent = historia.texto;

    if (!modalHistoria.open) {
        modalHistoria.showModal();
    }

}


// ========================================
// 9. CERRAR LA VENTANA Y CONTINUAR
// ========================================

function cerrarHistoria() {

    if (modalHistoria.open) {
        modalHistoria.close();
    }

    // Liberamos el tablero después de cerrar la historia.
    primeraCarta = null;
    segundaCarta = null;
    bloqueoTablero = false;

    // Si se encontraron todas las parejas, mostramos
    // el mensaje final después de cerrar la última historia.
    if (juegoTerminado) {
        mensajeFinal.hidden = false;
    }

}

botonCerrar.addEventListener("click", cerrarHistoria);

botonContinuar.addEventListener("click", cerrarHistoria);


// ========================================
// 10. OCULTAR LAS CARTAS INCORRECTAS
// ========================================

function ocultarCartas() {

    bloqueoTablero = true;

    setTimeout(() => {

        const imagenPrimera = primeraCarta.querySelector("img");
        const imagenSegunda = segundaCarta.querySelector("img");

        imagenPrimera.alt = "Carta oculta";
        imagenSegunda.alt = "Carta oculta";

        // Quitamos la clase que muestra las imágenes.
        primeraCarta.classList.remove("volteada");
        segundaCarta.classList.remove("volteada");

        primeraCarta = null;
        segundaCarta = null;

        bloqueoTablero = false;

    }, 1000);

}


// ========================================
// 11. MEZCLAR LAS CARTAS
// ========================================

function mezclarCartas() {

    const cartas = Array.from(
        tablero.querySelectorAll(".carta")
    );

    for (let i = cartas.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];

    }

    cartas.forEach(carta => {
        tablero.appendChild(carta);
    });

}


// ========================================
// 12. REINICIAR EL JUEGO
// ========================================

function reiniciarJuego() {

    if (modalHistoria.open) {
        modalHistoria.close();
    }

    primeraCarta = null;
    segundaCarta = null;

    bloqueoTablero = false;
    movimientos = 0;
    parejasEncontradas = 0;

    juegoTerminado = false;

    movimientosTexto.textContent = "0";
    parejasTexto.textContent = "0";

    mensajeFinal.hidden = true;

    prepararCartas();
    mezclarCartas();

}


// ========================================
// 13. BOTONES DE REINICIO
// ========================================

botonReiniciar.addEventListener("click", reiniciarJuego);

botonJugarDeNuevo.addEventListener("click", reiniciarJuego);


// ========================================
// 14. INICIAR EL JUEGO
// ========================================

reiniciarJuego();