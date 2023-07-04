<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">
      Comenzar grabación
    </button>
    <button @click="stopRecording" :disabled="!isRecording">
      Detener grabación
    </button>
    <!-- <button @click="downloadRecording" :disabled="!recordedAudio">
      Descargar grabación
    </button> -->
    <audio
      ref="audioPlayer"
      :src="recordedAudio"
      controls
      @play="onPlay"
      @pause="onPause"
    ></audio>
    <div v-if="isRecording">
      Duración de la grabación: {{ recordingDuration }}
    </div>
    <!-- <button @click="downloadBase64" :disabled="!true">Descargar base64</button> -->
    <!-- <audio ref="base64AudioPlayer" :src="base64Audio" controls ></audio> -->
    <q-circular-progress
      show-value
      class="text-white q-ma-md"
      :value="progressValue"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
    >
      <q-icon name="volume_up" />
    </q-circular-progress>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Recorder from "recorder-js";

const isRecording = ref(false);
const recordedAudio = ref(null);
const recordingDuration = ref(0);
const base64Audio = ref(null);
const progressValue = ref(0);
let recorder;
let startTime;
let progressInterval;
const audioPlayer = ref(null);

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
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
}

function stopRecording() {
  if (recorder && isRecording.value) {
    recorder
      .stop()
      .then(function ({ blob }) {
        recordedAudio.value = URL.createObjectURL(blob);
        isRecording.value = false;
        recordingDuration.value = 0;
        convertToBase64();
      })
      .catch(function (err) {
        console.error("Error al detener la grabación: ", err);
      });
  }
}

// function downloadRecording() {
//   if (recordedAudio.value) {
//     const link = document.createElement("a");
//     link.href = recordedAudio.value;
//     link.download = "grabacion.wav";
//     link.click();
//   }
// }

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

// function downloadBase64() {
//   if (base64Audio.value) {
//     const link = document.createElement("a");
//     link.href = base64Audio.value;
//     link.download = "grabacion_base64.txt";
//     link.click();
//   }
// }
function onPlay() {
  progressInterval = setInterval(() => {
    if (audioPlayer) {
      const currentTime = audioPlayer.value.currentTime;
      const duration = audioPlayer.value.duration;
      progressValue.value = (currentTime / duration) * 100;
      console.log((currentTime / duration) * 100);
    }
  }, 100);
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
</script>
