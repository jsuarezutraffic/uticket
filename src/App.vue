<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useMainStore } from "stores/main";
import "./css/estilos.scss";
export default defineComponent({
  name: "App",
  beforeCreate() {
    // Stimulsoft.Base.StiLicense.loadFromFile("reports/license.key");
    const store = useMainStore();
    store.init();
  },
});
</script>
