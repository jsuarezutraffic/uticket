<template>
  <div class="q-pa-md">
    <TransitionGroup>
      <q-table
        :loading="visible"
        v-if="table"
        virtual-scroll
        separator="horizontal"
        flat
        bordered
        ref="tableRef"
        :rows="cliente"
        :columns="columns"
        :table-colspan="6"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        fixed-header
        hide-pagination="true"
        v-model:pagination="pagination"
        :sort-method="customSort()"
        :sort-method-props="{ sortBy, sortDesc }"
        :selected-rows-label="getSelectedString"
        selected-color="primary"
        :visible-columns="[
          'created_at',
          'nombres',
          'concesion',
          'telefono',
          'correo',
          'estado',
          'admi',
        ]"
        rows-per-page-label="Registro por página"
        loading-label="Cargando..."
        no-data-label="No existen datos para mostrar"
      >
        <template v-slot:top>
          <div style="font-weight: bold" class="q-table__title">Clientes</div>
          <q-space />
          <q-btn
            v-show="selected.length > 0"
            class="q-mr-sm"
            round
            color="tertiary"
            icon="edit"
            @click="modalAddUpOperador = true"
          >
            <!-- <q-badge floating>{{ countNovedades }}</q-badge> -->
            <q-tooltip
              style="background-color: #31d3ae; color: white"
              :offset="[10, 10]"
            >
              {{ "Modificar Operador" }}
            </q-tooltip>
          </q-btn>
          <!-- <q-btn class="q-ma-xs" color="tertiary" size="md"> </q-btn> -->
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
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
            @click="clickRow(props.row), (props.selected = !props.selected)"
            class="cursor-pointer"
          >
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'estado' || col.name == 'admi'">
                <q-badge v-if="col.value == true" color="green">
                  Activo
                </q-badge>
                <q-badge v-if="col.value == false" color="red">
                  Inactivo
                </q-badge>
              </div>

              <div v-else-if="col.name == 'created_at'">
                {{ formatDate(col.value) }}
              </div>
              <div v-else-if="col.name == 'concesion'">
                {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else>
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </TransitionGroup>
    <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>

  <!-- Modal de Add Persona de contacto -->
  <q-dialog
    v-model="modalAddUpOperador"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="max-width: 100%; width: 40%">
      <q-form autofocus @submit.prevent="updateCliente()">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            Modificar Cliente - {{ Fila.nombres }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    readonly
                    outlined
                    v-model="
                      concesion.filter((p) => p.id == Fila.concesion)[0].nombre
                    "
                    dense
                    type="text"
                    label="Concesion"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    readonly
                    outlined
                    v-model="Fila.nombres"
                    dense
                    type="text"
                    label="Nombres"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    readonly
                    dense
                    v-model="Fila.telefono"
                    :label="'Telefono'"
                    mask="(###) ### - ####"
                    unmasked-value
                    outlined
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    readonly
                    outlined
                    v-model="Fila.correo"
                    dense
                    type="email"
                    label="Correo"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <q-toggle
                    class="q-pa-md"
                    v-model="Fila.estado"
                    label="Estado"
                  />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <q-toggle
                    class="q-pa-md"
                    v-model="Fila.admi"
                    label="Administrador"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal q-pa-md">
          <q-btn
            class="q-mx-xl"
            color="primary"
            :label="'Actualizar'"
            type="submit"
            text-color="white"
            no-caps
          />
          <q-btn
            class="q-mx-xl"
            outline
            :label="'Cancelar'"
            v-close-popup
            text-color="dark"
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- Modal de confirmacion -->
  <q-dialog v-model="mostrarConfirm">
    <q-card style="width: 35em">
      <div class="column" style="margin: 20px">
        <div class="col-4" style="margin: auto; padding: 10px">
          <q-icon name="error_outline" size="6em" />
        </div>
        <div class="col-4" style="margin: auto; padding: 10px">
          <span style="font-size: 18px"> {{ mensaje }}</span>
        </div>
        <div class="col-2" style="margin: auto; padding: 10px">
          <q-btn class="q-mx-md" label="No" v-close-popup color="negative" />
          <q-btn
            class="q-mx-md"
            v-show="accion == 'alerta'"
            label="Cerrar"
            color="grey"
            v-close-popup
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
/*eslint-disable */
import { defineComponent, ref, onMounted } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "boot/axios";
import { mostrarMensajes, getSelectedString } from "boot/global";
import { supabase } from "src/supabase";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
//supabase
let $q = useQuasar();
const idusuario = LocalStorage.getItem("IdUsuario");
const selected = ref([]);
const store = useMainStore();
const configStore = useConfigStore();
const tiquetes = ref([]);
const concesion = ref({});
const peajes = ref([]);
const cliente = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const Prioridades = ref([]);
const solicitudes = ref([]);
const metodoconsulta = ref([]);
const visible = ref(false);
const pagination = ref({
  rowsPerPage: 8,
});
const modalAddUpOperador = ref(false);
const mostrarConfirm = ref(false);
const accion = ref("");
const mensaje = ref("");
const Fila = ref({});
const tableRef = ref(null);
const table = ref(false);
const selectRule = [(value) => !!value || "Este campo es obligatorio"];
const inputRules = [
  (val) => (val && val.length > 0) || "Por favor llenar el campo",
];
const columns = [
  {
    name: "id",
    required: false,
    label: "Id",
    align: "center",
    field: "id",
    sortable: true,
    // format: (val, row) => `${val}%`,
  },
  {
    name: "created_at",
    align: "center",
    label: "Creacion",
    field: "created_at",
    sortable: true,
  },
  {
    name: "concesion",
    align: "left",
    label: "Concesion",
    field: "concesion",
    sortable: true,
  },
  {
    name: "nombres",
    align: "left",
    label: "Nombres",
    field: "nombres",
    sortable: true,
  },

  {
    name: "admi",
    align: "center",
    label: "Administrador",
    field: "admi",
    sortable: true,
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "telefono",
    align: "right",
    label: "Telefono",
    field: "telefono",
    sortable: true,
  },
  {
    name: "correo",
    align: "left",
    label: "Correo",
    field: "correo",
    sortable: true,
  },
];
// -------------------------------------------------------
// Metodos
const clickRow = (row) => {
  Fila.value = row;
};
const updateCliente = async () => {
  console.log(Fila.value);
  visible.value = true;
  modalAddUpOperador.value = false;
  await api
    .put(`cliente?id=eq.${Fila.value.id}`, Fila.value)
    .then((response) => {
      $q.notify({
        type: "positive",
        message: "Cliente Actualizado Correctamente",
      });
      visible.value = false;
    });
};

const loadData = async () => {
  visible.value = true;
  await api.get("cliente?select=*").then((response) => {
    cliente.value = response.data;
  });

  await api.get("concesion?select=*").then((response) => {
    concesion.value = response.data;
  });

  await api.get("peaje?select=*").then((response) => {
    peajes.value = response.data;
  });

  await api.get("tipo?select=*").then((response) => {
    Tipos.value = response.data;
  });

  await api.get("subtipo?select=*").then((response) => {
    Subtipos.value = response.data;
  });

  await api.get("prioridad?select=*").then((response) => {
    Prioridades.value = response.data;
  });
  await api.get("solicitud?select=*").then((response) => {
    solicitudes.value = response.data;
  });

  await api.get("metodoconsulta?select=*").then((response) => {
    metodoconsulta.value = response.data;
  });

  visible.value = false;
  table.value = true;
};
// -------------------------------------------------------
// Funciones generales
//-------------------------------------------------------
const formatDate = (value) => {
  const date = new Date(value);
  // return date.toLocaleDateString();  // solo la fecha DD/MM/YY
  return date.toLocaleString(); // DD/MM/YY, 00:00:00
};
const sortBy = ref("id");
const sortDesc = ref(true);
function customSort() {
  tiquetes.value.sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];

    if (aValue < bValue) {
      return sortDesc.value ? 1 : -1;
    }
    if (aValue > bValue) {
      return sortDesc.value ? -1 : 1;
    }
    return 0;
  });
}
customSort();

onMounted(async () => {
  await loadData();
});

defineComponent({
  name: "MainTable",
});

//----------------Subscripcion a la tabla tiquetes--------------------------
supabase
  .channel("custom-insert-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "contactos" },
    (payload) => {
      loadData();
    }
  )
  .subscribe();

// ------------------------------------------
</script>

<style lang="scss">
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

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Ajusta la altura según tus necesidades */
}

.centered-button {
  /* Agrega estilos adicionales si lo deseas */
}

.FileSelected .q-field__native {
  display: none;
}

.containerDashboard {
  width: 100%; /* Ancho completo de la pantalla */
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  // height: 100vh; /* Altura completa de la pantalla (viewport) */
}
.container2 {
  display: flex;
  justify-content: left;
  align-items: left;
  height: 100vh;
  /* Ajusta la altura según tus necesidades */
}
</style>
