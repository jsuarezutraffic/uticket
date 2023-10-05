function zoomImagen(event) {
  const contenedorImagen =
    newWindow.document.getElementById("contenedor-imagen");
  const imagen = newWindow.document.querySelector(".imagen");

  let escala = 1;

  // Determina la dirección de la rueda del ratón
  const delta = Math.sign(event.deltaY);

  // Ajusta el factor de escala según la dirección de la rueda
  escala += delta * 0.1;

  // Limita la escala a un rango específico (ajústalo según tus necesidades)
  escala = Math.min(Math.max(0.5, escala), 3);

  // Aplica el zoom a la imagen
  imagen.style.transform = `scale(${escala})`;
}
