<template>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-dark"
    label-style="font-size: 1.2em"
  />
  <div v-if="table">
    <div
      class="q-pa-md flex"
      v-if="
        usuarios.filter((p) => p.id == idusuario)[0].nivel === 2 ||
        usuarios.filter((p) => p.id == idusuario)[0].nivel === 4
      "
    >
      <TransitionGroup name="fade">
        <q-table
          v-if="table"
          key="table"
          class="table-container"
          separator="horizontal"
          flat
          bordered
          ref="tableRef"
          :rows="tiquete"
          :columns="columns"
          :table-colspan="6"
          row-key="id"
          selection="single"
          v-model:selected="selected"
          v-model:expanded="expanded"
          :sort-method="customSort()"
          :sort-method-props="{ sortBy, sortDesc }"
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
            <q-tr
              :props="props"
              @click="
                props.selected = !props.selected;
                clickRow(props.row);
              "
            >
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name == 'tipo'">
                  {{ tipo.filter((p) => p.id == col.value)[0].descripcion }}
                </div>

                <div v-else-if="col.name == 'created_at'">
                  {{ formatDate(col.value) }}
                </div>

                <div v-else-if="col.name == 'cliente'">
                  {{ cliente.filter((p) => p.id == col.value)[0].nombres }}
                </div>

                <div v-else-if="col.name == 'prioridad'">
                  {{
                    prioridad.filter((p) => p.id == col.value)[0].descripcion
                  }}
                </div>

                <div v-else-if="col.name == 'estado'">
                  {{ estado.filter((p) => p.id == col.value)[0].descripcion }}
                </div>

                <div v-else-if="col.name == 'concesion'">
                  {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'solicitud'">
                  {{ solicitud.filter((p) => p.id == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'peaje'">
                  {{ peaje.filter((p) => p.id == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'subtipo'">
                  {{ subtipo.filter((p) => p.id == col.value)[0].descripcion }}
                </div>

                <div v-else-if="col.name == 'creacion'">
                  {{ creacion.filter((p) => p.id == col.value)[0].created_at }}
                </div>

                <div v-else>
                  {{ col.value }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-card
          class="table-card"
          v-if="tablaDetalle && selected.length > 0"
          key="card"
        >
          <div class="q-pa-sm q-mt-xs box-order">
            <span
              class="text-h5 q-pa-md text-bold text-center text-uppercase title-card-style"
              >Detalles de ticket</span
            >
            <div class="row-class-state">
              <q-chip
                clickable
                @click="onClick"
                color="green"
                text-color="white"
                icon="fa-solid fa-bookmark"
                class="q-ml-md q-pa-md"
              >
                Estado: {{ estadoDisplay }}
              </q-chip>

              <q-chip
                clickable
                @click="onClick"
                :color="colorPrioridad"
                text-color="white"
                icon="info"
                class="q-ml-md q-pa-md"
              >
                Prioridad: {{ prioridadDisplay }}
              </q-chip>

              <q-chip
                clickable
                @click="onClick"
                :color="colorTipo"
                text-color="white"
                icon="fa-solid fa-tag"
                class="q-ml-md q-pa-md"
              >
                Tipo: {{ tipoDisplay }}
              </q-chip>

              <q-chip
                clickable
                label="Ver evidencias"
                @click="VerEvidencias(selected[0])"
                color="amber"
                text-color="white"
                icon="image"
                class="q-ml-md q-pa-md"
              >
              </q-chip>

              <q-chip
                clickable
                label="Ver Observaciones"
                @click="mostrarObservaciones = true"
                color="green-9"
                text-color="white"
                icon="textsms"
                class="q-ml-md q-pa-md"
              >
              </q-chip>
            </div>

            <div class="q-pa-md">
              <q-table
                v-if="detalleTiquete.length > 0 && tablaDetalle === true"
                key="table"
                class="table-container"
                separator="horizontal"
                flat
                bordered
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
                  <q-tr
                    :props="props"
                    @click="props.selected = !props.selected"
                  >
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name == 'operador'">
                        <div v-if="usuarios !== null">
                          {{
                            usuarios.filter((p) => p.id == col.value)[0].nombre
                          }}
                        </div>
                      </div>

                      <div v-else-if="col.name == 'created_at'">
                        {{ formatDate(col.value) }}
                      </div>

                      <div
                        v-else-if="
                          col.name == 'campomodificador' ||
                          col.name == 'valoranterior' ||
                          col.name == 'valornuevo'
                        "
                      >
                        <div v-if="col.value == null || col.value == ''">
                          {{ col.value }}
                        </div>
                        <div v-else>
                          <div
                            v-html="
                              col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')
                            "
                          ></div>
                        </div>
                      </div>
                      <div v-else-if="col.name == 'comentarios'">
                        <div v-if="col.value == null || col.value == ''">
                          {{ col.value }}
                        </div>
                        <div v-else>
                          <div
                            v-if="
                              expanded2[props.row.id] ||
                              props.row.comentarios.length <= 50
                            "
                          >
                            <div
                              v-html="
                                col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')
                              "
                            ></div>
                          </div>
                          <div v-if="props.row.comentarios.length > 50">
                            <a
                              v-if="
                                props.row.comentarios.length > 50 &&
                                !expanded[props.row.id]
                              "
                              href="#"
                              class="q-link text-primary"
                              @click="verMasComentario(props.row.id)"
                            >
                              {{ labelComentario }}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div v-else-if="col.name == 'verevidencia'">
                        <q-btn
                          label="Ver"
                          icon="image"
                          color="primary"
                          @click="VerEvidencias(props.row)"
                        />
                        <!-- <q-dialog v-model="dialog3" persistent>
                        <q-card style="min-width: 700px; height: 600px;">
                          <q-card-section class="row items-center">
                            <q-img :src="Fila.evidencia" spinner-color="white" class="q-pa-md" style="min-width: 600px; height: 500px;"/>
                          </q-card-section> -->
                        <!-- Notice v-close-popup -->
                        <!-- <q-card-actions align="right">
                            <q-btn flat label="Salir" color="primary" v-close-popup />
                          </q-card-actions>
                        </q-card>
                      </q-dialog> -->
                      </div>

                      <div v-else>{{ col.value }}</div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>

          <div class="q-pa-md button-gestionar">
            <q-btn
              label="Gestionar"
              color="primary"
              text-color="white"
              @click="dialog = true"
              :disable="
                estado.filter((p) => p.id == Fila.estado)[0].descripcion !==
                'Asignado'
              "
            />
            <q-dialog v-model="dialog">
              <q-card>
                <q-card-section>
                  <div class="q-pa-md" style="max-width: 500px">
                    <p class="text-subtitle2">Asignar estado:</p>
                    <q-select
                      square
                      filled
                      v-model="ticketState"
                      :options="optionState"
                      option-value="id"
                      option-label="descripcion"
                      label="Estado"
                      class="q-mb-xs"
                      :rules="selectRule"
                    />
                    <div>
                      <p class="text-subtitle2">Consulta realizada a:</p>
                      <div style="display: flex">
                        <q-select
                          label="Persona Consultada"
                          transition-show="scale"
                          transition-hide="scale"
                          filled
                          v-model="FilaDetalle.consultado"
                          square
                          :options="contactos"
                          option-label="nombres"
                          option-value="id"
                          input-debounce="0"
                          class="q-mb-md"
                          style="width: 250px"
                        />
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-items: center;
                            height: fit-content;
                          "
                          class="q-pl-sm q-pt-sm"
                        >
                          <q-btn
                            flat
                            round
                            color="primary"
                            icon="person_add"
                            @click="mostrarAddPersonaContacto = true"
                          />
                        </div>
                      </div>

                      <p class="text-subtitle2">Método de consulta</p>
                      <q-select
                        square
                        filled
                        v-model="FilaDetalle.metodoconsulta"
                        :options="metodoconsulta"
                        option-value="id"
                        option-label="descripcion"
                        label="Método"
                        class="q-mb-md"
                      />
                    </div>
                    <!-- <div class="text-subtitle2 q-mb-md">Observaciones:</div>
                    <q-input
                      v-model="FilaDetalle.comentarios"
                      filled
                      type="textarea"
                      :rules="inputRules"
                    /> -->
                    <InputTextJump
                      @text-con-salto-linea="actualizarTextExport"
                    ></InputTextJump>
                    <p class="text-subtitle2 q-mt-md">Adjuntar Evidencia:</p>
                  </div>
                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>
                </q-card-section>

                <q-card-section class="second-card buttons no-padding">
                  <q-btn
                    v-close-popup
                    label="Volver"
                    color="primary"
                    class="q-mr-md close-buttons"
                    text-color="white"
                  />
                  <q-btn
                    v-popup
                    label="Enviar"
                    color="primary"
                    class="q-mr-md"
                    text-color="white"
                    @click="dialog2 = true"
                    :disable="ticketState === null"
                  />

                  <q-dialog v-model="dialog2">
                    <q-card>
                      <q-card-section>
                        <div class="q-pa-md" style="max-width: 300px">
                          <p class="text-h5">¿Desea confirmar los cambios?</p>
                        </div>
                      </q-card-section>

                      <q-card-section class="second-card buttons no-padding">
                        <q-btn
                          v-close-popup="2"
                          label="Aceptar"
                          color="primary"
                          class="q-mr-md close-buttons"
                          text-color="white"
                          @click="gestionarTicket()"
                        />
                        <q-btn
                          v-close-popup
                          label="Cancelar"
                          color="negative"
                          class="q-mr-md close-buttons"
                          text-color="white"
                        />
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </q-card>
      </TransitionGroup>
    </div>
    <div v-if="usuarios.filter((p) => p.id == idusuario)[0].nivel === 3">
      <BackOffice />
    </div>
    <!-- Modal de imagen -->
    <q-dialog v-model="mostrarImagen">
      <VerImagenArray :datoProp="imagen"></VerImagenArray>
    </q-dialog>

    <!-- Modal de comentario -->
    <q-dialog
      v-model="mostrarObservaciones"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="max-width: 100%; width: 40%">
        <div class="col-md-12 col-sm-12 col-xs-12 q-pa-md">
          <q-editor
            min-height="5rem"
            label="Observaciones"
            class="q-pa-md"
            v-model="Fila.observaciones"
            :toolbar="false"
            readonly
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- Modal añadir persona a lista-->
    <q-dialog
      v-model="mostrarAddPersonaContacto"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="max-width: 100%; width: 40%">
        <q-form autofocus @submit.prevent="addPersonConsulta()">
          <q-card-section>
            <div style="font-size: 18px; font-weight: bold; align-self: center">
              Añadir a lista de contactos
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
                      v-model="FilaContacto.nombres"
                      dense
                      type="text"
                      label="Nombres"
                      class="q-pa-md"
                    />
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      outlined
                      v-model="FilaContacto.telefono"
                      dense
                      type="number"
                      label="Telefono"
                      class="q-pa-md"
                      :rules="[
                        (val) =>
                          val.length <= 10 || 'Please use maximum 3 characters',
                      ]"
                    />
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      outlined
                      v-model="FilaContacto.correo"
                      dense
                      type="email"
                      label="Correo"
                      class="q-pa-md"
                    />
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      outlined
                      v-model="FilaContacto.area"
                      dense
                      type="text"
                      label="Area"
                      class="q-pa-md"
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
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { api } from "boot/axios";
import { LocalStorage, useQuasar } from "quasar";
import FileInput from "src/components/FileImage.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import BackOffice from "../pages/GestionarTiquete.vue";
import { supabase } from "src/supabase";

const $q = useQuasar();
const imagen = ref("");
const metodoconsulta = ref([]);
const methodState = ref(null);
const dialog2 = ref(false);
const dialog = ref(false);
const selected = ref([]);
const detalleTiquete = ref([]);
const tableRef = ref(null);
const expanded = ref([]);
const tiquete = ref([]);
const tipo = ref([]);
const concesion = ref([]);
const tipoDisplay = ref("");
const colorTipo = ref("");
const cliente = ref([]);
const prioridad = ref([]);
const solicitud = ref([]);
const prioridadDisplay = ref("");
const colorPrioridad = ref("");
const estado = ref([]);
const colorEstado = ref("");
const estadoDisplay = ref("");
const peaje = ref([]);
const subtipo = ref([]);
const creacion = ref([]);
const usuarios = ref([]);
const tablaDetalle = ref(false);
const idusuario = LocalStorage.getItem("IdUsuario");
const optionState = ref([]);
const mostrarImagen = ref(false);
const mostrarObservaciones = ref(false);
const visible = ref(false);
const ticketState = ref(null);
const table = ref(false);
const Fila = ref({});
const FilaDetalle = ref({});
const FilaContacto = ref({});
const mostrarAddPersonaContacto = ref(false);
const contactos = ref([]);

const columns = [
  {
    name: "id",
    label: "# Ticket",
    align: "center",
    field: "id",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Creacion",
    align: "center",
    field: "created_at",
    sortable: true,
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "center",
    field: "cliente",
    sortable: true,
  },
  {
    name: "concesion",
    label: "Concesion",
    align: "center",
    field: "concesion",
    sortable: true,
  },
  {
    name: "solicitud",
    label: "Tipo de solicitud",
    align: "center",
    field: "solicitud",
    sortable: true,
  },
  {
    name: "peaje",
    label: "Peaje",
    align: "center",
    field: "peaje",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
    sortable: true,
  },
  {
    name: "prioridad",
    label: "Prioridad",
    align: "center",
    field: "prioridad",
    sortable: true,
  },
  {
    name: "tipo",
    label: "Tipo",
    align: "center",
    field: "tipo",
    sortable: true,
  },
  {
    name: "subtipo",
    label: "Subtipo",
    align: "center",
    field: "subtipo",
    sortable: true,
  },
];
const historial = [
  // {
  //   name: "id",
  //   label: "Reference No.",
  //   align: "center",
  //   field: "id",
  //   sortable: true,
  // },
  {
    name: "created_at",
    label: "Creacion",
    align: "center",
    field: "created_at",
    sortable: true,
  },
  {
    name: "operador",
    label: "Operador",
    align: "center",
    field: "operador",
    sortable: true,
  },
  {
    name: "comentarios",
    label: "Comentarios",
    align: "center",
    field: "comentarios",
    sortable: true,
  },
  {
    name: "campomodificador",
    label: "Campo modificado",
    align: "center",
    field: "campomodificador",
    sortable: true,
  },
  {
    name: "valoranterior",
    label: "Valor Anterior",
    align: "center",
    field: "valoranterior",
    sortable: true,
  },
  {
    name: "valornuevo",
    label: "Valor Nuevo",
    align: "center",
    field: "valornuevo",
    sortable: true,
  },
  {
    name: "verevidencia",
    label: "Ver Evidencia",
    align: "center",
    field: "verevidencia",
    sortable: true,
  },
];

const inputRules = [
  (val) => (val && val.length > 0) || "Por favor llenar el campo",
];

const selectRule = [(value) => !!value || "Este campo es obligatorio"];

const valorDatosExportado = ref("");
function actualizarValorDatosExportado(nuevoValor) {
  valorDatosExportado.value = nuevoValor;
}

const textSaltoLinea = ref("");
function actualizarTextExport(nuevoValor) {
  textSaltoLinea.value = nuevoValor;
}
async function getData() {
  visible.value = true;
  await api
    .get(`tiquete?asignado=eq.${idusuario}&select=*`)
    .then((response) => {
      tiquete.value = response.data;
    });

  await api.get("tipo?select=*").then((response) => {
    tipo.value = response.data;
  });

  await api.get("prioridad?select=*").then((response) => {
    prioridad.value = response.data;
  });

  await api.get("estado?select=*").then((response) => {
    estado.value = response.data;
  });

  await api.get("cliente?select=*").then((response) => {
    cliente.value = response.data;
  });

  await api.get("concesion?select=*").then((response) => {
    concesion.value = response.data;
  });

  await api.get("solicitud?select=*").then((response) => {
    solicitud.value = response.data;
  });

  await api.get("peaje?select=*").then((response) => {
    peaje.value = response.data;
  });

  await api.get("subtipo?select=*").then((response) => {
    subtipo.value = response.data;
  });

  await api.get("metodoconsulta?select=*").then((response) => {
    metodoconsulta.value = response.data;
  });

  await api.get("tiquete?select=created_at").then((response) => {
    creacion.value = response.data;
  });

  await api.get("usuarios?select=*").then((response) => {
    usuarios.value = response.data;
  });
  await CargarContactos();
  table.value = true;
  visible.value = false;
}

async function clickRow(row) {
  FilaDetalle.value.comentarios = "";
  Fila.value = row;
  console.log(Fila.value);

  optionState.value = estado.value.filter(
    (p) => p.descripcion === "Escalado" || p.descripcion === "Solucionado"
  );

  await api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&select=*`)
    .then((response) => {
      detalleTiquete.value = response.data;
      tablaDetalle.value = true;
    });

  tipoDisplay.value = tipo.value.filter(
    (p) => p.id === row.tipo
  )[0].descripcion;
  if (row.tipo === 1) {
    colorTipo.value = "purple";
  } else if (row.tipo === 2) {
    colorTipo.value = "cyan";
  } else if (row.tipo === 3) {
    colorTipo.value = "blue";
  }

  estadoDisplay.value = estado.value.filter(
    (p) => p.id === row.estado
  )[0].descripcion;
  if (row.estado === 1) {
    colorEstado.value = "green";
  } else if (row.estado === 2) {
    colorEstado.value = "orange";
  } else if (row.estado === 3) {
    colorEstado.value = "red";
  }

  prioridadDisplay.value = prioridad.value.filter(
    (p) => p.id === row.prioridad
  )[0].descripcion;
  if (row.prioridad === 3) {
    colorPrioridad.value = "green";
  } else if (row.prioridad === 2) {
    colorPrioridad.value = "orange";
  } else if (row.prioridad === 1) {
    colorPrioridad.value = "red";
  }
}

// function counterLabelFn ({ totalSize, filesNumber, maxFiles }) {
//   return `${filesNumber} files of ${maxFiles} | ${totalSize}`
// }

const agregarSaltosDeLinea = (text) => {
  const words = text.split(" ");
  const result = [];
  for (let i = 0; i < words.length; i++) {
    result.push(words[i]);
    if ((i + 1) % 5 === 0) {
      result.push("\n");
    }
  }
  return result.join(" ");
};

const VerEvidencias = (row) => {
  imagen.value = row.evidencia;
  mostrarImagen.value = true;
};

async function gestionarTicket() {
  Fila.value.estado = ticketState.value.id;
  FilaDetalle.value.tiquete = Fila.value.id;
  FilaDetalle.value.campomodificador = "Estado";
  FilaDetalle.value.valoranterior = "Asignado";
  FilaDetalle.value.valornuevo = ticketState.value.descripcion;
  FilaDetalle.value.metodoconsulta = methodState.value;
  FilaDetalle.value.operador = idusuario;
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  api.post("detalletiquete", FilaDetalle.value).then((response) => {
    api.put(`tiquete?id=eq.${Fila.value.id}`, Fila.value).then((response) => {
      clickRow(selected.value[0]);
    });
  });
}

const formatDate = (value) => {
  const date = new Date(value);
  // return date.toLocaleDateString();  // solo la fecha DD/MM/YY
  return date.toLocaleString(); // DD/MM/YY, 00:00:00
};

const addPersonConsulta = async () => {
  mostrarAddPersonaContacto.value = false;
  if (FilaContacto.value.telefono != null) {
    FilaContacto.value.telefono = parseInt(FilaContacto.value.telefono);
  }
  await api.post("contactos", FilaContacto.value).then((response) => {});
  await CargarContactos();
};
const CargarContactos = async () => {
  FilaContacto.value = {};
  FilaContacto.value.telefono = null;
  await api.get("contactos?select=*").then((response) => {
    contactos.value = response.data;
  });
};

const labelComentario = ref("Ver más");
const expanded2 = ref({});
function verMasComentario(rowId) {
  expanded2.value[rowId] = !expanded2.value[rowId];
  if (expanded2.value[rowId]) {
    labelComentario.value = "Ver Menos";
  } else {
    labelComentario.value = "Ver Mas";
  }
}
// ----------------Subscripcion a la tabla tiquetes--------------------------
supabase
  .channel("custom-update-channel")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "tiquete" },
    (payload) => {
      if (payload.new.asignado === idusuario) {
        if (payload.new.estado === 2) {
          $q.notify({
            type: "positive",
            message: `Se ha agregado el ticket N° ${payload.old.id}`,
            timeout: 4000,
          });
        } else {
          $q.notify({
            type: "warning",
            message: `Se ha actualizado el ticket N° ${payload.old.id}`,
            timeout: 4000,
          });
        }
        getData();
      }
    }
  )
  .subscribe();
// ------------------------------------------
const sortBy = ref("id");
const sortDesc = ref(true);
function customSort() {
  tiquete.value.sort((a, b) => {
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

onMounted(() => {
  getData();
});

const onClick = () => {};
defineComponent({
  name: "MainTable",
});
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

@media only screen and (max-width: 600px) {
  .table-card {
    margin-right: 0px;
  }

  q-table {
    display: flex;
  }
}
</style>
