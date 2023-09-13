<template>
  <div class="col-md-3 col-sm-12 col-xs-12">
    <q-circular-progress
      show-value
      class="text-white q-ma-md"
      :value="progressValue"
      size="60px"
      :thickness="0.2"
      color="orange"
      track-color="transparent"
    >
      <q-btn
        v-if="accion == 'play'"
        @click="startAudio"
        outline
        round
        color="green"
        icon="play_arrow"
      />
      <q-btn
        v-if="accion != 'play'"
        @click="startStopRecording"
        outline
        round
        :color="color"
        icon="mic"
      />
    </q-circular-progress>
    <div v-if="isRecording">
      Duración de la grabación: {{ recordingDuration }}
    </div>
    <q-btn
      v-if="accion == 'play'"
      @click="clearAudio"
      outline
      round
      color="red"
      icon="delete"
    />
    <audio
      ref="audioPlayer"
      :src="recordedAudio"
      @play="onPlay"
      @pause="onPause"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from "vue";
import Recorder from "recorder-js";
import { LocalStorage } from "quasar";
import { useMainStore } from "src/stores/main"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén

const store = useMainStore();

//variables para el grabado de notas de voz
const isRecording = ref(false);
const recordedAudio = ref(null);
const recordingDuration = ref(0);
const base64Audio = ref(null);
const progressValue = ref(0);
let recorder;
let startTime;
let progressInterval;
const audioPlayer = ref(null);
const accion = ref("start");
const color = ref("primary");
let audioStream;
//variables para la transcripcion de la grabacioon
const isRecording2 = ref(false);
const transcript = ref("");
let recognition;
let silenceTimeout;
LocalStorage.set("transcript", store.encryptptData(""));
// //funciones para el grabado de notas de voz
function startStopRecording() {
  clearInterval(progressInterval);
  progressValue.value = 0;
  if (accion.value == "start") {
    color.value = "red";
    accion.value = "stop";
    startRecording();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioStream = stream;
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        recorder = new Recorder(audioContext, { numChannels: 1 });
        recorder.init(stream);

        startTime = Date.now();
        recorder.start();
        isRecording.value = true;

        // Actualizar la duración de grabación cada segundo
        setInterval(() => {
          recordingDuration.value = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);
      })
      .catch(function (err) {
        console.error("Error al acceder al micrófono: ", err);
      });
  } else if (accion.value == "stop") {
    stopRecording();
    accion.value = "play";
    if (recorder && isRecording.value) {
      color.value = "primary";
      recorder
        .stop()
        .then(function ({ blob }) {
          recordedAudio.value = URL.createObjectURL(blob);
          isRecording.value = false;
          recordingDuration.value = 0;
          convertToBase64();
          if (audioStream) {
            const tracks = audioStream.getTracks();
            tracks.forEach((track) => track.stop());
          }
        })
        .catch(function (err) {
          console.error("Error al detener la grabación: ", err);
        });
    }
  }
}

function convertToBase64() {
  if (recordedAudio.value) {
    const audioBlob = fetch(recordedAudio.value).then((response) =>
      response.blob()
    );
    audioBlob.then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        base64Audio.value = reader.result;
      };
      reader.readAsDataURL(blob);
    });
  }
}

function onPlay() {
  progressInterval = setInterval(() => {
    if (audioPlayer.value) {
      const currentTime = audioPlayer.value.currentTime;
      const duration = audioPlayer.value.duration;
      progressValue.value = (currentTime / duration) * 100;
    }
  }, 100);
}

function clearAudio() {
  transcript.value = "";
  clearInterval(progressInterval);
  progressValue.value = 0;
  accion.value = "start";
  recordedAudio.value = null;
  color.value = "primary";
}

function startAudio() {
  audioPlayer.value.play();
}

function onPause() {
  clearInterval(progressInterval);
}

// Limpiar recursos al desmontar el componente
onUnmounted(() => {
  if (recorder && isRecording.value) {
    recorder.stop().catch(() => {});
  }
});

//funciones para la transcripcion de la grabacion

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
  isRecording2.value = true;
}

function stopRecording() {
  if (recognition) {
    recognition.onend = null; // Eliminar el evento onend para evitar que se reinicie la grabación
    recognition.stop();
    clearTimeout(silenceTimeout);
    isRecording2.value = false;
  }
}

//export data
// Resto del código del componente...
const emit = defineEmits(["export-audio"]);

// Emitir evento cuando DatosExportado cambia
watch(transcript, (currentValue) => {
  LocalStorage.set("transcript", store.encryptptData(transcript.value));
  emit("export-audio", {
    transcript: transcript.value,
    base64Audio: base64Audio.value,
  });
});
</script>
