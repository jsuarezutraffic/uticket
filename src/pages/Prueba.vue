<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">
      Comenzar grabación
    </button>
    <button @click="stopRecording" :disabled="!isRecording">
      Detener grabación
    </button>
    <div>{{ transcript }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isRecording = ref(false);
const transcript = ref("");

let recognition;
let silenceTimeout;

function startRecording() {
  recognition = new webkitSpeechRecognition(); // Para navegadores basados en WebKit (Chrome, Safari)
  // recognition = new SpeechRecognition(); // Para navegadores compatibles con la especificación W3C

  recognition.lang = "es-ES"; // Establece el idioma del reconocimiento de voz
  recognition.continuous = true; // Habilita el reconocimiento continuo

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    transcript.value += lastResult[0].transcript;
  };

  recognition.onend = () => {
    // Reiniciar la grabación después de 5 segundos de inactividad
    silenceTimeout = setTimeout(() => {
      startRecording();
    }, 500);
  };

  recognition.start();
  isRecording.value = true;
}

function stopRecording() {
  if (recognition) {
    recognition.onend = null; // Eliminar el evento onend para evitar que se reinicie la grabación
    recognition.stop();
    clearTimeout(silenceTimeout);
    isRecording.value = false;
  }
}
</script>
