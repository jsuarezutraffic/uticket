<template>
  <GestionarTiquete :showMaintable="showMaintable" />
</template>

<script setup>
import { defineComponent } from "vue";
import GestionarTiquete from "src/pages/GestionarTiquete.vue";
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
    "finalizar",
    "devuelto",
    "eliminar",
  ],
};
defineComponent({
  name: "TiquetesPage",
  components: {
    GestionarTiquete,
  },
});
</script>
