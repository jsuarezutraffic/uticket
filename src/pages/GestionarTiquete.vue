<template>
  <div class="q-pa-md flex">
    <div class="q-pa-md flex" v-if="table">
      <TransitionGroup name="fade">
        <q-table
          class="table-container"
          separator="horizontal"
          flat
          bordered
          ref="tableRef"
          :rows="tiquetes"
          :columns="columns"
          :table-colspan="6"
          row-key="id"
          selection="single"
          v-model:selected="selected"
          fixed-header
          v-model:expanded="expanded"
          :visible-columns="[
            'created_at',
            'cliente',
            'concesion',
            'peaje',
            'requerimiento',
            'observaciones',
            'estado',
            'prioridad',
            'tipo',
            'subtipo',
          ]"
        >
          >
          <template v-slot:top>
            <q-btn
              class="q-ma-xs"
              color="secondary"
              size="md"
              @click="mostrarModal = true"
              >Gestionar
            </q-btn>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props" class="head-styles">
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
            <q-tr
              :props="props"
              @click="
                props.selected = !props.selected;
                clickRow(selected[0]);
              "
            >
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name == 'cliente'">
                  {{ cliente.filter((p) => p.id == col.value)[0].nombres }}
                </div>
                <div v-else-if="col.name == 'concesion'">
                  {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
                </div>
                <div v-else-if="col.name == 'peaje'">
                  {{ peajes.filter((p) => p.id == col.value)[0].nombre }}
                </div>
                <div v-else-if="col.name == 'estado'">
                  {{ Estados.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else-if="col.name == 'prioridad'">
                  {{
                    Prioridades.filter((p) => p.id == col.value)[0].descripcion
                  }}
                </div>
                <div v-else-if="col.name == 'tipo'">
                  {{ Tipos.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else-if="col.name == 'subtipo'">
                  {{ Subtipos.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <!-- <q-card class="table-card" v-if="selected.length > 0">
          <q-card-section>
            {{ selected[0] }}
          </q-card-section>
        </q-card> -->
      </TransitionGroup>
    </div>
  </div>

  <q-dialog
    v-model="mostrarModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 100%; height: 800px">
      <div class="row">
        <div class="col-auto">
          <!-- <span>Nuevo Ticket</span> -->
          <q-space />
          <q-btn
            flat
            icon="close"
            v-close-popup
            style="display: flex; margin-left: auto"
          />
        </div>

        <div class="col-auto">
          <q-scroll-area
            visible
            style="height: 600px; width: 1000px; max-width: 100%"
          >
            <q-card flat>
              <div class="q-pa-md">
                <q-card>
                  <q-form @submit.prevent="AgregarTicket()" id="form">
                    <div class="row">
                      <div class="col-12">
                        <div class="row" style="background: #ffffff">
                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <q-select
                              readonly
                              outlined
                              v-model="Fila.concesion"
                              :options="concesion"
                              option-label="nombre"
                              option-value="id"
                              label="Concesion"
                              dense
                              class="q-pa-md"
                              emit-value
                              map-options
                            ></q-select>
                          </div>

                          <div class="col-md-6 col-sm-6 col-xs-12">
                            <!-- <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              label="Peaje"
                              class="q-pa-md"
                            /> -->

                            <q-select
                              readonly
                              outlined
                              v-model="Fila.peaje"
                              :options="peajes"
                              option-label="nombre"
                              option-value="id"
                              label="Peaje"
                              dense
                              class="q-pa-md"
                              emit-value
                              map-options
                            ></q-select>
                          </div>
                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
                              readonly
                              label="Tipo"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.tipo"
                              dense
                              :options="Tipos"
                              option-label="descripcion"
                              option-value="id"
                              emit-value
                              map-options
                              class="q-pa-md"
                            />
                          </div>
                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
                              readonly
                              label="Tipo"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.subtipo"
                              dense
                              :options="Subtipos"
                              option-label="descripcion"
                              option-value="id"
                              emit-value
                              map-options
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
                              readonly
                              label="Prioridad"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.prioridad"
                              dense
                              :options="Prioridades"
                              option-label="descripcion"
                              option-value="id"
                              class="q-pa-md"
                              emit-value
                              map-options
                            />
                          </div>

                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <q-input
                              readonly
                              outlined
                              v-model="Fila.requerimiento"
                              dense
                              type="textarea"
                              label="Requerimiento"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <q-input
                              readonly
                              outlined
                              v-model="Fila.observaciones"
                              dense
                              type="text"
                              label="Observaciones"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-6 col-sm-6 col-xs-12">
                            <q-select
                              readonly
                              label="Estado"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.estado"
                              dense
                              :options="Estados"
                              option-label="descripcion"
                              option-value="id"
                              class="q-pa-md"
                              emit-value
                              map-options
                            />
                          </div>

                          <div class="col-md-6 col-sm-6 col-xs-12">
                            <q-select
                              readonly
                              label="Proceso"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.proceso"
                              dense
                              :options="Procesos"
                              option-label="descripcion"
                              option-value="id"
                              class="q-pa-md"
                              emit-value
                              map-options
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-form>
                </q-card>
              </div>
            </q-card>
          </q-scroll-area>
        </div>
      </div>

      <div class="row">
        <div class="col-auto">
          <q-card flat>
            <div class="q-pa-md">
              <q-table
                separator="horizontal"
                flat
                bordered
                ref="tableRef"
                :rows="tiquetes"
                :columns="columns"
                :table-colspan="6"
                row-key="id"
                selection="single"
                v-model:selected="selected"
                fixed-header
                v-model:expanded="expanded"
              >
                <template v-slot:top>
                  <!-- <q-btn
                    class="q-ma-xs"
                    color="secondary"
                    size="md"
                    @click="mostrarModal = true"
                    >Gestionar Tickete
                  </q-btn> -->
                </template>

                <template v-slot:header="props">
                  <q-tr :props="props" class="head-styles">
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
                  <q-tr
                    :props="props"
                    @click="props.selected = !props.selected"
                  >
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
            </div>
          </q-card>
        </div>
      </div>

      <!-- <q-card-actions align="right">
        <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn>
      </q-card-actions> -->

      <div class="row">
        <div class="col-12" style="display: flex">
          <q-btn
            label="Asignar Ticket"
            style="margin-left: auto; margin-right: auto"
            color="primary"
            class="q-ma-md"
            no-caps
            @click="ReenviarIntermediador()"
          />
          <q-btn
            label="Gestionar Ticket"
            style="margin-left: auto; margin-right: auto"
            color="primary"
            class="q-ma-md"
            no-caps
            @click="ReenviarIntermediador()"
          />
          <q-btn
            label="Cerrar Ticket"
            style="margin-left: auto; margin-right: auto"
            color="primary"
            class="q-ma-md"
            no-caps
            @click="ReenviarIntermediador()"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineComponent, ref, onMounted } from 'vue'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

const idusuario = LocalStorage.getItem('IdUsuario')
const selected = ref([])

const tiquetes = ref([])
const concesion = ref({})
const peajes = ref([])
const cliente = ref([])
const temas = ['Incidentes', 'Requerimientos', 'PQR']
const Tipos = ref([])
const Subtipos = ref([])
const SubtipoOptions = ref([])
const Prioridades = ref([])
const Estados = ref([])
const Procesos = ref([])

const mostrarModal = ref(false)
const Fila = ref({})
const tableRef = ref(null)
const expanded = ref([])
const table = ref(false)
const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true
  },
  {
    name: 'created_at',
    align: 'left',
    label: 'Creacion',
    field: 'created_at',
    sortable: true
  },
  {
    name: 'numero',
    align: 'left',
    label: 'Número',
    field: 'numero',
    sortable: true
  },
  {
    name: 'cliente',
    align: 'left',
    label: 'Cliente',
    field: 'cliente',
    sortable: true
  },

  {
    name: 'concesion',
    align: 'left',
    label: 'Conceción',
    field: 'concesion',
    sortable: true
  },

  {
    name: 'peaje',
    align: 'left',
    label: 'Peaje',
    field: 'peaje',
    sortable: true
  },

  {
    name: 'requerimiento',
    align: 'left',
    label: 'Requerimiento',
    field: 'requerimiento',
    sortable: true
  },
  {
    name: 'observaciones',
    align: 'left',
    label: 'Observaciones',
    field: 'observaciones',
    sortable: true
  },

  {
    name: 'estado',
    align: 'left',
    label: 'Estado',
    field: 'estado',
    sortable: true
  },
  {
    name: 'privado',
    align: 'left',
    label: 'Privado',
    field: 'privado',
    sortable: true
  },
  {
    name: 'prioridad',
    align: 'left',
    label: 'Prioridad',
    field: 'prioridad',
    sortable: true
  },
  {
    name: 'proceso',
    align: 'left',
    label: 'Proceso',
    field: 'proceso',
    sortable: true
  },

  {
    name: 'tipo',
    align: 'left',
    label: 'Subtipo',
    field: 'tipo',
    sortable: true
  },
  {
    name: 'subtipo',
    align: 'left',
    label: 'Subtipo',
    field: 'subtipo',
    sortable: true
  },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado',
    field: 'asignado',
    sortable: true
  }
]

const clickRow = (row) => {
  console.log(row)
  Fila.value = {
    concesion: row.concesion,
    peaje: row.peaje,
    tipo: row.tipo,
    subtipo: row.subtipo,
    prioridad: row.prioridad,
    requerimiento: row.requerimiento,
    observaciones: row.observaciones,
    estado: row.estado,
    proceso: row.proceso,
    id: row.id
  }

  api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&select=*`)
    .then((response) => {
      // tiquetes.value = response.data;
      console.log(response.data)
      // Fila.value = response.data;
    })
}

const loadData = async () => {
  api.get('tiquete?').then((response) => {
    tiquetes.value = response.data
    console.log(tiquetes.value)
    Fila.value = response.data
  })
}

const DatosGenerales = async () => {
  await api.get('cliente?select=*').then((response) => {
    cliente.value = response.data
    Fila.value.cliente = cliente.value[0].id
  })

  await api.get('concesion?select=*').then((response) => {
    concesion.value = response.data
    console.log(concesion.value)
    // Fila.value.concesion = cliente.value[0].id;
  })

  await api.get('peaje?select=*').then((response) => {
    peajes.value = response.data
  })

  await api.get('tipo?select=*').then((response) => {
    Tipos.value = response.data
  })

  await api.get('subtipo?select=*').then((response) => {
    Subtipos.value = response.data
  })

  await api.get('prioridad?select=*').then((response) => {
    Prioridades.value = response.data
    Prioridades.value.sort(function (b, a) {
      return b.orden - a.orden
    })
  })

  await api.get('estado?select=*').then((response) => {
    Estados.value = response.data
  })

  await api.get('proceso?select=*').then((response) => {
    Procesos.value = response.data
    table.value = true
  })

  Fila.value.asignado = '4ca6c4d3-c2f9-4c1f-9411-de9271b9519f'
  Fila.value.privado = null
  // const array = [5, 2, 9, 1, 3];
  // array.sort(function (a, b) {
  //   return b - a;
  // });
}

// const TipoSeleccion = (value) => {
//   SubtipoOptions.value = Subtipos.value.filter((tipo) => tipo.tipo == value);
//   Fila.value.subtipo = null;
//   console.log(SubtipoOptions.value);
// };

const AgregarTicket = async () => {
  console.log(Fila.value)
  // const { error } = await supabase.from("tiquete").insert(Fila.value);
  api
    .post('tiquete', Fila.value)
    .then((response) => {
      console.log('Solicitud exitosa:', response.data)
      loadData()
      mostrarModal.value = false
    })
    .catch((error) => {
      console.error('Error al realizar la solicitud:', error)
    })
}

onMounted(async () => {
  await DatosGenerales()
  loadData()
  // tableRef.value.scrollTo(10);
})
// for (let i = 0; i < 2; i++) {
//   rows = rows.concat(
//     seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 }))
//   );
// }

// onMounted(() => {
//   tableRef.value.scrollTo(10);
// });

defineComponent({
  name: 'MainTable'
})
</script>

<style lang="scss">
.th-text {
  color: $dark !important;
  font-weight: bold !important;
  font-size: 1rem !important;
  text-align: center !important;
}

.head-styles {
  background-color: white !important;
  padding: 10px !important;
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
