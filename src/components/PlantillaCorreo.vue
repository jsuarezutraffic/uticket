<template>
  <div class="card">
    <div class="cuerpo">
      <img
        src="data:image/png;base64,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"
        alt="muestra"
      />
    </div>
    <h1>${accion}</h1>
    <h4 class="texto">${mensaje}</h4>
    <h4 class="saludo">Saludos!</h4>
    <div class="pie">
      <a href="&{dominio}">Ir al aplicativo</a>
    </div>
  </div>
</template>

<style>
.card {
  text-align: center;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  width: 420px;
  border: 1px solid lightgray;
  box-shadow: 2px 2px 8px 4px #d3d3d3d1;
  border-radius: 15px;
  font-family: sans-serif;
}
.texto {
  padding: 5%;
  font-weight: normal;
}
.saludo {
  color: #26a69a;
}
img {
  margin: 10px;
}
.titulo {
  font-size: 24px;
  padding: auto;
}
.cuerpo {
  padding: 10px;
}
.pie {
  margin: 10px;
  background: #26a69a;
  border-radius: 15px 15px 15px 15px;
  padding: 10px;
  text-align: center;
}
.pie a {
  text-decoration: none;
  color: rgb(255, 255, 255);
}
</style>
