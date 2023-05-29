<template>
  <BackOffice v-if="storeConfig.config.nivel == 'BackOffice'" />
  <Operation v-if="storeConfig.config.nivel == 'Operation'" />
  <!-- <Prueba v-if="store.config.nivel == 'Operation'"/> -->
</template>

<script setup>
import BackOffice from "src/pages/GestionarTiquete.vue";
import Operation from "src/components/MainTable.vue";
import Prueba from "src/components/index.vue";
import { useConfigStore } from "stores/config";
import { useMainStore } from "stores/config";

const storeConfig = useConfigStore();
const store = useConfigStore();
</script>
