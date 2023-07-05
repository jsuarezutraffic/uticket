<template>
  <MainTable />
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
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   "https://xzovknjkdfykvximpgxh.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0"
// );

// const { data, error } = await supabase.from("concesion").select();

defineComponent({
  name: "DashboardPage",
  components: {
    MainTable,
  },
});
</script>
