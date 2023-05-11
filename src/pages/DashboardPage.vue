<template>
<!-- Table Component -->
  <MainTable />
</template>

<script setup>

import { defineComponent } from 'vue'
import MainTable from 'src/components/MainTable.vue'

defineComponent({
  name: 'DashboardPage',
  components: {
    MainTable
  }
})

</script>
