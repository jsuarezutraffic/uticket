<template>
  <q-card>
    <q-card-section>
      <!-- Mostrar la pregunta actual -->
      <div
        v-if="chatStore.preguntas[chatStore.indicePreguntaActual]"
        style="margin: auto; padding: 10px"
      >
        <span style="font-size: 18px">
          {{ chatStore.preguntas[chatStore.indicePreguntaActual].pregunta }}
        </span>
      </div>
    </q-card-section>
    <q-card-section>
      <!-- Mostrar las opciones de respuesta si están disponibles -->
      <q-list
        bordered
        v-if="
          chatStore.preguntas[chatStore.indicePreguntaActual].opciones != null
        "
      >
        <q-item
          v-for="(opcion, index) in chatStore.preguntas[
            chatStore.indicePreguntaActual
          ].opciones"
          :key="index"
          @click="
            responder(opcion)
            // Actualizar el índice del elemento activo
            //active = index;
          "
          clickable
          v-ripple
          :active="active === index"
          active-class="my-menu-link"
          exact
        >
          <q-item-section
            class="q-py-sm"
            v-if="opcion.descripcion != undefined"
            >{{ opcion.descripcion }}</q-item-section
          >
          <q-item-section class="q-py-sm" v-else>{{
            opcion.nombre
          }}</q-item-section>
        </q-item>
      </q-list>

      <!-- Mostrar el input para ingresar comentario -->
      <InputTextJump
        v-if="
          chatStore.preguntas[chatStore.indicePreguntaActual].key ==
          'comentario'
        "
        :texto="store.descryptptData(LocalStorage.getItem('transcript'))"
        @text-con-salto-linea="actualizarTextExport"
      ></InputTextJump>
      <!-- Mostrar el input para agregar imagenes -->
      <FileInput
        :label="chatStore.preguntas[chatStore.indicePreguntaActual].key"
        v-if="
          chatStore.preguntas[chatStore.indicePreguntaActual].key == 'evidencia'
        "
        @datos-exportado-cambiado="actualizarValorDatosExportado"
      ></FileInput>

      <!-- Mostrar el input para agregar audio -->
      <div
        class="col-md-3 col-sm-12 col-xs-12"
        v-if="
          chatStore.preguntas[chatStore.indicePreguntaActual].key == 'audio'
        "
      >
        <RecordAudio @export-audio="getAudio"></RecordAudio>
        {{ transcript }}
      </div>

      <!-- Mostrar el botón de siguiente pregunta -->
      <q-btn
        v-if="validateBtnSiguente()"
        @click="enviarRespuestaInput('siguiente')"
      >
        Siguiente
      </q-btn>
      <!-- Mostrar el botón de Enviar pregunta -->
      <q-btn
        class="q-ma-md"
        v-if="chatStore.indicePreguntaActual == chatStore.preguntas.length - 1"
        @click="enviarRespuesta()"
      >
        Enviar
      </q-btn>
      <!-- Mostrar el botón de Atras pregunta -->
      <q-btn
        class="q-ma-md"
        v-if="chatStore.indicePreguntaActual > 0"
        @click="chatStore.devolverAnteriorPregunta()"
      >
        Atras
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useChatStore } from "src/stores/chat"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
import { useMainStore } from "src/stores/main"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
import { defineComponent, ref } from "vue";
import FileInput from "src/components/FileImage.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import RecordAudio from "src/components/RecordAudio.vue";
import { LocalStorage } from "quasar";
// Acceder al almacén global
const chatStore = useChatStore();
const store = useMainStore();
chatStore.asignarOptions();
const active = ref(-1);
const input = ref(null);
//variables para la transcripcion de la grabacioon
const transcript = ref(null);
//se responde cuando se da click
const responder = (respuesta) => {
  active.value = -1;
  chatStore.responderPregunta(respuesta);
  siguientePregunta();
};

const siguientePregunta = () => {
  chatStore.avanzarSiguientePregunta();
};

const enviarRespuesta = () => {
  chatStore.confirModal = true;
  if (chatStore.indicePreguntaActual == chatStore.preguntas.length - 1) {
    enviarRespuestaInput("enviar");
  }
};

//enviar respuesta de tipo input
const enviarRespuestaInput = (accion) => {
  chatStore.responderPregunta(input.value);
  if (accion == "siguiente") {
    siguientePregunta();
  }
  input.value = null;
};

function actualizarValorDatosExportado(nuevoValor) {
  input.value = nuevoValor;
}

const getAudio = (nuevoValor) => {
  transcript.value = nuevoValor.transcript;
  input.value = nuevoValor.base64Audio;
};
function actualizarTextExport(nuevoValor) {
  input.value = nuevoValor;
}
//validaciones
const validateBtnSiguente = () => {
  if (
    chatStore.preguntas[chatStore.indicePreguntaActual].key == "audio" ||
    chatStore.preguntas[chatStore.indicePreguntaActual].key == "evidencia"
  )
    return true;
  else return false;
};
</script>
<style lang="scss">
.my-menu-link {
  font-weight: bold;
  color: rgb(255, 255, 255);
  background: $primary;
}
</style>
