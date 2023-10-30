<template>
  <div>
    <div class="col q-pa-md" v-if="archivos.length > 0">
      <div class="row">
        <div class="col-4" v-for="(file, index) in archivos" :key="index">
          <q-img
            class="q-gutter-sm q-my-sm"
            :src="
              expresionRegular.test(filaavatar[index].name) ? file : noImagen
            "
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
          {{
            expresionRegular.test(filaavatar[index].name)
              ? ""
              : filaavatar[index].name
          }}
          <br />
        </div>
      </div>
    </div>
    <q-file
      class="col q-ma-md FileSelected"
      accept="*"
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
const archivos3 = ref("");
const fileInput = ref(null);
const tamanoMaximoImagen = ref("4000000");
const noImagen =
  "data:image/png;base64,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";
const expresionRegular = ref(/\.(jpg|jpeg|png|gif|bmp)$/i);
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
      archivos3.value += file + "°" + item.name + "°" + "|";
    });
    DatosExportado.value = archivos3.value;
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
