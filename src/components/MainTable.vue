<template>
  <div class="q-pa-md flex">
    <TransitionGroup name="fade">
    <q-table
      key="table"
      class="table-container"
      separator="horizontal"
      flat bordered
      ref="tableRef"
      :rows="concesion"
      :columns="columns"
      :table-colspan="6"
      row-key="id"
      selection="single"
      v-model:selected="selected"
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
    <q-card class="table-card" v-if="selected.length > 0" key="card">
      <div class="q-pa-sm q-mt-xs box-order">
      <span class="text-h5 q-pa-md text-bold">Detalles de ticket</span>
      <div class="row-class-state">
        <q-chip clickable @click="onClick" color="green" text-color="white" icon="event" class="q-ml-md">
          Prioridad: 1
        </q-chip>
        <q-chip clickable @click="onClick" color="red" text-color="white" icon="info" class="q-ml-md">
          Tipo: Incidencia
        </q-chip>
        <q-select :options="options" rounded label="Estado" class="q-ml-md" outlined v-model="model"/>
      </div>

      <div class="q-pa-md">
        <q-btn label="Reasignar" color="primary" @click="dialog = true" />

        <q-dialog v-model="dialog">
          <q-card>
            <q-card-section class="row items-center q-gutter-sm">
              <q-btn label="Agregar observación" color="primary" @click="dialog2 = true" />
              <q-btn v-close-popup label="Close" color="primary" />

              <q-dialog v-model="dialog2">
                <q-card>
                  <q-card-section>
                    <div class="q-pa-md" style="max-width: 500px">
                      <div class="text-h6">Observaciones: </div>
                      <q-input
                        v-model="text"
                        filled
                        type="textarea"
                      />
                    </div>
                  </q-card-section>
                  <q-card-section class="second-card buttons no-padding">
                    <q-btn v-close-popup label="Volver" color="primary" class="q-mr-md close-buttons"/>
                    <q-btn v-close-popup label="Enviar" color="primary" class="q-mr-md close-buttons"/>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>

      <div class="q-pa-md">
        <q-table
          title="Historial"
          key="table2"
          :rows="rows"
          :columns="columns"
          row-key="name"
        />
      </div>
    </div>
    </q-card>
  </TransitionGroup>
  </div>
  {{ concesion }}
</template>

<script setup>
import { defineComponent, ref, onMounted } from 'vue'
import { columns, seed } from 'src/assets/js/tableModule'
import { supabase } from 'src/lib/supabaseClient'

const text = ref('')
const dialog = ref(false)
const dialog2 = ref(false)
const selected = ref([])
const seedSize = seed.length

const options = [
  'En proceso', 'Escalado', 'En gestión', 'Cerrado'
]
const model = ref('En proceso')
let rows = []
for (let i = 0; i < 2; i++) {
  rows = rows.concat(seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}

const tableRef = ref(null)
const expanded = ref([])
const concesion = ref([])

async function getConcesion () {
  const { data } = await supabase.from('concesion').select()
  concesion.value = data
  console.log(concesion.value)
}

// eslint-disable-next-line prefer-const

onMounted(() => {
  getConcesion()
  tableRef.value.scrollTo(10)
})

const onClick = () => {
  console.log('click')
}
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
  width: fit-content;
  height: fit-content;
  justify-content: center;
  margin-right: 200px;
  align-items: center;
  flex-direction: column;
}

.second-card {
  display: flex;
  height: 70px;
  width: 500px;
  justify-content: center;
  justify-items: center;
  align-items: center;
}

.box-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.close-buttons {
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
}

.row-class-state {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  justify-items: center;
  width: 100%;
  margin: 0 auto;
}

.buttons {
  display: flex;
  max-width: 100%;
  justify-content: flex-end;
  justify-items: center;
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
