// src/store/index.js
import { defineStore } from "pinia";
import { useMainStore } from "src/stores/main";
const store = useMainStore();

export const useChatStore = defineStore("chat", {
  state: () => ({
    preguntas: [
      {
        key: "peaje",
        pregunta: "¿Cuál es tu peaje?",
        opciones: [], // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "tipo",
        pregunta: "¿Que tipo de problema tiene?",
        opciones: [], // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "subtipo",
        pregunta: "Seleccione el problema especifico",
        opciones: [], // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "prioridad",
        pregunta: "Seleccione la prioridad",
        opciones: [], // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "evidencia",
        pregunta: "Por favor subir evidencias",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "audio",
        pregunta: "Por favor grabe el audio",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },
      {
        key: "comentario",
        pregunta: "Por favor agregar un comentario",
        opciones: null, // No hay opciones para la primera pregunta
        respuesta: null,
      },

      // Agrega más preguntas aquí...
    ],
    indicePreguntaActual: 0,
    confirModal: false,
  }),
  actions: {
    asignarOptions() {
      this.preguntas[0].opciones = store.generalData.peaje;
      this.preguntas[1].opciones = store.generalData.tipo;
      this.preguntas[2].opciones = store.generalData.subtipo;
      this.preguntas[3].opciones = store.generalData.prioridad;
    },
    // Método para actualizar la respuesta del usuario en el almacén
    responderPregunta(respuesta) {
      this.preguntas[this.indicePreguntaActual].respuesta = respuesta;
      if (this.preguntas[this.indicePreguntaActual].key == "tipo") {
        this.preguntas[this.indicePreguntaActual + 1].opciones =
          store.generalData.subtipo.filter((p) => p.tipo == respuesta.id);
      }
      // Método para avanzar a la siguiente pregunta
    },
    avanzarSiguientePregunta() {
      console.log("entro en el if");

      this.indicePreguntaActual++;
    },
    devolverAnteriorPregunta() {
      this.indicePreguntaActual--;
    },
  },
});
