<template>
<div v-if="table">
  <div class="q-pa-md flex" v-if="usuarios.filter(
                          (p) => p.id == idusuario
                        )[0].nivel === 2">
    <TransitionGroup name="fade">
    <q-table v-if="table"
      key="table"
      class="table-container"
      separator="horizontal"
      flat bordered
      ref="tableRef"
      :rows="tiquete"
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
        <q-tr :props="props" @click="props.selected = !props.selected; clickRow(props.row)">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name == 'tipo'">
                {{
                  tipo.filter(
                    (p) => p.id == col.value
                  )[0].descripcion
                }}
            </div>

            <div v-else-if="col.name == 'cliente'">
              {{
                cliente.filter(
                  (p) => p.id == col.value
                )[0].nombres
              }}
            </div>

            <div v-else-if="col.name == 'prioridad'">
              {{
                prioridad.filter(
                  (p) => p.id == col.value
                )[0].descripcion
              }}
            </div>

            <div v-else-if="col.name == 'estado'">
              {{
                estado.filter(
                  (p) => p.id == col.value
                )[0].descripcion
              }}
            </div>

            <div v-else-if="col.name == 'concesion'">
              {{
                concesion.filter(
                  (p) => p.id == col.value
                )[0].nombre
              }}
            </div>

            <div v-else-if="col.name == 'solicitud'">
              {{
                solicitud.filter(
                  (p) => p.id == col.value
                )[0].nombre
              }}
            </div>

            <div v-else-if="col.name == 'peaje'">
              {{
                peaje.filter(
                  (p) => p.id == col.value
                )[0].nombre
              }}
            </div>

            <div v-else-if="col.name == 'subtipo'">
              {{
                subtipo.filter(
                  (p) => p.id == col.value
                )[0].descripcion
              }}
            </div>

            <div v-else-if="col.name == 'creacion'">
              {{
                creacion.filter((p) => p.id == col.value)[0].created_at
              }}
            </div>

            <div v-else>
              {{ col.value }}
            </div>
          </q-td>

        </q-tr>
      </template>
    </q-table>

    <q-card class="table-card" v-if="tablaDetalle && selected.length > 0" key="card">

      <div class="q-pa-sm q-mt-xs box-order">
        <span class="text-h5 q-pa-md text-bold text-center text-uppercase title-card-style" >Detalles de ticket</span>
        <div class="row-class-state">

          <q-chip clickable @click="onClick" color="green" text-color="white" icon="fa-solid fa-bookmark" class="q-ml-md q-pa-md">
            Estado: {{ estadoDisplay }}
          </q-chip>

          <q-chip clickable @click="onClick" :color="colorPrioridad" text-color="white" icon="info" class="q-ml-md q-pa-md">
            Prioridad: {{ prioridadDisplay }}
          </q-chip>

          <q-chip clickable @click="onClick" :color="colorTipo" text-color="white" icon="fa-solid fa-tag" class="q-ml-md q-pa-md">
            Tipo: {{ tipoDisplay }}
          </q-chip>

        </div>

        <div class="q-pa-md">
          <q-table v-if="detalleTiquete.length > 0 && tablaDetalle === true"
            key="table"
            class="table-container"
            separator="horizontal"
            flat bordered
            ref="tableRef"
            :rows="detalleTiquete"
            :columns="historial"
            :table-colspan="6"
            row-key="id"
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
              <q-tr :props="props">
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  <div v-if="col.name == 'operador'">
                    <div v-if="usuarios !== null">
                      {{
                        usuarios.filter(
                          (p) => p.id == col.value
                        )[0].nombre
                      }}
                    </div>
                  </div>
                  <div
                    v-else-if="
                      col.name == 'campomodificador' ||
                      col.name == 'valoranterior' ||
                      col.name == 'valornuevo' ||
                      col.name == 'comentarios'
                      ">
                      <div v-if="col.value == null">
                        {{ col.value }}
                      </div>
                      <div v-else>
                        <div
                          v-html="col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')"
                        ></div>
                      </div>
                    </div>
                  <div v-else>{{ col.value }}</div>
                </q-td>
              </q-tr>
            </template>

          </q-table>
        </div>
      </div>

      <div class="q-pa-md button-gestionar">
        <q-btn label="Gestionar" color="primary" text-color="white" @click="dialog = true" :disable="estado.filter(
                          (p) => p.id == Fila.estado
                        )[0].descripcion !== 'Asignado'" />
        <q-dialog v-model="dialog">
          <q-card>

            <q-card-section>
              <div class="q-pa-md" style="max-width: 500px">
                <p class="text-h6">Asignar estado:</p>

                <q-select square filled v-model="ticketState" :options="optionState" option-value="id" option-label="descripcion" label="Estado" class="q-mb-md" />
                <div class="text-h6">Observaciones: </div>
                  <q-input
                    v-model="FilaDetalle.comentarios"
                    filled
                    type="textarea"
                  />
              </div>
              <div class="q-gutter-md row items-start q-ml-xs">
                <q-file
                  v-model="FilaDetalle.adjunto_url"
                  label="Adjuntar archivos"
                  filled
                  counter
                  :counter-label="counterLabelFn"
                  max-files="3"
                  multiple
                  style="max-width: 300px"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </q-card-section>

            <q-card-section class="second-card buttons no-padding">
              <q-btn v-close-popup label="Volver" color="primary" class="q-mr-md close-buttons" text-color="dark"/>
              <q-btn v-close-popup label="Enviar" color="primary" class="q-mr-md close-buttons" text-color="dark" @click="gestionarTicket"/>
            </q-card-section>

          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </TransitionGroup>
  </div>
  <div v-if="usuarios.filter(
                          (p) => p.id == idusuario
                        )[0].nivel === 3">
    <BackOffice />
  </div>
