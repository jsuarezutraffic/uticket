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
        :rows="users"
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
          'nombre',
          'estado',
          'correo',
          'nivel',
          'telefono',
          'created_at',
        ]"
        rows-per-page-label="Registro por página"
        loading-label="Cargando..."
        no-data-label="No existen datos para mostrar"
      >
        <template v-slot:top>
          <div style="font-weight: bold" class="q-table__title">Operador</div>
          <q-space />
          <q-btn
            class="q-mr-sm"
            color="tertiary"
            round
            icon="add"
            @click="
              Fila = {};
              modalAddUpOperador = true;
              accion = 'Agregar';
            "
          >
            <q-tooltip
              style="background-color: #31d3ae; color: white"
              :offset="[10, 10]"
            >
              {{ "Agregar Operador" }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-show="selected.length > 0"
            class="q-mr-sm"
            round
            color="tertiary"
            icon="edit"
            @click="
              modalAddUpOperador = true;
              accion = 'Modificar';
            "
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
              <div v-if="col.name == 'estado'">
                <q-badge
                  :color="Estados.filter((p) => p.orden == col.value)[0].color"
                >
                  {{
                    Estados.filter((p) => p.orden == col.value)[0].descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'nivel'">
                {{
                  Procesos.filter((p) => p.orden == col.value)[0].descripcion
                }}
              </div>
              <div v-else-if="col.name == 'created_at'">
                {{ formatDate(col.value) }}
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
      <q-form autofocus @submit.prevent="addUpdateOperador()">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            {{ accion }} Operador
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    :rules="inputRules"
                    outlined
                    v-model="Fila.nombre"
                    dense
                    type="text"
                    label="Nombres"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
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
                    outlined
                    v-model="Fila.correo"
                    dense
                    type="email"
                    label="Correo"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-select
                    :rules="selectRule"
                    label="Proceso"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="Fila.nivel"
                    dense
                    :options="Procesos"
                    option-label="descripcion"
                    option-value="orden"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal q-pr-md">
          <q-btn
            flat
            color="primary"
            :label="'Aceptar'"
            type="submit"
            text-color="dark"
            no-caps
          />
          <q-btn
            flat
            :label="'Cerrar'"
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
          <q-btn
            class="q-mx-md"
            v-if="accion == 'CerrarTicket'"
            label="No"
            v-close-popup
            color="negative"
          />
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
import { useQuasar } from "quasar";
import { supabase } from "src/supabase";
import { useMainStore } from "src/stores/main";
import {
  getUsuarios,
  postUsuarios,
  putUsuarios,
} from "../services/services.js";
//supabase
let $q = useQuasar();
const selected = ref([]);
const store = useMainStore();
const users = ref([]);
const Estados = ref(store.generalData.estado);
const Procesos = ref(store.generalData.proceso);
const tiquetes = ref([]);
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
const table = ref(true);
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
    name: "nombre",
    align: "left",
    label: "Nombre",
    field: "nombre",
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
    name: "nivel",
    align: "center",
    label: "Nivel",
    field: "nivel",
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
    align: "right",
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
const addUpdateOperador = async () => {
  // visible.value = true;
  modalAddUpOperador.value = false;
  if (accion.value == "Modificar") {
    await putUsuarios(`id=eq.${Fila.value.id}`, Fila.value).then((response) => {
      $q.notify({
        type: "positive",
        message: "Operador Actualizado Correctamente",
      });
      visible.value = false;
    });
  } else if (accion.value == "Agregar") {
    await postUsuarios(Fila.value).then((response) => {
      $q.notify({
        type: "positive",
        message: "Operador Agregado Correctamente",
      });
      visible.value = false;
    });
  }
};

const LoadData = async () => {
  await getUsuarios("").then((response) => {
    users.value = response.data;
  });
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
  LoadData();
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
      DatosGenerales();
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
