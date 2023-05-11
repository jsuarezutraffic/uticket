<template>
  <div class="q-pa-md flex">
    <TransitionGroup name="fade">
    <q-table
      class="table-container"
      separator="horizontal"
      flat bordered
      ref="tableRef"
      :rows="rows"
      :columns="columns"
      :table-colspan="6"
      row-key="name"
      selection="single"
      v-model:selected="selected"
      fixed-header
      v-model:expanded="expanded"
      >

      <template v-slot:header="props">
        <q-tr :props="props" class="bg-primary head-styles">
          <q-th
            class="th-text head-styles"
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" @click="props.selected = !props.selected">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-card class="table-card" v-if="selected.length > 0">
        <q-card-section>
          {{ selected[0] }}
        </q-card-section>
      </q-card>
  </TransitionGroup>
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from 'vue'
import { columns, seed } from 'src/assets/js/tableModule'

const selected = ref([])
const seedSize = seed.length

let rows = []
for (let i = 0; i < 2; i++) {
  rows = rows.concat(seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}

const tableRef = ref(null)
const expanded = ref([])

onMounted(() => {
  tableRef.value.scrollTo(10)
})

defineComponent({
  name: 'MainTable'
})

</script>

<style lang="scss">

.th-text {
  color: $dark !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  text-align: center !important;
}

.head-styles {
  background-color: $primary !important;
  padding: 18px !important;
  margin-right: 10px !important;

}

.table-card {
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  width: 20vw;
  height: 20vh;
  justify-content: center;
  margin-right: 200px;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(1400px) scale(1);
}

.fade-leave-active {
  position: absolute;
}

</style>