</div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from 'vue'
// import { columns } from 'src/assets/js/tableModule'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import BackOffice from '../pages/GestionarTiquete.vue'

const dialog = ref(false)
const selected = ref([])
const detalleTiquete = ref([])
const tableRef = ref(null)
const expanded = ref([])
const tiquete = ref([])
const tipo = ref([])
const concesion = ref([])
const tipoDisplay = ref('')
const colorTipo = ref('')
const cliente = ref([])
const prioridad = ref([])
const solicitud = ref([])
const prioridadDisplay = ref('')
const colorPrioridad = ref('')
const estado = ref([])
const colorEstado = ref('')
const estadoDisplay = ref('')
const peaje = ref([])
const subtipo = ref([])
const creacion = ref([])
const usuarios = ref([])
const tablaDetalle = ref(false)
const idusuario = LocalStorage.getItem('IdUsuario')
const optionState = ref([])

function counterLabelFn ({ totalSize, filesNumber, maxFiles }) {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
}
const ticketState = ref(null)

const table = ref(false)
const Fila = ref({})
const FilaDetalle = ref({})
const columns = [
  {
    name: 'id',
    label: '# Ticket',
    align: 'center',
    field: 'id',
    sortable: true
  },
  {
    name: 'creacion',
    label: 'Creacion',
    align: 'center',
    field: 'creacion',
    sortable: true
  },
  {
    name: 'cliente',
    label: 'Cliente',
    align: 'center',
    field: 'cliente',
    sortable: true
  },
  {
    name: 'concesion',
    label: 'Concesion',
    align: 'center',
    field: 'concesion',
    sortable: true
  },
  {
    name: 'solicitud',
    label: 'Tipo de solicitud',
    align: 'center',
    field: 'solicitud',
    sortable: true
  },
  {
    name: 'peaje',
    label: 'Peaje',
    align: 'center',
    field: 'peaje',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true
  },
  {
    name: 'prioridad',
    label: 'Prioridad',
    align: 'center',
    field: 'prioridad',
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center',
    field: 'tipo',
    sortable: true
  },
  {
    name: 'subtipo',
    label: 'Subtipo',
    align: 'center',
    field: 'subtipo',
    sortable: true
  }
]
const historial = [
  {
    name: 'id',
    label: 'Reference No.',
    align: 'center',
    field: 'id',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Creacion',
    align: 'center',
    field: 'created_at',
    sortable: true
  },
  {
    name: 'operador',
    label: 'Operador',
    align: 'center',
    field: 'operador',
    sortable: true
  },
  {
    name: 'comentarios',
    label: 'Comentarios',
    align: 'center',
    field: 'comentarios',
    sortable: true
  },
  {
    name: 'campomodificador',
    label: 'Campo modificado',
    align: 'center',
    field: 'campomodificador',
    sortable: true
  },
  {
    name: 'valoranterior',
    label: 'Valor Anterior',
    align: 'center',
    field: 'valoranterior',
    sortable: true
  },
  {
    name: 'valornuevo',
    label: 'Valor Nuevo',
    align: 'center',
    field: 'valornuevo',
    sortable: true
  }
]

