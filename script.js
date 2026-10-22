
document.addEventListener("DOMContentLoaded", () => {
    const tablero = document.getElementById("tablero-memoria");
    const cartas = Array.from(tablero.querySelectorAll(".carta"));

    const movimientosTexto = document.getElementById("movimientos");
    const parejasTexto = document.getElementById("parejas-encontradas");

    const botonReiniciar = document.getElementById("reiniciar-juego");
    const botonCerrarHistoria = document.getElementById("cerrar-historia");
    const botonContinuar = document.getElementById("continuar-juego");

    const modalHistoria = document.getElementById("modal-historia");
    const imagenHistoria = document.getElementById("imagen-historia");
    const tituloHistoria = document.getElementById("titulo-historia");
    const contenidoHistoria = document.getElementById("contenido-historia");

    const mensajeFinal = document.getElementById("mensaje-final");
    const botonJugarDeNuevo = document.getElementById("jugar-de-nuevo");

    const TOTAL_PAREJAS = 6;
    const IMAGEN_FINAL = "imagenes/capitansarmiento2.jpg";

    let primeraCarta = null;
    let segundaCarta = null;
    let movimientos = 0;
    let parejasEncontradas = 0;
    let bloqueado = false;
    let historiaPendiente = null;
    let partidaTerminada = false;

    const historias = {
        balneario: {
            titulo: "El antiguo balneario",
            imagen: "imagenes/balneario.jpg",
            texto: `
                <p><strong>Un lugar para encontrarse.</strong></p>
                <p>El balneario forma parte de los recuerdos de distintas generaciones. Sus espacios fueron escenario de encuentros, paseos y momentos compartidos por vecinos y visitantes.</p>
                <p>Esta fotografía nos invita a recuperar una parte de la historia de nuestra comunidad.</p>
            `
        },
        cine: {
            titulo: "El antiguo cine",
            imagen: "imagenes/cine.jpg",
            texto: `
                <p><strong>Una pantalla llena de recuerdos.</strong></p>
                <p>Los antiguos cines eran lugares de encuentro donde familias y amigos compartían películas, emociones y momentos inolvidables.</p>
                <p>Sus fotografías nos ayudan a recordar cómo se vivía el entretenimiento en otras épocas.</p>
            `
        },
        elisa: {
            titulo: "La historia de Elisa",
            imagen: "imagenes/elisa.jpg",
            texto: `
                <p><strong>Un rostro que forma parte de la memoria.</strong></p>
                <p>Detrás de cada fotografía existe una historia personal. Las experiencias y los recuerdos de las personas forman parte de la identidad de una comunidad.</p>
                <p>Esta imagen nos invita a conocer y valorar la historia de Elisa.</p>
            `
        },
        monumento: {
            titulo: "El monumento histórico",
            imagen: "imagenes/monumento.jpg",
            texto: `
                <p><strong>Un símbolo de nuestra historia.</strong></p>
                <p>Los monumentos conservan huellas del pasado y nos ayudan a recordar acontecimientos y personas importantes.</p>
                <p>Conocerlos es una forma de mantener viva la memoria para las nuevas generaciones.</p>
            `
        },
        museo: {
            titulo: "El museo",
            imagen: "imagenes/museo.jpg",
            texto: `
                <p><strong>Un espacio para conservar recuerdos.</strong></p>
                <p>Los museos reúnen objetos, fotografías y testimonios que permiten conocer la historia de una comunidad.</p>
                <p>Cada pieza puede revelar costumbres y formas de vida de otras épocas.</p>
            `
        },
        plaza: {
            titulo: "La plaza de la ciudad",
            imagen: "imagenes/plaza.jpg",
            texto: `
                <p><strong>El corazón de la comunidad.</strong></p>
                <p>Las plazas son espacios de reunión, celebraciones, juegos y encuentros. A lo largo del tiempo guardan recuerdos de distintas generaciones.</p>
                <p>En ellas, la vida cotidiana y la historia se encuentran.</p>
            `
        }
    };

    // Guardar la posición original de cada carta.
    // Las parejas reveladas ocuparán estas posiciones
    // para formar una imagen completa de 6 columnas x 2 filas.
    function prepararTablero() {
        cartas.forEach((carta, indice) => {
            carta.dataset.posicionFinal = indice;
        });
    }

    function actualizarContadores() {
        movimientosTexto.textContent = movimientos;
        parejasTexto.textContent = parejasEncontradas;
    }

    function mezclarCartas() {
        const mezcladas = [...cartas];

        for (let i = mezcladas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mezcladas[i], mezcladas[j]] = [mezcladas[j], mezcladas[i]];
        }

        mezcladas.forEach(carta => tablero.appendChild(carta));
    }

    function mostrarCarta(carta) {
        carta.classList.add("volteada");
        carta.setAttribute("aria-pressed", "true");
    }

    function ocultarCarta(carta) {
        carta.classList.remove("volteada");
        carta.setAttribute("aria-pressed", "false");
    }

    function mostrarHistoria(id) {
        const historia = historias[id];

        if (!historia) {
            convertirParejaEnRompecabezas();
            return;
        }

        tituloHistoria.textContent = historia.titulo;
        imagenHistoria.src = historia.imagen;
        imagenHistoria.alt = historia.titulo;
        contenidoHistoria.innerHTML = historia.texto;

        if (typeof modalHistoria.showModal === "function") {
            modalHistoria.showModal();
        } else {
            modalHistoria.setAttribute("open", "");
        }
    }

    function cerrarHistoria() {
        if (modalHistoria.open && typeof modalHistoria.close === "function") {
            modalHistoria.close();
        } else {
            modalHistoria.removeAttribute("open");
        }

        convertirParejaEnRompecabezas();
    }

    // Revelar la pareja después de que se leyó su historia.
    function convertirParejaEnRompecabezas() {
        if (!historiaPendiente) return;

        const pareja = historiaPendiente;
        historiaPendiente = null;

        pareja.forEach(carta => {
            carta.classList.remove("volteada");
            carta.classList.add("encontrada", "pieza-rompecabezas");
            carta.disabled = true;
            carta.setAttribute("aria-pressed", "true");

            const imagen = carta.querySelector("img");
            if (imagen) {
                imagen.alt = "Pieza descubierta del rompecabezas";
            }
        });

        // Las cartas descubiertas muestran fragmentos de la foto final.
        // El CSS usa las coordenadas para recortar la imagen.
        pareja.forEach(carta => {
            const posicion = Number(carta.dataset.posicionFinal);
            const columna = posicion % 6;
            const fila = Math.floor(posicion / 6);

            carta.style.setProperty("--pieza-x", `${columna * 20}%`);
            carta.style.setProperty("--pieza-y", `${fila * 100}%`);

            const imagen = carta.querySelector("img");
            if (imagen) {
                imagen.src = IMAGEN_FINAL;
                imagen.style.objectPosition = `${columna * 20}% ${fila * 100}%`;
            }
        });

        comprobarFinal();
    }

    function seleccionarCarta(carta) {
        if (
            bloqueado ||
            partidaTerminada ||
            historiaPendiente ||
            carta.disabled ||
            carta.classList.contains("encontrada") ||
            carta.classList.contains("volteada")
        ) {
            return;
        }

        mostrarCarta(carta);

        if (!primeraCarta) {
            primeraCarta = carta;
            return;
        }

        segundaCarta = carta;
        movimientos++;
        actualizarContadores();
        comprobarPareja();
    }

    function comprobarPareja() {
        bloqueado = true;

        const idPrimera = primeraCarta.dataset.id;
        const idSegunda = segundaCarta.dataset.id;

        if (idPrimera === idSegunda) {
            historiaPendiente = [primeraCarta, segundaCarta];

            parejasEncontradas++;
            actualizarContadores();

            primeraCarta = null;
            segundaCarta = null;

            mostrarHistoria(idPrimera);
            bloqueado = false;
            return;
        }

        const cartaUno = primeraCarta;
        const cartaDos = segundaCarta;

        setTimeout(() => {
            ocultarCarta(cartaUno);
            ocultarCarta(cartaDos);

            primeraCarta = null;
            segundaCarta = null;
            bloqueado = false;
        }, 900);
    }

    function comprobarFinal() {
        if (parejasEncontradas !== TOTAL_PAREJAS) return;

        partidaTerminada = true;
        tablero.style.display = "none";

        let imagenFinal = document.getElementById("imagen-final");

        if (!imagenFinal) {
            imagenFinal = document.createElement("img");
            imagenFinal.id = "imagen-final";
            imagenFinal.alt = "Fotografía completa del Capitán Sarmiento";

            imagenFinal.style.display = "block";
            imagenFinal.style.width = "100%";
            imagenFinal.style.maxWidth = "700px";
            imagenFinal.style.maxHeight = "65vh";
            imagenFinal.style.objectFit = "contain";
            imagenFinal.style.margin = "0 auto 20px";
            imagenFinal.style.borderRadius = "14px";
            imagenFinal.style.border = "3px solid #FFD166";

            const titulo = mensajeFinal.querySelector("h2");
            mensajeFinal.insertBefore(imagenFinal, titulo);
        }

        imagenFinal.src = IMAGEN_FINAL;
        mensajeFinal.hidden = false;

        mensajeFinal.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function reiniciarJuego() {
        if (modalHistoria.open && typeof modalHistoria.close === "function") {
            modalHistoria.close();
        } else {
            modalHistoria.removeAttribute("open");
        }

        movimientos = 0;
        parejasEncontradas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueado = false;
        historiaPendiente = null;
        partidaTerminada = false;

        mensajeFinal.hidden = true;
        tablero.style.display = "";

        const imagenFinal = document.getElementById("imagen-final");
        if (imagenFinal) imagenFinal.remove();

        cartas.forEach(carta => {
            carta.classList.remove(
                "volteada",
                "encontrada",
                "pieza-rompecabezas"
            );

            carta.disabled = false;
            carta.setAttribute("aria-pressed", "false");

            const imagen = carta.querySelector("img");
            if (imagen) {
                imagen.src = `imagenes/${carta.dataset.id}.jpg`;
                imagen.style.objectPosition = "center";
                imagen.alt = carta.dataset.id;
            }
        });

        actualizarContadores();
        mezclarCartas();
    }

    cartas.forEach(carta => {
        carta.setAttribute("aria-pressed", "false");

        carta.addEventListener("click", () => {
            seleccionarCarta(carta);
        });
    });

    botonCerrarHistoria.addEventListener("click", cerrarHistoria);
    botonContinuar.addEventListener("click", cerrarHistoria);

    // Si se cierra con Escape, revelar la pareja igualmente.
    modalHistoria.addEventListener("close", () => {
        if (historiaPendiente) {
            convertirParejaEnRompecabezas();
        }
    });

    botonReiniciar.addEventListener("click", reiniciarJuego);
    botonJugarDeNuevo.addEventListener("click", reiniciarJuego);

    prepararTablero();
    mezclarCartas();
    actualizarContadores();
});
