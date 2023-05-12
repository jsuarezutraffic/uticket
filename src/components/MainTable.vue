<template>
  <div class="q-pa-md flex">
    <TransitionGroup name="fade">
      <q-table
        class="table-container"
        separator="horizontal"
        flat
        bordered
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
        <template v-slot:top>
          <!-- <q-btn color="secondary" size="md" @click="Atras()"
            >Mis Tickets
            <q-tooltip class="bg-primary" :offset="[10, 10]">
            {{ $t("Atras") }}
          </q-tooltip>
          </q-btn> -->
          <q-btn
            class="q-ma-xs"
            color="secondary"
            size="md"
            @click="mostrarModal = true"
            >Agregar Ticket
            <!-- <q-tooltip class="bg-primary" :offset="[10, 10]">
            {{ $t("Atras") }}
          </q-tooltip> -->
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
          <q-tr :props="props" @click="props.selected = !props.selected">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
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

  <q-dialog
    v-model="mostrarModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 600px; max-width: 100%">
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
            style="height: 500px; width: 600px; max-width: 100%"
          >
            <q-card flat>
              <div class="q-pa-md">
                <q-card>
                  <q-form @submit.prevent="actualizarPerfil()" id="form">
                    <div class="row">
                      <div class="col-12">
                        <div class="row" style="background: #ffffff">
                          <div class="col-md-12">
                            <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              label="Peaje"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-6">
                            <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              label="Concesion"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-6">
                            <q-select
                              label="Tipo"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="model"
                              dense
                              :options="[
                                'Google',
                                'Facebook',
                                'Twitter',
                                'Apple',
                                'Oracle',
                              ]"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-12">
                            <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              type="textarea"
                              label="Problema"
                              class="q-pa-md"
                            />
                          </div>

                          <div class="col-md-12">
                            <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              type="text"
                              label="Observaciones"
                              class="q-pa-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-12" style="display: flex">
                        <q-btn
                          label="Agregar Ticket"
                          style="margin-left: auto; margin-right: auto"
                          color="primary"
                          class="q-ma-md"
                          no-caps
                          @click="ReenviarIntermediador()"
                        />
                      </div>
                    </div>
                  </q-form>
                </q-card>
              </div>
            </q-card>
          </q-scroll-area>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
// import { supabase } from "../supabase";
import { LocalStorage } from "quasar";
// import { columns, seed } from 'src/assets/js/tableModule'
import { createClient } from "@supabase/supabase-js";
import { api } from "boot/axios";

// console.log(
//   JSON.parse(LocalStorage.getItem("sb-xzovknjkdfykvximpgxh-auth-token"))
//     .access_token
// );

// LocalStorage.getItem("Token");

// const supabase = createClient(
//   "https://xzovknjkdfykvximpgxh.supabase.co",
//   JSON.parse(LocalStorage.getItem("sb-xzovknjkdfykvximpgxh-auth-token"))
//     .access_token
// );

const selected = ref([]);
// const seedSize = seed.length;

const rows = ref([]);

const columns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "created_at",
    align: "left",
    label: "Creacion",
    field: "created_at",
    sortable: true,
  },
  {
    name: "numero",
    align: "left",
    label: "Número",
    field: "numero",
    sortable: true,
  },
  {
    name: "cliente",
    align: "left",
    label: "Cliente",
    field: "cliente",
    sortable: true,
  },

  {
    name: "concesion",
    align: "left",
    label: "Conceción",
    field: "concesion",
    sortable: true,
  },

  {
    name: "peaje",
    align: "left",
    label: "Peaje",
    field: "peaje",
    sortable: true,
  },

  {
    name: "requerimiento",
    align: "left",
    label: "Requerimiento",
    field: "requerimiento",
    sortable: true,
  },
  {
    name: "observaciones",
    align: "left",
    label: "Observaciones",
    field: "observaciones",
    sortable: true,
  },

  {
    name: "estado",
    align: "left",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "privado",
    align: "left",
    label: "Privado",
    field: "privado",
    sortable: true,
  },
  {
    name: "prioridad",
    align: "left",
    label: "Prioridad",
    field: "prioridad",
    sortable: true,
  },
  {
    name: "proceso",
    align: "left",
    label: "Proceso",
    field: "proceso",
    sortable: true,
  },

  {
    name: "tipo",
    align: "left",
    label: "Subtipo",
    field: "tipo",
    sortable: true,
  },
  {
    name: "subtipo",
    align: "left",
    label: "Subtipo",
    field: "subtipo",
    sortable: true,
  },
  {
    name: "asignado",
    align: "left",
    label: "Asignado",
    field: "asignado",
    sortable: true,
  },
];

const loadData = async () => {
  // const { data, error } = await supabase.from("concesion").select();

  // let { data: concesion, error } = await supabase.from("concesion").select("*");

  api.get("tiquete?select=*").then((response) => {
    console.log(response);
    rows.value = response.data;
  });

  // supabase
  //   .from("tiquete")
  //   .select("*")
  //   .then((data) => {
  //     console.log(data);
  //     rows.value = data.data;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     // $q.notify({
  //     //   type: "negative",
  //     //   message: error.message,
  //     // });
  //     // loadingListado.value = false;
  //   });
  // console.log(concesion, error);
};

onMounted(() => {
  loadData();
});
// for (let i = 0; i < 2; i++) {
//   rows = rows.concat(
//     seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 }))
//   );
// }

const mostrarModal = ref(false);
const Fila = ref({});
const tableRef = ref(null);
const expanded = ref([]);

onMounted(() => {
  tableRef.value.scrollTo(10);
});

defineComponent({
  name: "MainTable",
});
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
