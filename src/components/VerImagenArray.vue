<template>
  <q-card style="width: 50em; max-width: 100%; height: auto">
    <div class="row q-pa-md" v-if="imagenes.length > 0">
      <q-carousel
        animated
        v-model="slide"
        arrows
        navigation
        infinite
        control-color="black"
        padding
        style="width: 100%; min-height: 60vh"
      >
        <q-carousel-slide
          v-for="(img, index) in imagenes"
          :key="index"
          :name="index"
          :img-src="img"
          ref="carrusel"
        />
        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              @click="clickImag"
              push
              round
              dense
              color="white"
              text-color="primary"
              icon="fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>
    <div class="row text-center justify-center" v-else>
      <h4 class="col-12">No existen Evidencias</h4>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  datoProp: {
    type: String,
    required: true,
  },
});
const slide = ref(0);
const imagenes = ref(props.datoProp == null ? [] : props.datoProp.split("|"));
const carrusel = ref();

if (imagenes.value[0] == "") {
  imagenes.value.pop();
} else if (imagenes.value.length > 1) {
  imagenes.value.pop();
} else {
}
const clickImag = () => {
  var newWindow = window.open("", "_blank");
  newWindow.document.write(
    '<html><head><title>Imagen en nueva ventana</title></head><body style="margin: 0; padding: 0; height: 100vh; display: flex; justify-content: center; align-items: center;">'
  );
  newWindow.document.write(
    '<img src="' +
      carrusel.value[0].imgSrc +
      '" style="max-width: 100%; max-height: 100%;"/>'
  );
  newWindow.document.write("</body></html>");
  newWindow.document.close();
};
</script>
<style>
.card-container2 {
  display: inline-block;
  max-width: 100%;
}
</style>
