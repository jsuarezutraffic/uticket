<template>
  <DashboardPage
    v-if="storeConfig.config.nivel == 'BackOffice'"
    :showMaintable="showMaintable"
  />
  <Operation
    v-if="storeConfig.config.nivel == 'Operation'"
    :showMaintable="showMaintable"
  />
  <!-- <Prueba v-if="store.config.nivel == 'Operation'"/> -->
</template>

<script setup>
import BackOffice from "src/pages/GestionarTiquete.vue";
import DashboardPage from "src/pages/DashboardPage.vue";
import Operation from "src/components/MainTable.vue";
import Prueba from "src/components/index.vue";
import { useConfigStore } from "stores/config";

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
    "asignado",
  ],
};

const storeConfig = useConfigStore();
</script>
