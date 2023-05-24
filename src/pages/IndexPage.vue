<template>
  <BackOffice v-if="storeConfig.config.nivel == 'BackOffice'" />
  <Operation v-if="storeConfig.config.nivel == 'Operation'" />
  <Prueba />
</template>

<script setup>
import BackOffice from "src/components/BackOffice.vue";
import Operation from "src/components/MainTable.vue";
import Prueba from "src/components/index.vue";
import { useConfigStore } from "stores/config";

const storeConfig = useConfigStore();
</script>
