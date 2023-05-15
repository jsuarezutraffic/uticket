<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useMainStore } from "stores/main";
import { useConfigStore } from "stores/config";
export default defineComponent({
  name: "App",
  beforeCreate() {
    const store = useMainStore();
    const storeConfig = useConfigStore();
    store.init();
  },
});
</script>
