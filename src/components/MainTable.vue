<template>
  <div class="q-pa-md flex">
    <TransitionGroup>
      <div class="container">
        <q-card
          class="q-my-md q-mr-md row justify-evenly"
          v-if="table && countArrayEstado.length > 0"
        >
          <apex-donut
            :Series="countArrayEstado"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Estados"
            width="320"
          />

          <apex-donut
            :Series="countArrayPrioridad"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Prioridades"
            width="320"
          />

          <apex-donut
            :Series="countArraySolicitud"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Solicitudes"
            width="320"
          />

          <apex-donut
            :Series="countArrayTipo"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Tipos"
            width="320"
          />
        </q-card>
      </div>
      <q-table
        v-if="table"
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
        v-model:pagination="pagination"
        fixed-header
        v-model:expanded="expanded"
        :visible-columns="[
          'created_at',
          'cliente',
          'concesion',
          'peaje',
          'solicitud',
          'observaciones',
          'estado',
          'prioridad',
          'tipo',
          'subtipo',
          'finalizar',
        ]"
      >
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
            >Nuevo Ticket
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
              <div v-if="col.name == 'cliente'">
                {{ cliente.filter((p) => p.id == col.value)[0].nombres }}
              </div>
              <div v-else-if="col.name == 'concesion'">
                {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'peaje'">
                {{ peajes.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'solicitud'">
                {{ Solicitudes.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'estado'">
                <div
                  v-if="Estados.filter((p) => p.id == col.value)[0].vercliente"
                >
                  <q-badge
                    :color="Estados.filter((p) => p.id == col.value)[0].color"
                  >
                    {{
                      Estados.filter((p) => p.id == col.value)[0].descripcion
                    }}
                  </q-badge>
                </div>
                <div v-else>
                  <q-badge color="red"> Iniciado </q-badge>
                </div>
              </div>
              <div v-else-if="col.name == 'prioridad'">
                <q-badge
                  :color="Prioridades.filter((p) => p.id == col.value)[0].color"
                >
                  {{
                    Prioridades.filter((p) => p.id == col.value)[0].descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'tipo'">
                {{ Tipos.filter((p) => p.id == col.value)[0].descripcion }}
              </div>
              <div v-else-if="col.name == 'subtipo'">
                {{ Subtipos.filter((p) => p.id == col.value)[0].descripcion }}
              </div>
              <div v-else-if="col.name == 'finalizar'">
                <q-btn
                  class="q-px-sm"
                  color="primary"
                  size="sm"
                  no-caps
                  dense
                  @click="(FilaFinalizar = props.row), (mostrarConfirm = true)"
                  >Finalizar
                  <!-- <q-tooltip class="bg-primary" :offset="[10, 10]">
            {{ $t("Atras") }}
          </q-tooltip> -->
                </q-btn>
              </div>

              <div v-else-if="col.name == 'observaciones'">
                <div v-if="col.value == null">
                  {{ col.value }}
                </div>
                <div v-else>
                  <div
                    v-html="col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')"
                  ></div>
                </div>
              </div>

              <div v-else>
                {{ col.value }}
              </div>
              <!-- {{ col.value }} -->
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- <q-card class="q-my-md q-mr-md row justify-evenly" v-if="table">

      </q-card>

      <q-card class="q-my-md q-mr-md row justify-evenly" v-if="table">

      </q-card>

      <q-card class="q-my-md q-mr-md row justify-evenly" v-if="table">

      </q-card> -->

      <!-- <q-card class="table-card" v-if="false">
        <q-card-section>
          {{ selected[0] }}
        </q-card-section>
      </q-card> -->
    </TransitionGroup>
    <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
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
                  <q-form @submit.prevent="AgregarTicket()" id="form">
                    <div class="row">
                      <div class="col-12">
                        <div class="row" style="background: #ffffff">
                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <q-input
                              outlined
                              v-model="concesion[0].nombre"
                              dense
                              label="Concesion"
                              class="q-pa-md"
                              readonly
                            />
                          </div>

                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <!-- <q-input
                              outlined
                              v-model="Fila.adoperadorcodigo"
                              dense
                              label="Peaje"
                              class="q-pa-md"
                            /> -->

                            <q-select
                              outlined
                              v-model="Fila.peaje"
                              :options="peajes"
                              option-label="nombre"
                              option-value="id"
                              label="Peaje"
                              dense
                              class="q-pa-md"
                              emit-value
                              :rules="rules"
                              lazy-rules
                              map-options
                            ></q-select>
                          </div>

                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
                              label="Solicitud"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.solicitud"
                              dense
                              :options="Solicitudes"
                              option-label="nombre"
                              option-value="id"
                              class="q-pa-md"
                              emit-value
                              map-options
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
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
                              @update:model-value="TipoSeleccion"
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
                              label="SubTipo"
                              transition-show="scale"
                              transition-hide="scale"
                              outlined
                              v-model="Fila.subtipo"
                              dense
                              :options="SubtipoOptions"
                              option-label="descripcion"
                              option-value="id"
                              class="q-pa-md"
                              emit-value
                              map-options
                              hint="Debe seleccionar un Tipo"
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <div v-if="false" class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
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
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <div v-if="false" class="col-md-4 col-sm-6 col-xs-12">
                            <q-select
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
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <!-- <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-btn
                              label="Cargar Evidencia"
                              style="color: white"
                              class="q-ma-md bg-primary"
                              no-caps
                              @click="openFile()"
                            >
                              <q-file
                                class="q-ma-"
                                no-caps
                                label="Cargar Evidencia"
                                borderless
                                dense
                                v-model="filaavatar"
                                label-color="white"
                                style="background-color: white; width: 100%"
                                v-show="false"
                                ref="file"
                              ></q-file>
                            </q-btn>


                          </div> -->

                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <q-input
                              outlined
                              v-model="Fila.observaciones"
                              dense
                              type="textarea"
                              label="Observaciones"
                              class="q-pa-md"
                              :rules="rules"
                              lazy-rules
                            />
                          </div>

                          <div class="col-md-12 col-sm-12 col-xs-12">
                            <FileInput
                              @datos-exportado-cambiado="
                                actualizarValorDatosExportado
                              "
                            ></FileInput>
                          </div>

                          <!-- <div
                            class="col-md-4 col-sm-12 col-xs-12 avatar-container"
                          >
                            <q-avatar
                              square
                              font-size="82px"
                              color="white"
                              class="avatar"
                            >
                              <q-img
                                :src="Fila.evidencia"
                                alt=""
                                spinner-color="red"
                                fit="scale-down"
                                class="avatar"
                              >
                              </q-img>
                            </q-avatar>
                          </div> -->

                          <div v-if="false" class="col-md-6 col-sm-6 col-xs-12">
                            <q-select
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

                    <div class="row">
                      <div class="col-12" style="display: flex">
                        <q-btn
                          label="Agregar Ticket"
                          style="margin-left: auto; margin-right: auto"
                          color="primary"
                          class="q-ma-md"
                          no-caps
                          type="submit"
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

  <q-dialog v-model="mostrarConfirm">
    <q-card style="width: 35em">
      <div class="column" style="margin: 20px">
        <div class="col-4" style="margin: auto; padding: 10px">
          <q-icon name="error_outline" size="6em" />
        </div>
        <div class="col-4" style="margin: auto; padding: 10px">
          <span style="font-size: 18px">
            ¿Esta seguro de Finalizar el Ticket?</span
          >
        </div>
        <div class="col-2" style="margin: auto; padding: 10px">
          <q-btn label="No" v-close-popup color="negative" />
          <span style="padding-right: 40px"></span>
          <q-btn label="Si" color="primary" @click="Finalizar()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
  <!-- <button @click="enviarCorreo">Enviar Correo</button> -->
  <!-- <div class="q-ma-md">
    <q-uploader
      ref="uploader"
      label="Seleccionar archivo de audio"
      accept=".mp3"
      @added="handleFileAdded"
      :auto-upload="false"
      :upload-factory="uploadFactory"
    >
      <template v-slot:meta="{ file }">
        <div class="q-pa-sm">
          {{ file.name }}
        </div>
      </template>
    </q-uploader>
    <q-btn label="Subir" @click="uploadAudio" />
  </div> -->
</template>

<script setup>
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  watchEffect,
  computed,
} from "vue";
import { supabase } from "../supabase";
import { LocalStorage, date } from "quasar";
// import { columns, seed } from 'src/assets/js/tableModule'
import { createClient } from "@supabase/supabase-js";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { createBase64Image } from "boot/global";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import FileInput from "src/components/FileImage.vue";
// import nodemailer from "nodemailer";
// import { sgMail } from "@sendgrid/mail";

// sgMail.setApiKey(
//   "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"
// );

// console.log(
//   JSON.parse(LocalStorage.getItem("sb-xzovknjkdfykvximpgxh-auth-token"))
//     .access_token
// );

const idusuario = LocalStorage.getItem("IdUsuario");
const email = LocalStorage.getItem("email");
let $q = useQuasar();

const valorDatosExportado = ref("");
function actualizarValorDatosExportado(nuevoValor) {
  valorDatosExportado.value = nuevoValor;
  // FilaDetalle.value.evidencia = valorDatosExportado.value;
}

// const supabase = createClient(
//   "https://xzovknjkdfykvximpgxh.supabase.co",
//   JSON.parse(LocalStorage.getItem("sb-xzovknjkdfykvximpgxh-auth-token"))
//     .access_token
// );

const selected = ref([]);
// const seedSize = seed.length;
const pagination = ref({
  rowsPerPage: 10,
});

const tiquetes = ref([]);
const concesion = ref([]);
const peajes = ref([]);
const cliente = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const SubtipoOptions = ref([]);
const Prioridades = ref([]);
const Estados = ref([]);
const Procesos = ref([]);
const Solicitudes = ref([]);
const Usuarios = ref([]);

const mostrarModal = ref(false);
const mostrarConfirm = ref(false);
const Fila = ref({});
const FilaFinalizar = ref({});
const tableRef = ref(null);
const expanded = ref([]);
const rules = [(val) => !!val || "* Campo Obligatorio"];
const table = ref(false);
const visible = ref(false);
const countArrayEstado = ref([]);
const countArrayPrioridad = ref([]);
const countArrayTipo = ref([]);
const countArraySolicitud = ref([]);

const columns = [
  {
    name: "id",
    // required: true,
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
    format: (val) => `${date.formatDate(val, "DD/MM/YYYY HH:mm:ss")}`,
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
    label: "Concesión",
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
    name: "solicitud",
    align: "left",
    label: "Solicitud",
    field: "solicitud",
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
    label: "Tipo",
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
  {
    name: "finalizar",
    align: "left",
    label: "",
    field: "finalizar",
    sortable: true,
  },
];

const loadData = async () => {
  api
    .get("tiquete?cliente=eq." + cliente.value[0].id + "&select=*")
    .then((response) => {
      tiquetes.value = response.data;
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

const DatosGenerales = async () => {
  visible.value = true;
  await api
    .get(`cliente?usuario=eq.` + idusuario + `&select=*`)
    .then((response) => {
      // console.log("cliente: ", response.data);
      cliente.value = response.data;

      // console.log(cliente_idconcesion.value);
    });

  await api
    .get("concesion?id=eq." + cliente.value[0].concesion + "&select=*")
    .then((response) => {
      // console.log("consecion: ", response.data);
      concesion.value = response.data;
    });

  await api
    .get("peaje?concesion=eq." + concesion.value[0].id + "&select=*")
    .then((response) => {
      // console.log("peajes: ", response.data);
      peajes.value = response.data;
    });

  await api.get("tipo?select=*").then((response) => {
    // console.log("tipos: ", response.data);
    Tipos.value = response.data;
  });

  await api.get("subtipo?select=*").then((response) => {
    // console.log("Subtipos: ", response.data);
    Subtipos.value = response.data;
  });

  await api.get("prioridad?select=*").then((response) => {
    // console.log("Prioridades: ", response.data);
    Prioridades.value = response.data;
    Prioridades.value.sort(function (b, a) {
      return b.orden - a.orden;
    });
  });

  await api.get("estado?select=*").then((response) => {
    // console.log("Estados: ", response.data);
    Estados.value = response.data;
  });

  await api.get("solicitud?select=*").then((response) => {
    // console.log("Solicitudes: ", response.data);
    Solicitudes.value = response.data;
  });

  await api.get("proceso?select=*").then((response) => {
    // console.log("Procesos: ", response.data);
    Procesos.value = response.data;
    table.value = true;
    visible.value = false;
  });

  await api.get("usuarios?select=*").then((response) => {
    // console.log("usuarios: ", response.data);
    Usuarios.value = response.data;
  });

  // Fila.value.asignado = "4ca6c4d3-c2f9-4c1f-9411-de9271b9519f";

  // const array = [5, 2, 9, 1, 3];
  // array.sort(function (a, b) {
  //   return b - a;
  // });

  // console.log(array);
};

const TipoSeleccion = (value) => {
  SubtipoOptions.value = Subtipos.value.filter((tipo) => tipo.tipo == value);
  Fila.value.subtipo = null;
  // console.log(SubtipoOptions.value);
};

const AgregarTicket = async () => {
  // console.log(Fila.value);
  // enviarCorreo(Fila.value);
  Fila.value.cliente = cliente.value[0].id;
  Fila.value.concesion = concesion.value[0].id;
  Fila.value.asignado = Usuarios.value.filter(
    (p) => p.nivel == 1 && p.estado == true
  )[0].id;
  Fila.value.privado = null;
  Fila.value.proceso = 1;
  Fila.value.estado = 1;
  Fila.value.evidencia = valorDatosExportado.value;

  if (Fila.value.solicitud == 1 || Fila.value.solicitud == 3) {
    Fila.value.prioridad = 1;
  } else if (Fila.value.solicitud == 2) {
    Fila.value.prioridad = 2;
  } else {
    Fila.value.prioridad = 3;
  }
  // enviarCorreo(Fila.value);
  api
    .post("tiquete", Fila.value)
    .then((response) => {
      // console.log("Solicitud exitosa:", response);
      loadData();
      mostrarModal.value = false;

      if (response.status == 201 || response.status == 200) {
        $q.notify({
          type: "positive",
          message: "Ticket Creado exitosamente",
          timeout: 4000,
        });
        Fila.value.estado = "Creado";
        Fila.value.mensaje1 =
          "La solicitud sera atendida por el equipo de soporte de";
        Fila.value.mensaje2 =
          "Sera informado por este medio y el aplicativo cuando se solucione la problematica.";
        enviarCorreo(Fila.value);
      }
    })
    .catch((error) => {
      // Capturar el error y mostrarlo al usuario
      if (error.response) {
        // Error de respuesta HTTP (por ejemplo, 404, 500, etc.)
        console.error("Error de respuesta:", error.response.status);
        console.error("Mensaje de error:", error.response.data);
      } else if (error.request) {
        // Error de solicitud sin respuesta (por ejemplo, timeout)
        console.error("Error de solicitud:", error.request);
      } else {
        // Error de configuración u otro tipo de error
        console.error("Error:", error.message);
      }
    });
};

const Finalizar = () => {
  mostrarConfirm.value = false;
  console.log("FINALIZAR: ", FilaFinalizar.value);

  if (FilaFinalizar.value.estado == 6) {
    $q.notify({
      type: "warning",
      message: "Ticket ya fue Finalizado",
      timeout: 4000,
    });
    return;
  }
  FilaFinalizar.value.estado = 6;
  api
    .put("tiquete?id=eq." + FilaFinalizar.value.id, FilaFinalizar.value)
    .then((response) => {
      console.log("Solicitud exitosa:", response);
      loadData();
      mostrarModal.value = false;
      Fila.value.estado = "Finalizado";
      Fila.value.mensaje1 =
        "La solicitud fue revisada y finalizada por el equipo de soporte de";
      Fila.value.mensaje2 = "";
      enviarCorreo(Fila.value);

      if (response.status == 201 || response.status == 200) {
        $q.notify({
          type: "positive",
          message: "Ticket Finalizado exitosamente",
          timeout: 4000,
        });
      }
    });
};

const openFile = () => {
  file.value.pickFiles();
};

function clearImage(value) {
  filaavatar.value = "";
  Fila.value.avatar = avatarold.value;
}

const filaavatar = ref("");
const avatarold = ref("");
const loadingImage = ref(false);
const file = ref(null);

async function convertirBase64() {
  // loadingImage.value = true;
  avatarold.value = Fila.value.evidencia;
  if (filaavatar.value != null) {
    Fila.value.evidencia = await createBase64Image(filaavatar.value);
  }
  // loadingImage.value = false;
}

const enviarCorreo = (data) => {
  data.email = email;
  Fila.value = {};

  // var data = { correo: "jsuarez@utraffic.co", nombre: "hola" };

  const axios = require("axios");

  const url = "http://localhost:3000/enviar-correo";

  axios
    .post(url, data)
    .then((response) => {
      console.log(response.data); // Maneja la respuesta de la petición aquí
    })
    .catch((error) => {
      console.error(error);
    });
};

watch(filaavatar, (currentValue, oldValue) => {
  convertirBase64();
});

watchEffect(() => {
  {
    const countByEstado = {};
    const countByPrioridad = {};
    const countByTipo = {};
    const countBySolicitud = {};

    // Contar la cantidad de objetos por estado
    tiquetes.value.forEach((obj) => {
      const estado = obj.estado;
      const prioridad = obj.prioridad;
      const tipo = obj.tipo;
      const solicitud = obj.solicitud;

      let label;
      let labelPrioridad;
      let labelTipo;
      let labelSolicitud;

      switch (estado) {
        case 1:
          label = "Iniciado";
          break;
        case 5:
          label = "Cerrado";
          break;
        case 6:
          label = "Finalizado";
          break;
        default:
          label = "Estado interno";
          break;
      }

      switch (prioridad) {
        case 1:
          labelPrioridad = "Alta";
          break;
        case 2:
          labelPrioridad = "Media";
          break;
        case 3:
          labelPrioridad = "Baja";
          break;
      }

      switch (tipo) {
        case 1:
          labelTipo = "Dispositivos";
          break;
        case 2:
          labelTipo = "Software";
          break;
        case 3:
          labelTipo = "Red";
          break;
      }

      switch (solicitud) {
        case 1:
          labelSolicitud = "Incidentes";
          break;
        case 2:
          labelSolicitud = "Requerimiento";
          break;
        case 3:
          labelSolicitud = "PQR";
          break;
      }

      // if (estado === 1 || estado === 5 || estado === 6) {
      //   countByEstado[label] = {
      //     label: label,
      //     value: (countByEstado[label]?.value || 0) + 1,
      //   };

      //   countByEstadoarray.push({
      //     label: label,
      //     value: (countByEstado[label]?.value || 0) + 1,
      //   });
      // } else {
      //   countByEstado[label] = {
      //     label: label,
      //     value: (countByEstado.privado?.value || 0) + 1,
      //   };

      //   countByEstadoarray.push({
      //     label: label,
      //     value: (countByEstado.privado?.value || 0) + 1,
      //   });
      // }

      if (estado === 1 || estado === 5 || estado === 6) {
        if (!countByEstado[label]) {
          countByEstado[label] = {
            label: label,
            value: 1,
          };
        } else {
          countByEstado[label].value++;
        }
      } else {
        if (!countByEstado.privado) {
          countByEstado.privado = {
            label: "Estado Interno",
            value: 1,
          };
        } else {
          countByEstado.privado.value++;
        }
      }

      if (!countByPrioridad[labelPrioridad]) {
        countByPrioridad[labelPrioridad] = {
          label: labelPrioridad,
          value: 1,
        };
      } else {
        countByPrioridad[labelPrioridad].value++;
      }

      if (!countByTipo[labelTipo]) {
        countByTipo[labelTipo] = {
          label: labelTipo,
          value: 1,
        };
      } else {
        countByTipo[labelTipo].value++;
      }

      if (!countBySolicitud[labelSolicitud]) {
        countBySolicitud[labelSolicitud] = {
          label: labelSolicitud,
          value: 1,
        };
      } else {
        countBySolicitud[labelSolicitud].value++;
      }
    });

    // const filteredArray = computed(() => {
    //   return tiquetes.value.filter((item1) =>
    //     Prioridades.value.some((item2) => item2.id === item1.prioridad)
    //   );
    // });
    countArrayEstado.value = Object.values(countByEstado);
    countArrayPrioridad.value = Object.values(countByPrioridad);
    countArrayTipo.value = Object.values(countByTipo);
    countArraySolicitud.value = Object.values(countBySolicitud);
    console.log("countArraySolicitud: ", countArraySolicitud.value);
  }
});

onMounted(async () => {
  await DatosGenerales();
  loadData();

  // tableRef.value.scrollTo(10);
});
setInterval(() => {
  loadData();
}, 600000);

// for (let i = 0; i < 2; i++) {
//   rows = rows.concat(
//     seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 }))
//   );
// }

// onMounted(() => {
//   tableRef.value.scrollTo(10);
// });
async function establecerTiposMIME() {
  const allowedMimeTypes = ["audio/mpeg", "audio/mp3", "video/mp4"]; // Agrega los tipos MIME que deseas permitir

  try {
    await supabase.storage.updateBucket("AudioTicket", {
      allowed_mime_types: allowedMimeTypes,
    });
    console.log("Tipos MIME actualizados correctamente");
  } catch (error) {
    console.error("Error al actualizar los tipos MIME:", error.message);
  }
}

// Llama a la función para establecer los tipos MIME permitidos
// establecerTiposMIME();

const uploaderRef = ref(null);
const audioFile = ref(null);

async function uploadFactory(file) {
  const supabaseUrl = "https://your-supabase-url.supabase.co";
  const supabaseKey = "your-supabase-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.storage
    .from("nombre_del_bucket")
    .upload(file.name, file);

  if (error) {
    console.error("Error al cargar el archivo:", error.message);
  } else {
    console.log("Archivo cargado exitosamente:", data.Key);
  }
}

function handleFileAdded(file) {
  audioFile.value = file;
}

async function uploadAudio() {
  const uploader = uploaderRef.value;
  if (uploader && audioFile.value) {
    await uploader.upload();
  }
}
defineComponent({
  name: "MainTable",
});
</script>

<style lang="scss">
.avatar-container {
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  height: 200px; /* Ajusta la altura del contenedor según tus necesidades */
}

.avatar {
  width: 150px; /* Ajusta el tamaño del avatar según tus necesidades */
  height: 120px; /* Ajusta el tamaño del avatar según tus necesidades */
  border: 1px solid #8a8a8a; /* Ancho y color del borde */
}
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

.container {
  width: 100%; /* Ancho completo de la pantalla */
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  // height: 100vh; /* Altura completa de la pantalla (viewport) */
}
</style>
