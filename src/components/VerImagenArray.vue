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
        />
      </q-carousel>
    </div>
    <div class="row text-center justify-center" v-else>
      <h4 class="col-12">No existen Evidencias</h4>
    </div>
  </q-card>
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

const slide = ref(0);
const imagenes = ref(props.datoProp.split("|"));

if (imagenes.value[0] == "") {
  imagenes.value.pop();
} else if (imagenes.value.length > 1) {
  imagenes.value.pop();
} else {
  console.log("nada");
}
</script>
<style>
.card-container2 {
  display: inline-block;
  max-width: 100%;
}
</style>
