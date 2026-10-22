/* La invitación está dibujada a 390px, como el teléfono original,
   y se amplía para ocupar todo el ancho de la ventana. */
function ajustarInvitacion() {
  const hoja = document.getElementById("hoja");
  const marco = document.getElementById("marco");
  if (!hoja || !marco) return;
  const escala = window.innerWidth / 390;
  hoja.style.transform = "scale(" + escala + ")";
  marco.style.height = (hoja.offsetHeight * escala) + "px";
}

ajustarInvitacion();
window.addEventListener("resize", ajustarInvitacion);
window.addEventListener("load", ajustarInvitacion);

const piezas = document.querySelectorAll(".entra");
piezas.forEach((pieza, indice) => {
  pieza.style.setProperty("--retraso", (indice % 3) * 0.14 + "s");
});

function revelar() {
  const limite = window.innerHeight * 0.9;
  piezas.forEach((pieza) => {
    if (pieza.classList.contains("visto")) return;
    if (pieza.getBoundingClientRect().top < limite) pieza.classList.add("visto");
  });
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  piezas.forEach((pieza) => pieza.classList.add("visto"));
} else {
  revelar();
  window.addEventListener("scroll", revelar, { passive: true });
}

document.querySelectorAll(".vivo").forEach((dibujo) => {
  dibujo.addEventListener("click", () => {
    dibujo.classList.remove("saludo");
    void dibujo.offsetWidth;
    dibujo.classList.add("saludo");
  });
});

const destino = new Date("2026-11-15T15:00:00-05:00");

function pintarCuenta() {
  const ahora = new Date();
  let restante = Math.max(0, destino - ahora);
  const segundos = Math.floor(restante / 1000) % 60;
  const minutos = Math.floor(restante / 60000) % 60;
  const horas = Math.floor(restante / 3600000) % 24;
  const dias = Math.floor(restante / 86400000);
  const mapa = { dias, horas, minutos, segundos };
  Object.entries(mapa).forEach(([id, valor]) => {
    const nodo = document.getElementById(id);
    if (nodo) nodo.textContent = String(valor).padStart(2, "0");
  });
}

pintarCuenta();
setInterval(pintarCuenta, 1000);

/* El botón reproduce audio/cancion.mp3. Si ese archivo no carga, suena una melodía breve. */
const boton = document.getElementById("play");
let audioCtx;
let activo = false;
let timer;

function nota(frecuencia, cuando, duracion) {
  const osc = audioCtx.createOscillator();
  const ganancia = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = frecuencia;
  ganancia.gain.setValueAtTime(0.0001, cuando);
  ganancia.gain.exponentialRampToValueAtTime(0.08, cuando + 0.05);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, cuando + duracion);
  osc.connect(ganancia);
  ganancia.connect(audioCtx.destination);
  osc.start(cuando);
  osc.stop(cuando + duracion + 0.02);
}

function frase() {
  const inicio = audioCtx.currentTime + 0.05;
  [523, 659, 784, 659, 698, 523].forEach((frecuencia, i) => {
    nota(frecuencia, inicio + i * 0.45, 0.4);
  });
}

if (boton) {
  boton.addEventListener("click", async () => {
    const archivo = boton.dataset.audio;
    if (archivo) {
      let musica = document.getElementById("musica");
      if (!musica) {
        musica = new Audio(archivo);
        musica.id = "musica";
        musica.loop = true;
        document.body.appendChild(musica);
      }
      if (musica.paused) {
        await musica.play();
        boton.classList.add("sonando");
        boton.textContent = "❚❚";
      } else {
        musica.pause();
        boton.classList.remove("sonando");
        boton.textContent = "▶";
      }
      return;
    }

    audioCtx = audioCtx || new AudioContext();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    activo = !activo;
    boton.classList.toggle("sonando", activo);
    boton.textContent = activo ? "❚❚" : "▶";
    if (activo) {
      frase();
      timer = setInterval(frase, 2800);
    } else {
      clearInterval(timer);
    }
  });
}
