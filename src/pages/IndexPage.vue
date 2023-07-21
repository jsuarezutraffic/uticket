<template>
  <DashboardPage v-if="configJson.nivel == 1" :showMaintable="showMaintable" />
  <Operation v-if="configJson.nivel == 2" :showMaintable="showMaintable" />
</template>

<script setup>
import BackOffice from "src/pages/GestionarTiquete.vue";
import DashboardPage from "src/pages/DashboardPage.vue";
import Operation from "src/components/MainTable.vue";
import Prueba from "src/components/index.vue";
import { useConfigStore } from "stores/config";
const configJson = require("/public/config.json");

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
