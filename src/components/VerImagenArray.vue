<template>
  <q-card style="width: 50em; max-width: 100%; height: auto">
    <div class="row q-pa-md" v-if="arrayImaExt.length > 0">
      <q-carousel
        animated
        v-model="slide"
        v-model:fullscreen="fullscreen"
        arrows
        navigation
        infinite
        control-color="black"
        padding
        style="width: 100%; min-height: 60vh"
      >
        <q-carousel-slide
          v-for="(img, index) in arrayImaExt"
          :key="index"
          :name="index"
          :img-src="
            expresionRegular.test(img.nombreImg) ? img.imagen : noImagen
          "
          ref="carrusel"
        />
        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              @click="clickImag()"
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
      <h4 class="col-12">No Existen Evidencias</h4>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const carrusel = ref();

const props = defineProps({
  datoProp: {
    type: String,
    required: true,
  },
});

const slide = ref(0);
const fullscreen = ref(false);
const imagenes = ref(props.datoProp == null ? [] : props.datoProp.split("|"));
const arrayImaExt = ref([]);
const noImagen =
  "data:image/png;base64,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YQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAEAhYQwAoJAwBgBQSBgDACgkjAEAFBLGAAAKCWMAAIWEMQCAQsIYAECZxeL/AS40eGr4bxHTAAAAAElFTkSuQmCC";
const expresionRegular = /\.(jpg|jpeg|png|gif|bmp)$/i;

if (imagenes.value[0] == "") {
  imagenes.value.pop();
} else if (imagenes.value.length > 1) {
  imagenes.value.pop();
}

imagenes.value.forEach((cadenaBase64) => {
  const imagenBase64 = cadenaBase64.split("°");
  // Crea un objeto JSON con la imagen y la extensión
  let objetoImagen = {};
  objetoImagen = {
    imagen: imagenBase64[0],
    nombreImg: imagenBase64[1],
  };
  arrayImaExt.value.push(objetoImagen);
});
const clickImag = () => {
  var newWindow = window.open("", "_blank");
  const nombreImagen = arrayImaExt.value[carrusel.value[0].name].nombreImg;
  let html = "";
  newWindow.document.write(
    '<html><head><title>Imagen en nueva ventana</title></head><body style="margin: 0; padding: 0; height: 100vh; display: flex; justify-content: center; align-items: center;">'
  );
  if (expresionRegular.test(nombreImagen)) {
    html = `<img src="${carrusel.value[0].imgSrc}" style="max-width: 100%; max-height: 100%;"/>
    <a href="${carrusel.value[0].imgSrc}" download="${nombreImagen}"> <button>Descargar Imagen</button> </a>`;
  } else {
    html = `<a href="${
      arrayImaExt.value[carrusel.value[0].name].imagen
    }" download="${nombreImagen}"> <button>Descargar Archivo</button> </a>`;
  }
  newWindow.document.write(html);
  newWindow.document.write("</body></html>");
  newWindow.document.close();
};
</script>
<style>
.card-container2 {
  display: inline-block;
  max-width: 100%;
}

/* Estilo para la imagen */
.zoomed-image {
  cursor: zoom-in; /* Cambia el cursor a una lupa al pasar el ratón sobre la imagen */
  max-width: 100%;
  max-height: 100%;
}

/* Estilo para el contenedor de la imagen */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Establece la altura de la ventana completa */
}
</style>
