<template>
  <div>
    <div class="col q-pa-md" v-if="archivos.length > 0">
      <div class="row">
        <div class="col-4" v-for="file in archivos" :key="file">
          <q-img
            class="q-gutter-sm q-my-sm"
            :src="file"
            alt=""
            spinner-color="red"
            style="height: 100px"
            outlined
            :loading="loadingImage"
          >
            <q-icon
              @click="clearImage(file)"
              class="absolute all-pointer-events"
              size="32px"
              name="cancel"
              color="red-14"
              style="top: 8px; left: 8px"
            >
              <q-tooltip> Tooltip </q-tooltip>
            </q-icon>
          </q-img>
          <br />
        </div>
      </div>
    </div>
    <q-file
      class="col q-ma-md FileSelected"
      accept="image/*"
      multiple
      outlined
      dense
      use-chips
      v-model="filaavatar"
      ref="fileInput"
      :max-file-size="tamanoMaximoImagen"
      @rejected="onRejected"
    >
      <template v-slot:prepend>
        <div class="q-space-between"></div>
        <q-icon name="image" />
        <span
          class="q-mx-sm text-body2 non-selectable"
          @click="activateInput()"
        >
          {{
            filaavatar.length > 0
              ? "Imágenes cargadas: " + filaavatar.length
              : "Cargar evidencias"
          }}</span
        >
      </template>
    </q-file>
  </div>
</template>

<script setup>
/*eslint-disable */
import { ref, watch } from "vue";
import { createBase64Image } from "boot/global";
import { useQuasar } from "quasar";
const DatosExportado = ref("");
const loadingImage = ref(false);
const filaavatar = ref([]);
const archivos = ref([]);
const archivos2 = ref("");
const fileInput = ref(null);
const tamanoMaximoImagen = ref("2000000");
let $q = useQuasar();
const activateInput = () => {
  fileInput.value.pickFiles();
};
// se ejecuta cuando se carga la imagen
watch(filaavatar, (currentValue, oldValue) => {
  archivos2.value = "";
  convertirBase64();
});

async function convertirBase64() {
  loadingImage.value = true;
  if (filaavatar.value.length !== 0) {
    async function asyncForEach(array, callback) {
      for (const item of array) {
        await callback(item);
      }
    }
    await asyncForEach(filaavatar.value, async (item) => {
      const file = await createBase64Image(item);
      archivos2.value += file + "|";
    });
    DatosExportado.value = archivos2.value;
    archivos.value = archivos2.value.split("|");
    archivos.value.pop();
  } else {
    archivos.value = [];
  }
  loadingImage.value = false;
}

function clearImage(value) {
  const index = archivos.value.indexOf(value);
  if (index !== -1) {
    archivos.value.splice(index, 1);
    filaavatar.value.splice(index, 1);
  }
}

// Resto del código del componente...
const emit = defineEmits(["datos-exportado-cambiado"]);

// Emitir evento cuando DatosExportado cambia
watch(DatosExportado, (currentValue) => {
  emit("datos-exportado-cambiado", currentValue);
});

const onRejected = (rejectedEntries) => {
  for (const iterator of rejectedEntries) {
    $q.notify({
      type: "negative",
      message: `La imagen "${iterator.file.name}" supera el tamaño maximo de 2M`,
    });
  }
};
</script>
<style>
.FileSelected .q-field__native {
  display: none;
}
</style>
