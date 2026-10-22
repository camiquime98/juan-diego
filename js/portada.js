/* Misma escala que la invitación: un solo nivel, ancho de la ventana.
   La portada mide 390×640, con el oso cerca del borde superior. */
function ajustarPortada() {
  const lienzo = document.getElementById("lienzo");
  const marco = document.getElementById("marco");
  if (!lienzo || !marco) return;
  const escala = window.innerWidth / 390;
  lienzo.style.transform = "scale(" + escala + ")";
  marco.style.height = (640 * escala) + "px";
}

ajustarPortada();
window.addEventListener("resize", ajustarPortada);
