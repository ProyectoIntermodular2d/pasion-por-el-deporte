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

// Glosario: buscador
const quitarTildes = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const buscador = document.getElementById("buscador");
const terminos = document.querySelectorAll(".termino");
const sinResultados = document.getElementById("glosario-vacio");
buscador.addEventListener("input", () => {
    const q = quitarTildes(buscador.value.trim());
    let visibles = 0;
    terminos.forEach((t) => {
        const coincide = quitarTildes(t.textContent).includes(q);
        t.hidden = !coincide;
        if (coincide) visibles++;
    });
    sinResultados.hidden = visibles > 0;
});

// Test: ¿Qué deporte va contigo?
const testPreguntas = [
    { p: "¿Cómo prefieres jugar?", o: [
        ["En un equipo grande", ["futbol", "beisbol", "voleibol"]],
        ["En un equipo pequeño", ["baloncesto", "voleibol"]],
        ["Por mi cuenta", ["natacion", "atletismo", "tenis", "ciclismo", "boxeo"]]] },
    { p: "¿Qué se te da mejor?", o: [
        ["Correr y aguantar mucho tiempo", ["atletismo", "ciclismo", "futbol"]],
        ["Saltar y reaccionar rápido", ["baloncesto", "voleibol", "tenis"]],
        ["La fuerza y los reflejos", ["boxeo", "beisbol"]],
        ["Moverme en el agua", ["natacion"]]] },
    { p: "¿Dónde prefieres practicar?", o: [
        ["Al aire libre, en un campo", ["futbol", "beisbol", "atletismo"]],
        ["En una cancha o gimnasio", ["baloncesto", "voleibol", "tenis", "boxeo"]],
        ["En el agua o en la carretera", ["natacion", "ciclismo"]]] },
    { p: "¿Con qué te gustaría jugar?", o: [
        ["Un balón grande", ["futbol", "baloncesto", "voleibol"]],
        ["Raqueta, bate o guantes", ["tenis", "beisbol", "boxeo"]],
        ["Mi cuerpo o una bicicleta", ["atletismo", "natacion", "ciclismo"]]] },
    { p: "¿Qué quieres lograr?", o: [
        ["Trabajar en equipo y hacer amigos", ["futbol", "voleibol", "baloncesto", "beisbol"]],
        ["Superarme a mí mismo", ["atletismo", "natacion", "ciclismo"]],
        ["Mejorar mis reflejos y mi estrategia", ["tenis", "boxeo", "beisbol"]]] }
];
const testResultados = {
    futbol: ["⚽", "Fútbol", "Disfrutas el juego en equipo, correr y la emoción de un campo grande."],
    baloncesto: ["🏀", "Baloncesto", "Te van la rapidez, la puntería y las jugadas en equipo."],
    voleibol: ["🏐", "Voleibol", "Te gustan los reflejos, el salto y comunicarte con tu equipo."],
    beisbol: ["⚾", "Béisbol", "Combinas concentración, buenos reflejos y estrategia en equipo."],
    natacion: ["🏊", "Natación", "Disfrutas el agua y trabajar tu resistencia a tu propio ritmo."],
    atletismo: ["🏃", "Atletismo", "Te motivan la velocidad y superar tus propias marcas."],
    tenis: ["🎾", "Tenis", "Te gustan la estrategia, la coordinación y el duelo uno a uno."],
    ciclismo: ["🚴", "Ciclismo", "Tienes ganas de resistencia, aire libre y recorrer distancias."],
    boxeo: ["🥊", "Boxeo", "Te atraen los reflejos, la disciplina y el autocontrol."]
};
const cajaTest = document.getElementById("test-caja");
let testPaso = 0, testPuntos = {};

function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
}

function mostrarTest() {
    cajaTest.textContent = "";
    if (testPaso >= testPreguntas.length) {
        let mejor = "futbol", max = -1;
        Object.keys(testResultados).forEach((k) => {
            if ((testPuntos[k] || 0) > max) { max = testPuntos[k] || 0; mejor = k; }
        });
        const [emoji, nombre, texto] = testResultados[mejor];
        const acciones = crear("div", "test-resultado");
        const ver = crear("a", "boton", `Ver la tarjeta de ${nombre}`);
        ver.href = "#" + mejor;
        const repetir = crear("button", "boton", "Repetir el test");
        repetir.type = "button";
        repetir.addEventListener("click", () => { testPaso = 0; testPuntos = {}; mostrarTest(); });
        acciones.append(ver, repetir);
        cajaTest.append(crear("p", "quiz-final", `Tu deporte ideal: ${emoji} ${nombre}`), crear("p", "", texto), acciones);
        return;
    }
    const x = testPreguntas[testPaso];
    const opciones = crear("div", "quiz-opciones");
    x.o.forEach(([texto, deportes]) => {
        const b = crear("button", "", texto);
        b.type = "button";
        b.addEventListener("click", () => {
            deportes.forEach((d) => { testPuntos[d] = (testPuntos[d] || 0) + 1; });
            testPaso++;
            mostrarTest();
        });
        opciones.append(b);
    });
    cajaTest.append(crear("p", "quiz-pregunta", `${testPaso + 1}/${testPreguntas.length}. ${x.p}`), opciones);
}
mostrarTest();
