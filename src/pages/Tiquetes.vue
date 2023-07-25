<template>
  <GestionarTiquete :showMaintable="showMaintable" />
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import GestionarTiquete from "src/pages/GestionarTiquete.vue";
import { LocalStorage } from "quasar";

const showMaintable = {
  showGraficas: true,
  showColums: [
    "id",
    "created_at",
    "cliente",
    "concesion",
    "peaje",
    "solicitud",
    // 'observaciones',
    "estado",
    "prioridad",
    "tipo",
    "subtipo",
    "equipo",
    "finalizar",
    "devuelto",
    "eliminar",
    "tiempo",
  ],
};
LocalStorage.set("origen", "tiq");

defineComponent({
  name: "TiquetesPage",
  components: {
    GestionarTiquete,
  },
});
</script>