async function getData () {
  await api
    .get(`tiquete?asignado=eq.${idusuario}&select=*`)
    .then((response) => {
      console.log(response.data)
      tiquete.value = response.data
    })

  await api.get('tipo?select=*').then((response) => {
    tipo.value = response.data
  })

  await api.get('prioridad?select=*').then((response) => {
    prioridad.value = response.data
  })

  await api.get('estado?select=*').then((response) => {
    estado.value = response.data
  })

  await api.get('cliente?select=*').then((response) => {
    cliente.value = response.data
  })

  await api.get('concesion?select=*').then((response) => {
    concesion.value = response.data
  })

  await api.get('solicitud?select=*').then((response) => {
    solicitud.value = response.data
  })

  await api.get('peaje?select=*').then((response) => {
    peaje.value = response.data
  })

  await api.get('subtipo?select=*').then((response) => {
    subtipo.value = response.data
  })

  await api.get('tiquete?select=created_at').then((response) => {
    creacion.value = response.data
  })

  await api
    .get('usuarios?select=*')
    .then((response) => {
      console.log(response.data)
      usuarios.value = response.data
      console.log(usuarios.value[0].nombre)
    })
  table.value = true
}

async function clickRow (row) {
  Fila.value = row

  optionState.value = estado.value.filter((p) => p.descripcion === 'Escalado' || p.descripcion === 'Solucionado')
  console.log(optionState.value)
  await api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&select=*`)
    .then((response) => {
      console.log(response.data)
      detalleTiquete.value = response.data
      tablaDetalle.value = true
    })

  tipoDisplay.value = tipo.value.filter((p) => p.id === row.tipo)[0].descripcion
  if (row.tipo === 1) {
    colorTipo.value = 'purple'
  } else if (row.tipo === 2) {
    colorTipo.value = 'cyan'
  } else if (row.tipo === 3) {
    colorTipo.value = 'blue'
  }

  estadoDisplay.value = estado.value.filter((p) => p.id === row.estado)[0].descripcion
  if (row.estado === 1) {
    colorEstado.value = 'green'
  } else if (row.estado === 2) {
    colorEstado.value = 'orange'
  } else if (row.estado === 3) {
    colorEstado.value = 'red'
  }

  prioridadDisplay.value = prioridad.value.filter((p) => p.id === row.prioridad)[0].descripcion
  if (row.prioridad === 3) {
    colorPrioridad.value = 'green'
  } else if (row.prioridad === 2) {
    colorPrioridad.value = 'orange'
  } else if (row.prioridad === 1) {
    colorPrioridad.value = 'red'
  }
  console.log(row)
}

const agregarSaltosDeLinea = (text) => {
  const words = text.split(' ')
  const result = []
  for (let i = 0; i < words.length; i++) {
    result.push(words[i])
    if ((i + 1) % 5 === 0) {
      result.push('\n')
    }
  }
  return result.join(' ')
}

function gestionarTicket () {
  Fila.value.estado = ticketState.value.id
  FilaDetalle.value.tiquete = Fila.value.id
  FilaDetalle.value.campomodificador = 'Estado'
  FilaDetalle.value.valoranterior = 'Asignado'
  FilaDetalle.value.valornuevo = ticketState.value.descripcion
  FilaDetalle.value.operador = idusuario
  FilaDetalle.value.comentarios = agregarSaltosDeLinea(FilaDetalle.value.comentarios)

  api
    .post('detalletiquete', FilaDetalle.value)
    .then((response) => {
      console.log(response.data)
      api
        .put(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
        .then((response) => {
          console.log(response.data)
        })
    })
}

onMounted(() => {
  getData()
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
  justify-content: center !important;
  align-items: center !important;
}

.table-card {
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-items: center;
  margin: 0 auto;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #ffffffe0;
}

.second-card {
  display: flex;
  height: 70px;
  width: 500px;
  justify-content: center;
  justify-items: center;
  align-items: center;
  margin-right: 30px;
}

.button-gestionar {
  display: flex !important;
  justify-content: center;
  justify-items: flex-start;
}

.box-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.title-card-style {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-items: center;
  width: 100%;
  margin: 0 auto;
  background-color: $primary;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #c1c1c1;
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
  justify-content: center;
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

@media only screen and (max-width: 600px)  {
  .table-card {
    margin-right: 0px;
  }

  q-table {
    display: flex;
  }
}
</style>
