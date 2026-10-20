const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

// Abrir / cerrar menú
menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
    }
});

// Cerrar menú al elegir una sección
navMenu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => navMenu.classList.remove("active"));
});

// Modo oscuro
const botonTema = document.querySelector(".tema");
function aplicarTema(oscuro) {
    document.body.classList.toggle("oscuro", oscuro);
    botonTema.textContent = oscuro ? "☀️" : "🌙";
    botonTema.setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}
let modoOscuro = false;
try { modoOscuro = localStorage.getItem("tema") === "oscuro"; } catch (e) {}
aplicarTema(modoOscuro);
botonTema.addEventListener("click", () => {
    modoOscuro = !modoOscuro;
    aplicarTema(modoOscuro);
    try { localStorage.setItem("tema", modoOscuro ? "oscuro" : "claro"); } catch (e) {}
});

// Filtro de deportes
const botonesFiltro = document.querySelectorAll(".filtros button");
const elementosFiltro = document.querySelectorAll("[data-tipo]");
function filtrar(tipo) {
    elementosFiltro.forEach((el) => { el.hidden = tipo !== "todos" && el.dataset.tipo !== tipo; });
    botonesFiltro.forEach((b) => {
        const activo = b.dataset.filtro === tipo;
        b.classList.toggle("activo", activo);
        b.setAttribute("aria-pressed", activo);
    });
}
botonesFiltro.forEach((b) => b.addEventListener("click", () => filtrar(b.dataset.filtro)));
window.addEventListener("hashchange", () => {
    const el = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (el && el.hidden) { filtrar("todos"); el.scrollIntoView(); }
});

// Quiz
const preguntas = [
    { p: "¿Cuántos jugadores tiene cada equipo en el campo de fútbol?", o: ["9", "11", "13"], c: 1 },
    { p: "¿Quién inventó el baloncesto en 1891?", o: ["William G. Morgan", "James Naismith", "Jefferson Pérez"], c: 1 },
    { p: "¿A qué altura está el aro de baloncesto?", o: ["2,50 metros", "3,05 metros", "3,50 metros"], c: 1 },
    { p: "¿Cuántos sets se juegan como máximo en un partido de voleibol?", o: ["3", "5", "7"], c: 1 },
    { p: "¿Quién ganó el oro olímpico en marcha de 20 km en Atlanta 1996?", o: ["Richard Carapaz", "Neisi Dajomes", "Jefferson Pérez"], c: 2 }
];
const cajaQuiz = document.getElementById("quiz-caja");
let preguntaActual = 0, puntos = 0;

function mostrarPregunta() {
    cajaQuiz.textContent = "";
    if (preguntaActual >= preguntas.length) {
        const msg = puntos >= 4 ? "🏆 ¡Excelente!" : puntos >= 2 ? "👍 ¡Bien hecho!" : "💪 ¡Sigue practicando!";
        const final = document.createElement("p");
        final.className = "quiz-final";
        final.textContent = `Sacaste ${puntos} de ${preguntas.length}. ${msg}`;
        const reiniciar = document.createElement("button");
        reiniciar.type = "button"; reiniciar.className = "boton"; reiniciar.textContent = "Jugar de nuevo";
        reiniciar.addEventListener("click", () => { preguntaActual = 0; puntos = 0; mostrarPregunta(); });
        cajaQuiz.append(final, reiniciar);
        return;
    }
    const x = preguntas[preguntaActual];
    const titulo = document.createElement("p");
    titulo.className = "quiz-pregunta";
    titulo.textContent = `${preguntaActual + 1}/${preguntas.length}. ${x.p}`;
    const opciones = document.createElement("div");
    opciones.className = "quiz-opciones";
    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("aria-live", "polite");
    const botones = x.o.map((texto, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = texto;
        b.addEventListener("click", () => {
            botones.forEach((o, j) => { o.disabled = true; if (j === x.c) o.classList.add("correcta"); });
            if (i === x.c) { puntos++; feedback.textContent = "¡Correcto! ✅"; }
            else { b.classList.add("incorrecta"); feedback.textContent = `Casi. La respuesta era: ${x.o[x.c]}.`; }
            const sig = document.createElement("button");
            sig.type = "button"; sig.className = "boton";
            sig.textContent = preguntaActual === preguntas.length - 1 ? "Ver resultado" : "Siguiente";
            sig.addEventListener("click", () => { preguntaActual++; mostrarPregunta(); });
            cajaQuiz.append(sig);
            sig.focus();
        });
        opciones.append(b);
        return b;
    });
    cajaQuiz.append(titulo, opciones, feedback);
}
mostrarPregunta();

// Volver arriba
const botonSubir = document.querySelector(".subir");
window.addEventListener("scroll", () => botonSubir.classList.toggle("visible", window.scrollY > 400));
