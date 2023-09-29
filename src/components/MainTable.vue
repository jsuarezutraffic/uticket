<template>
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
          title="Tickets"
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
          rows-per-page-label="Registro por página"
          loading-label="Cargando..."
          no-data-label="No existen datos para mostrar"
        >
          <template v-slot:top>
            <div style="font-weight: bold" class="q-table__title">Tickets</div>
            <q-space />
            <q-btn
              @click="getData()"
              outline
              round
              class="q-ma-xs"
              color="tertiary"
              size="md"
              icon="refresh"
            >
            </q-btn>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props" class="head-styles">
              <q-th
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
                  {{
                    estado.filter((p) => p.orden == col.value)[0].descripcion
                  }}
                </div>

                <div v-else-if="col.name == 'concesion'">
                  {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'solicitud'">
                  {{ solicitud.filter((p) => p.orden == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'peaje'">
                  {{ peaje.filter((p) => p.id == col.value)[0].nombre }}
                </div>

                <div v-else-if="col.name == 'subtipo'">
                  {{ subtipo.filter((p) => p.id == col.value)[0].descripcion }}
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
              class="text-h5 q-pa-md text-bold text-center text-uppercase title-card-style text-white"
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

              <div class="col-md-3 col-sm-4 col-xs-6">
                <q-circular-progress
                  show-value
                  class="text-white q-ma-md"
                  :value="progressValue"
                  size="60px"
                  :thickness="0.2"
                  color="orange"
                  track-color="transparent"
                >
                  <q-btn
                    :disable="Fila.audio == null"
                    @click="startAudio"
                    outline
                    round
                    color="green"
                    icon="play_arrow"
                  />
                </q-circular-progress>
                <audio
                  ref="audioPlayer"
                  :src="Fila.audio"
                  @play="onPlay"
                  @pause="onPause"
                ></audio>
              </div>
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
                :sort-method="ordenarPorFecha()"
                :sort-method-props="{ sortBy, sortDesc }"
                row-key="id"
                v-model:pagination="pagination"
                v-model:expanded="expanded"
                rows-per-page-label="Registro por página"
                loading-label="Cargando..."
                no-data-label="No existen datos para mostrar"
              >
                <template v-slot:top>
                  <div style="font-weight: bold" class="q-table__title">
                    Detalles Tickets
                  </div>
                  <q-space />
                  <q-btn
                    @click="mostrarSolucionarTiquetes = true"
                    outline
                    class="q-ma-xs"
                    color="tertiary"
                    size="md"
                    >Agregar Detalle
                  </q-btn>
                </template>
                <template v-slot:header="props">
                  <q-tr
                    :props="props"
                    class="bg-primary head-styles text-white"
                  >
                    <q-th
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
                          <div>
                            <a
                              v-if="props.row.comentarios.length > 0"
                              href="#"
                              class="q-link text-primary"
                              @click="verMasComentario(col.value)"
                            >
                              Ver más
                            </a>
                          </div>
                        </div>
                      </div>

                      <div v-else-if="col.name == 'verevidencia'">
                        <q-btn
                          class="q-px-sm"
                          color="primary"
                          size="sm"
                          no-caps
                          dense
                          @click="VerEvidencias(props.row)"
                          >Ver Evidencias
                        </q-btn>
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
              @click="clickGestionar()"
              :disable="
                estado.filter((p) => p.orden == Fila.estado)[0].descripcion !==
                'Asignado'
              "
            />
            <q-dialog v-model="dialog">
              <q-card style="max-width: 100%; width: 70%">
                <q-card-section>
                  <div class="q-pa-md">
                    <div class="row" style="background: #ffffff">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        <q-select
                          square
                          filled
                          v-model="ticketState"
                          :options="optionState"
                          option-label="descripcion"
                          option-value="orden"
                          class="q-pa-md"
                          label="Estado"
                          :rules="selectRule"
                        />
                      </div>
                      <div class="col-md-6 col-sm-6 col-xs-12">
                        <q-input
                          readonly
                          square
                          class="q-pa-md"
                          filled
                          v-model="
                            cliente.filter((p) => p.id === Fila.cliente)[0]
                              .nombres
                          "
                          type="text"
                          label="Nombre Cliente"
                        />
                      </div>
                      <div class="col-md-6 col-sm-6 col-xs-12">
                        <q-input
                          readonly
                          square
                          class="q-pa-md"
                          filled
                          v-model="
                            cliente.filter((p) => p.id === Fila.cliente)[0]
                              .telefono
                          "
                          type="text"
                          label="Telefono Cliente"
                        />
                      </div>
                      <div class="col-md-5 col-sm-5 col-xs-12">
                        <q-select
                          label="Persona Consultada"
                          transition-show="scale"
                          transition-hide="scale"
                          filled
                          square
                          v-model="FilaDetalle.consultado"
                          :options="contactos"
                          option-label="nombres"
                          option-value="id"
                          input-debounce="0"
                          class="q-pa-md"
                        />
                      </div>
                      <div class="col-md-5 col-sm-5 col-xs-12">
                        <q-select
                          readonly
                          label="Telefono Persona Consultada"
                          transition-show="scale"
                          transition-hide="scale"
                          filled
                          v-model="FilaDetalle.consultado"
                          square
                          :options="contactos"
                          option-label="telefono"
                          option-value="id"
                          input-debounce="0"
                          class="q-pa-md"
                        />
                      </div>
                      <div class="col-md-2 col-sm-2 col-xs-12 container2">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="person_add"
                          @click="mostrarAddPersonaContacto = true"
                        />
                      </div>
                      <div class="col-md-6 col-sm-6 col-xs-12">
                        <q-select
                          square
                          filled
                          v-model="FilaDetalle.metodoconsulta"
                          :options="metodoconsulta"
                          option-value="id"
                          option-label="descripcion"
                          label="Método de consulta"
                          class="q-pa-md"
                        />
                      </div>
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

                <q-card-section align="right" class="buttons no-padding">
                  <q-btn
                    v-close-popup
                    label="Cerrar"
                    color="primary"
                    class="q-ma-md close-buttons"
                    text-color="white"
                  />
                  <q-btn
                    v-popup
                    label="Enviar"
                    color="primary"
                    class="q-ma-md"
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
      <DashboardPage :showMaintable="showMaintable" />
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
    <!-- Modal de Solucionar de tiquete -->
    <q-dialog
      v-model="mostrarSolucionarTiquetes"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="max-width: 100%; width: 70%">
        <q-form autofocus @submit.prevent="mostrarConfirm = true">
          <q-card-section>
            <div style="font-size: 18px; font-weight: bold; align-self: center">
              Agregar Comentario a Tiquete
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="row" style="background: #ffffff">
                  <div class="col-md-4 col-sm-4 col-xs-6">
                    <q-toggle
                      class="q-pa-md"
                      v-model="verDetalleCliente"
                      label="Ver Cliente"
                    />
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <FileInput
                      @datos-exportado-cambiado="actualizarValorDatosExportado"
                    ></FileInput>
                    <InputTextJump
                      @text-con-salto-linea="actualizarTextExport"
                    ></InputTextJump>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal q-pr-md">
            <q-btn
              v-if="accion != 'CerrarTicket'"
              :disable="textSaltoLinea == ''"
              flat
              color="primary"
              :label="'Aceptar'"
              type="submit"
              text-color="dark"
              no-caps
            />
            <q-btn
              v-if="accion != 'CerrarTicket'"
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
            <span style="font-size: 18px">
              ¿Está seguro de agregar el detalle al ticket?</span
            >
          </div>
          <div class="col-2" style="margin: auto; padding: 10px">
            <q-btn class="q-mx-md" label="No" v-close-popup color="negative" />
            <q-btn
              class="q-mx-md"
              label="Si"
              color="primary"
              @click="agregarComentario()"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalComentario">
      <q-card style="max-width: 100%; width: 70%"
        ><q-editor
          min-height="3rem"
          min-weight="12rem"
          label="Observaciones"
          class="q-pa-md"
          v-model="detalleComentario"
          :toolbar="false"
          readonly
      /></q-card>
    </q-dialog>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-dark"
    label-style="font-size: 1.2em"
  />
</template>

<script setup>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import FileInput from "src/components/FileImage.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import DashboardPage from "src/pages/DashboardPage.vue";
import { useMainStore } from "src/stores/main";
import { supabase } from "src/supabase";
import { mostrarMensajes } from "boot/global";
import * as services from "../services/services.js";
import * as servicesEmail from "../services/serviceEmail.js";
const showMaintable = {
  showGraficas: true,
  showColums: [
    "id",
    "created_at",
    "cliente",
    "concesion",
    "peaje",
    "solicitud",
    // 'observaciones',
    "estado",
    "prioridad",
    "tipo",
    "subtipo",
    "asignado",
  ],
};
//variables para el grabado de notas de voz
const isRecording = ref(false);
const progressValue = ref(0);
let recorder;
let progressInterval;
const audioPlayer = ref(null);
const store = useMainStore();
const $q = useQuasar();
const imagen = ref("");
const methodState = ref(null);
const dialog2 = ref(false);
const dialog = ref(false);
const selected = ref([]);
const detalleTiquete = ref([]);
const tableRef = ref(null);
const expanded = ref([]);
const tiquete = ref([]);
const tipoDisplay = ref("");
const colorTipo = ref("");
const metodoconsulta = ref(store.generalData.metodoconsulta);
const prioridad = ref(store.generalData.prioridad);
const solicitud = ref(store.generalData.solicitud);
const estado = ref(store.generalData.estado);
const peaje = ref(store.generalData.peaje);
const tipo = ref(store.generalData.tipo);
const subtipo = ref(store.generalData.subtipo);
const concesion = ref(store.generalData.concesion);
const prioridadDisplay = ref("");
const colorPrioridad = ref("");
const colorEstado = ref("");
const estadoDisplay = ref("");
const usuarios = ref([]);
const tablaDetalle = ref(false);
const idusuario = LocalStorage.getItem("IdUsuario");
const optionState = ref([]);
const mostrarImagen = ref(false);
const mostrarObservaciones = ref(false);
const visible = ref(false);
const ticketState = ref(null);
const table = ref(false);
const mostrarSolucionarTiquetes = ref(false);
const mostrarConfirm = ref(false);
const Fila = ref({});
const FilaDetalle = ref({});
const FilaContacto = ref({});
const mostrarAddPersonaContacto = ref(false);
const contactos = ref([]);
const cliente = ref([]);
const verDetalleCliente = ref(false);
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

const clickGestionar = () => {
  dialog.value = true;
  FilaDetalle.value.metodoconsulta = null;
  FilaDetalle.value.consultado = null;
};

async function getData() {
  visible.value = true;
  await services.getTiquetes(`asignado=eq.${idusuario}&`).then((response) => {
    tiquete.value = response.data;
  });

  await services.getCliente("").then((response) => {
    cliente.value = response.data;
  });

  await services.getUsuarios("").then((response) => {
    usuarios.value = response.data;
  });
  await CargarContactos();
  table.value = true;
  visible.value = false;
  store.setListNotificaciones("clear");
}

async function clickRow(row) {
  FilaDetalle.value.comentarios = "";
  Fila.value = row;

  optionState.value = estado.value.filter(
    (p) => p.descripcion === "Escalado" || p.descripcion === "Solucionado"
  );

  await getDetalleTiquete();

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
    (p) => p.orden === row.estado
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
const getDetalleTiquete = async () => {
  await services
    .getDetalleTiquete(`tiquete=eq.${Fila.value.id}&`)
    .then((response) => {
      detalleTiquete.value = response.data;
      tablaDetalle.value = true;
    });
};

const VerEvidencias = (row) => {
  imagen.value = row.evidencia;
  mostrarImagen.value = true;
};

async function gestionarTicket() {
  Fila.value.estado = ticketState.value.orden;
  FilaDetalle.value.tiquete = Fila.value.id;
  FilaDetalle.value.campomodificador = "Estado";
  FilaDetalle.value.valoranterior = "Asignado";
  FilaDetalle.value.valornuevo = ticketState.value.descripcion;
  FilaDetalle.value.metodoconsulta = methodState.value;
  FilaDetalle.value.operador = idusuario;
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  services.postDetallesTiquetes(FilaDetalle.value).then((response) => {
    services
      .putTiquetes(`id=eq.${Fila.value.id}`, Fila.value)
      .then((response) => {
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
  await services.postContactos(FilaContacto.value).then((response) => {});
  await CargarContactos();
};
const CargarContactos = async () => {
  FilaContacto.value = {};
  FilaContacto.value.telefono = null;
  await services.getContactos("").then((response) => {
    contactos.value = response.data;
    console.log(contactos.value[0]);
  });
};

//Procesamiento de componente comentario
const modalComentario = ref(false);
const detalleComentario = ref("");
function verMasComentario(comentario) {
  detalleComentario.value = comentario;
  modalComentario.value = true;
}

const agregarComentario = async () => {
  mostrarConfirm.value = false;
  FilaDetalle.value.campomodificador = "--";
  FilaDetalle.value.valoranterior = `--`;
  FilaDetalle.value.valornuevo = "--";
  FilaDetalle.value.tiquete = Fila.value.id;
  FilaDetalle.value.operador = idusuario;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  FilaDetalle.value.estado = verDetalleCliente.value;
  // agregar saltos de linea al campo Comentarios
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  await services
    .postDetallesTiquetes(FilaDetalle.value)
    .then((response) => {
      mostrarSolucionarTiquetes.value = false;
      mostrarMensajes({
        tipomensaje: 1,
        mensaje: "Se agregó el detalle correctamente",
      });
      if (verDetalleCliente.value) {
        mensajeCliente("actualizacion");
      }
      valorDatosExportado.value = "";
    })
    .catch((error) => {
      mostrarMensajes({
        tipomensaje: 4,
        mensaje: "Error, complete todos los campos",
      });
    });
  getDetalleTiquete();
};
const mensajeCliente = async (accion) => {
  const data = {};
  data.email = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].correo;
  data.cliente = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].nombres;
  servicesEmail.correoCliente(data, Fila.value.id, accion);
};
// ----------------Subscripcion a la tabla tiquetes--------------------------
supabase
  .channel("custom-update-channel")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "tiquete" },
    (payload) => {
      if (payload.new.asignado === idusuario) {
        store.setListNotificaciones(payload.eventType);
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
        // getData();
      }
    }
  )
  .subscribe();
// ------------------------------------------
const pagination = ref({
  rowsPerPage: 8,
});
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

const ordenarPorFecha = (a, b) => {
  detalleTiquete.value.sort((a, b) => {
    // Función para convertir la cadena de fecha al formato adecuado para comparación
    const parseFecha = (fechaStr) => new Date(fechaStr);

    // Convierte las fechas a objetos Date para comparar
    const fechaA = parseFecha(a.created_at);
    const fechaB = parseFecha(b.created_at);

    // Compara las fechas
    if (fechaA < fechaB) return pagination.value.descending ? 1 : -1;
    if (fechaA > fechaB) return pagination.value.descending ? -1 : 1;
    return 0;
  });
};
// ------------------------------------------
// //funciones para el grabado de notas de voz
function onPlay() {
  clearInterval(progressInterval);
  progressValue.value = 0;
  progressInterval = setInterval(() => {
    if (audioPlayer.value) {
      const currentTime = audioPlayer.value.currentTime;
      const duration = audioPlayer.value.duration;
      progressValue.value = (currentTime / duration) * 100;
    }
  }, 100);
}

function startAudio() {
  audioPlayer.value.play();
}

function onPause() {
  clearInterval(progressInterval);
}

// Limpiar recursos al desmontar el componente
onUnmounted(() => {
  if (recorder && isRecording.value) {
    recorder.stop().catch(() => {});
  }
});

onMounted(() => {
  getData();
});

const onClick = () => {};
defineComponent({
  name: "MainTable",
});
</script>

<style lang="scss">
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

.container2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Ajusta la altura según tus necesidades */
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
