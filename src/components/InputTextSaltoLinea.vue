<template>
  <div>
    <q-editor
      :rules="inputRules"
      v-model="text"
      :definitions="{
        bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' },
      }"
    />
  </div>
</template>

<script setup>
/*eslint-disable */
import { LocalStorage } from "quasar";
import { computed, toRefs, ref, watchEffect, watch } from "vue";
import { useMainStore } from "src/stores/main"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
const store = useMainStore();
// Convertir props a variable
const props = defineProps(["texto"]);
let { texto } = toRefs(props);
// const text = ref("");
const text = ref(store.descryptptData(LocalStorage.getItem("transcript")));
const ExportText = ref("");
const inputRules = [
  (val) => (val && val.length > 0) || "Por favor llenar el campo",
];

const agregarSaltosDeLinea = (text) => {
  const words = text.split(" ");
  const result = [];
  for (let i = 0; i < words.length; i++) {
    result.push(words[i]);
    if ((i + 1) % 5 === 0) {
      result.push("\n");
    }
  }
  return result.join(" ");
};

// Resto del código del componente...
const emit = defineEmits(["text-con-salto-linea"]);

// Emitir evento cuando DatosExportado cambia
watch(text, (currentValue) => {
  ExportText.value = agregarSaltosDeLinea(currentValue);
  LocalStorage.set("transcript", store.encryptptData(ExportText.value));
  emit("text-con-salto-linea", ExportText.value);
});
watch(texto, (currentValue) => {
  if (currentValue == "") {
    text.value = "";
  } else {
    // text.value = text.value + currentValue;
    text.value = currentValue;
  }
});
</script>

<style>
.FileSelected .q-field__native {
  display: none;
}
</style>
