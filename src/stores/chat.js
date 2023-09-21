// src/store/index.js
import { defineStore } from "pinia";
import { useMainStore } from "src/stores/main";
const store = useMainStore();

export const useChatStore = defineStore("chat", {
  state: () => ({
    preguntas: [
      {
        key:"peaje",
        pregunta: "¿Cuál es tu peaje?",
        opciones: [
          { id: 1, descripcion: "Caucacia" },
          { id: 2, descripcion: "Zaragoza" },
        ], // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key:"tipo",
        pregunta: "¿Que tipo de problema tiene?",
        opciones: store.generalData.tipo, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key:"subtipo",
        pregunta: "Seleccione el problema especifico",
        opciones: store.generalData.subtipo, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key:"comentario",
        pregunta: "Por favor agregar un comentario",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key:"evidencia",
        pregunta: "Por favor subir evidencias",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key:"audio",
        pregunta: "Por grabe el audio",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      // Agrega más preguntas aquí...
    ],
    indicePreguntaActual: 0,
  }),
  actions: {
    // Método para actualizar la respuesta del usuario en el almacén
    responderPregunta(respuesta) {
      console.log(respuesta);
      this.preguntas[this.indicePreguntaActual].respuesta = respuesta;
      console.log(this.preguntas[this.indicePreguntaActual].key)
      if (this.preguntas[this.indicePreguntaActual].key == 'tipo') {
      this.preguntas[this.indicePreguntaActual+1].opciones = store.generalData.subtipo.filter((p) => p.tipo == respuesta.id);
      }
    // Método para avanzar a la siguiente pregunta
    },
    avanzarSiguientePregunta() {
      this.indicePreguntaActual++;
    },
  },
});
