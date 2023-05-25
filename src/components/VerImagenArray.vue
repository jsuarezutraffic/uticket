<template>
  <q-card style="width: 50em; max-width: 100%; height: auto">
    <div class="row" v-if="imagenes.length > 0">
      <div class="col" v-for="img in imagenes" :key="img">
        <q-img
          class="q-gutter-sm q-my-sm"
          :src="img"
          alt=""
          spinner-color="red"
          outlined
          fit="scale-down"
        >
        </q-img>
        <br />
      </div>
    </div>
    <div class="row text-center container" style="height: 10em" v-else>
      <h4>No existen evidencias</h4>
    </div>
  </q-card>
  <!-- <q-card style="width: 50em; max-width: 100%; height: auto">
    <div class="row" v-if="imagenes.length > 0">
      <div class="col" v-for="img in imagenes" :key="img">
        <q-img
          class="q-gutter-sm q-my-sm"
          :src="img"
          alt=""
          spinner-color="red"
          outlined
          fit="scale-down"
        >
        </q-img>
        <br />
      </div>
    </div>
    <div class="row text-center container" style="height: 10em" v-else>
      <h4>No existen evidencias</h4>
    </div>
  </q-card> -->
</template>

<script setup>
import { ref, watch } from "vue";
import { createBase64Image } from "boot/global";
import { defineProps } from "vue";

const props = defineProps({
  datoProp: {
    type: String,
    required: true,
  },
});
const imagenes = ref(props.datoProp.split("|"));
// if (condition) {
//   imagenes.value.pop();
// }

console.log(imagenes.value);

// const DatosExportado = ref("");
// const loadingImage = ref(false);
// const filaavatar = ref([]);
// const archivos = ref([]);
// const archivos2 = ref("");

// // se ejecuta cuando se carga la imagen
// watch(filaavatar, (currentValue, oldValue) => {
//   console.log(filaavatar.value);
//   archivos2.value = "";
//   convertirBase64();
// });

// async function convertirBase64() {
//   loadingImage.value = true;
//   if (filaavatar.value.length !== 0) {
//     async function asyncForEach(array, callback) {
//       for (const item of array) {
//         await callback(item);
//       }
//     }
//     await asyncForEach(filaavatar.value, async (item) => {
//       const file = await createBase64Image(item);
//       archivos2.value += file + "|";
//     });
//     DatosExportado.value = archivos2.value;
//     archivos.value = archivos2.value.split("|");
//     archivos.value.pop();
//   } else {
//     archivos.value = [];
//   }
//   loadingImage.value = false;
// }

// function clearImage(value) {
//   const index = archivos.value.indexOf(value);
//   if (index !== -1) {
//     archivos.value.splice(index, 1);
//     filaavatar.value.splice(index, 1);
//   }
// }

// Resto del código del componente...
// const emit = defineEmits(["datos-exportado-cambiado"]);

// // Emitir evento cuando DatosExportado cambia
// watch(DatosExportado, (currentValue) => {
//   emit("datos-exportado-cambiado", currentValue);
// });
</script>
<style>
.card-container2 {
  display: inline-block;
  max-width: 100%;
}
</style>
