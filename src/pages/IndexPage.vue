<template>
  <MainTable :showMaintable="showMaintable" />
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  defineProps,
  defineEmits,
  toRefs,
} from "vue";
import { defineComponent } from "vue";
import MainTable from "src/components/MainTable.vue";

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
  name: "DashboardPage",
  components: {
    MainTable,
  },
});
</script>
