<template>
  <div class="q-pa-md flex">
    <div class="q-pa-md flex" v-if="table">
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
        hide-pagination="true"
        v-model:pagination="pagination"
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
          'asignado',
        ]"
      >
        <template v-slot:top>
          <q-btn
            :disable="!selected.length > 0"
            class="q-ma-xs"
            color="secondary"
            size="md"
            @click="getDetalleTiquete()"
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
              clickRow(props.row);
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
                <q-badge
                  :color="Estados.filter((p) => p.id == col.value)[0].color"
                >
                  {{ Estados.filter((p) => p.id == col.value)[0].descripcion }}
                </q-badge>
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
              <div v-else-if="col.name == 'solicitud'">
                {{ solicitudes.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'created_at'">
                {{ formatDate(col.value) }}
              </div>
              <div v-else-if="col.name == 'asignado'">
                {{ users.filter((p) => p.id == col.value)[0].nombre }}
              </div>

              <div v-else>
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>

  <!-- Modal Principal de accion de tiquete -->
  <q-dialog
    v-model="mostrarModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 90%; max-width: 100%; height: 90vh">
      <q-card-section>
        <div class="row">
          <div class="col-11 self-center">
            <span
              style="font-size: 18px; font-weight: bold; margin: 10px 0 0 15px"
              >Gestionar Ticket N° {{ Fila.id }}</span
            >
          </div>

          <div class="col-1">
            <q-btn
              flat
              icon="close"
              v-close-popup
              style="display: flex; margin-left: auto"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 75%" class="scroll">
        <div class="row">
          <div class="col-auto">
            <q-card flat>
              <div class="q-pa-md">
                <q-card>
                  <div class="row">
                    <div class="col-12">
                      <div class="row" style="background: #ffffff">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                          <q-select
                            readonly
                            label="Cliente"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.cliente"
                            dense
                            :options="cliente"
                            option-label="nombres"
                            option-value="id"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
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

                        <div class="col-md-4 col-sm-4 col-xs-12">
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
                        <div class="col-md-4 col-sm-4 col-xs-12">
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
                        <div class="col-md-4 col-sm-4 col-xs-12">
                          <q-select
                            readonly
                            label="Subtipo"
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

                        <div class="col-md-4 col-sm-4 col-xs-12">
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

                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            readonly
                            label="Tipo de Solicitud"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.solicitud"
                            dense
                            :options="solicitudes"
                            option-label="nombre"
                            option-value="id"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            readonly
                            label="Asignado"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.asignado"
                            dense
                            :options="users"
                            option-label="nombre"
                            option-value="id"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-3 col-sm-3 col-xs-12">
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
                        <div class="col-md-3 col-sm-3 col-xs-12 container">
                          <q-btn
                            label="Ver evidencias"
                            color="grey"
                            @click="VerEvidencias(selected[0])"
                          />
                        </div>

                        <div class="col-md-12 col-sm-12 col-xs-12">
                          <q-input
                            readonly
                            outlined
                            v-model="Fila.observaciones"
                            dense
                            type="textarea"
                            label="Observaciones"
                            class="q-pa-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </q-card>
          </div>
        </div>

        <div class="row">
          <div class="col-auto">
            <q-card flat>
              <div class="q-pa-md" v-if="TablaDetalles">
                <q-table
                  separator="horizontal"
                  flat
                  bordered
                  ref="tableRef"
                  :rows="tiquetesDetalles"
                  :columns="columnsDetalles"
                  :table-colspan="6"
                  row-key="id"
                  selection="single"
                  v-model:selected="selectedDetalle"
                  fixed-header
                  v-model:expanded="expanded"
                  :visible-columns="[
                    'operador',
                    'comentarios',
                    'campomodificador',
                    'valoranterior',
                    'valornuevo',
                    'observaciones',
                    'created_at',
                    'adjunto_url',
                    'verevidencias',
                  ]"
                >
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
                        clickRowDetalle(props.row);
                      "
                    >
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name == 'operador'">
                          <div
                            v-if="
                              users.filter((p) => p.id == col.value).length == 0
                            "
                          >
                            {{ col.value }}
                          </div>
                          <div v-else>
                            {{
                              users.filter((p) => p.id == col.value)[0].nombre
                            }}
                          </div>
                        </div>
                        <div
                          v-else-if="
                            col.name == 'campomodificador' ||
                            col.name == 'valoranterior' ||
                            col.name == 'valornuevo' ||
                            col.name == 'comentarios'
                          "
                        >
                          <div v-if="col.value == null">
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
                        <div v-else-if="col.name == 'created_at'">
                          {{ formatDate(col.value) }}
                        </div>
                        <div v-else-if="col.name == 'verevidencias'">
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
                        <div v-else>
                          {{ col.value }}
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row">
          <div class="col-12" style="display: flex">
            <q-btn
              label="Asignar Ticket"
              style="margin-left: auto; margin-right: auto"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="AccionTiquete('AsignarTicket')"
            />
            <q-btn
              label="Gestionar Ticket"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="AccionTiquete('SolucionarTicket')"
            />
            <q-btn
              :disable="disable"
              label="Cerrar Ticket"
              style="margin-left: auto; margin-right: auto"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="AccionTiquete('CerrarTicket')"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal de asignacion -->
  <q-dialog
    v-model="mostrarAsignarTiquetes"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="max-width: 1000px; width: 600px">
      <q-form autofocus @submit.prevent="GestionTiquete(accion)">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            Reasignar Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-4 col-sm-4 col-xs-12">
                  <q-select
                    readonly
                    outlined
                    v-model="Fila.proceso"
                    :options="Procesos"
                    option-label="descripcion"
                    option-value="id"
                    label="Nivel Actual"
                    dense
                    class="q-pa-md"
                    emit-value
                    map-options
                  ></q-select>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                  <q-select
                    label="Prioridad"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="next.prioridad"
                    dense
                    :options="Prioridades"
                    option-label="descripcion"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <!-- {{ users.filter((p) => p.id == Fila.asignado) }} -->
                <div class="col-md-4 col-sm-4 col-xs-12">
                  <q-input
                    outlined
                    v-model="
                      users.filter((p) => p.id == Fila.asignado)[0].nombre
                    "
                    dense
                    label="Operador"
                    class="q-pa-md"
                  />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <q-select
                    :rules="selectRule"
                    label="Proceso"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="next.nivel"
                    dense
                    :options="Procesos.filter((p) => p.id > Fila.proceso)"
                    option-label="descripcion"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <q-select
                    :rules="selectRule"
                    label="Operador"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="next.operador"
                    dense
                    :options="users.filter((p) => p.nivel == next.nivel)"
                    option-label="nombre"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    outlined
                    v-model="FilaDetalle.adjunto_url"
                    dense
                    type="text"
                    label="Adjuntar Url"
                    class="q-pa-md"
                  />
                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>
                  <q-input
                    :rules="inputRules"
                    outlined
                    v-model="FilaDetalle.comentarios"
                    dense
                    type="textarea"
                    label="Observaciones"
                    class="q-pa-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal q-pr-md">
          <q-btn
            v-if="accion != 'Ver'"
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
          <!-- <q-btn flat :label="'Cancel'" style="font-weight: bold" v-close-popup />
              <q-btn v-if="accion != 'Ver'" color="primary" :label="'Aceptar'" type="submit" /> -->
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- Modal de Gestion de tiquete -->
  <q-dialog
    v-model="mostrarSolucionarTiquetes"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="max-width: 100%; width: 70%">
      <q-form autofocus @submit.prevent="GestionTiquete(accion)">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            Gestion de Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    outlined
                    v-model="FilaDetalle.adjunto_url"
                    dense
                    type="text"
                    label="Adjuntar Url"
                    class="q-pa-md"
                  />

                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>

                  <q-input
                    outlined
                    v-model="FilaDetalle.comentarios"
                    dense
                    type="textarea"
                    label="Observaciones"
                    class="q-pa-md"
                    :rules="inputRules"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal q-pr-md">
          <q-btn
            v-if="accion != 'CerrarTicket'"
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
          <q-btn
            v-if="accion == 'CerrarTicket'"
            flat
            color="primary"
            :label="'Aceptar'"
            type="submit"
            @click="accion = 'CerrarTicket'"
            text-color="dark"
            no-caps
          />
          <!--               ;<q-btn flat :label="'Cancel'" style="font-weight: bold" v-close-popup />
              <q-btn v-if="accion != 'Ver'" color="primary" :label="'Aceptar'" type="submit" /> -->
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
            v-if="accion == 'CerrarTicket'"
            label="No"
            v-close-popup
            color="negative"
          />
          <span style="padding-right: 40px"></span>
          <q-btn
            v-if="accion == 'CerrarTicket'"
            label="Si"
            color="primary"
            @click="GestionTiquete('ConfimarCerrar')"
          />
          <q-btn
            v-show="accion == 'alerta'"
            label="Cerrar"
            color="grey"
            v-close-popup
          />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <!-- Modal de imagen -->
  <q-dialog v-model="mostrarImagen">
    <q-card style="width: 40em">
      <q-img
        :src="imagen"
        alt=""
        spinner-color="red"
        style="height: fit-content"
        fit="scale-down"
      >
      </q-img>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineComponent, ref, onMounted, watch } from "vue";
import { LocalStorage } from "quasar";
import { api } from "boot/axios";
import {
  mostrarMensajes,
  getSelectedString,
  createBase64Image,
} from "boot/global";
import { supabase } from "src/supabase";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
import { createClient } from "@supabase/supabase-js";
import FileInput from "src/components/FileImage.vue";
//supabase

const valorDatosExportado = ref("");
function actualizarValorDatosExportado(nuevoValor) {
  valorDatosExportado.value = nuevoValor;
}

const files = ref(null);
const idusuario = LocalStorage.getItem("IdUsuario");
const selected = ref([]);
const selectedDetalle = ref([]);
const store = useMainStore();
const configStore = useConfigStore();
const tiquetes = ref([]);
const tiquetesDetalles = ref([]);
const concesion = ref({});
const peajes = ref([]);
const cliente = ref([]);
const users = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const Prioridades = ref([]);
const Estados = ref([]);
const Procesos = ref([]);
const solicitudes = ref([]);
const visible = ref(false);
const tablaSeleccionada = ref("");
const next = ref({
  nivel: null,
  operador: null,
  prioridad: null,
});
const pagination = ref({
  rowsPerPage: 10,
});
const imagen = ref("");
const disable = ref(false);
const oldProridad = ref(null);
const mostrarModal = ref(false);
const mostrarConfirm = ref(false);
const mostrarAsignarTiquetes = ref(false);
const mostrarSolucionarTiquetes = ref(false);
const mostrarImagen = ref(false);
const accion = ref("");
const mensaje = ref("");
const Fila = ref({});
const FilaDetalle = ref({});
const tableRef = ref(null);
const expanded = ref([]);
const table = ref(false);
const TablaDetalles = ref(false);
const selectRule = [(value) => !!value || "Este campo es obligatorio"];

const avatarold = ref("");
const loadingImage = ref(false);
const filaavatar = ref([]);

const inputRules = [
  (val) => (val && val.length > 0) || "Por favor llenar el campo",
];
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
    name: "solicitud",
    align: "left",
    label: "Tipo de Solicitud",
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
];

const columnsDetalles = [
  {
    name: "id",
    required: false,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "tiquete",
    required: false,
    label: "Tiquete",
    align: "left",
    field: "tiquete",
    sortable: true,
  },
  {
    name: "operador",
    align: "left",
    label: "Operador",
    field: "operador",
    sortable: true,
  },
  {
    name: "comentarios",
    align: "left",
    label: "Comentarios",
    field: "comentarios",
    sortable: true,
  },
  {
    name: "campomodificador",
    required: true,
    align: "left",
    label: "Campo Modificador",
    field: "campomodificador",
    sortable: false,
  },

  {
    name: "valoranterior",
    align: "left",
    label: "Valor Anterior",
    field: "valoranterior",
    sortable: true,
  },

  {
    name: "valornuevo",
    align: "left",
    label: "Valor Nuevo",
    field: "valornuevo",
    sortable: true,
  },

  {
    name: "adjunto_url",
    align: "left",
    label: "Url Adjunto",
    field: "adjunto_url",
    sortable: true,
  },
  {
    name: "created_at",
    align: "center",
    label: "Fecha",
    field: "created_at",
    sortable: true,
  },
  {
    name: "verevidencias",
    required: false,
    label: "Ver evidencias",
    align: "left",
    field: "verevidencias",
    sortable: true,
  },
];

//-------------------------------------------------------
//Metodos
const clickRow = (row) => {
  Fila.value = row;
  oldProridad.value = row.prioridad;
  next.value.prioridad = Fila.value.prioridad;
};
const clickRowDetalle = (row) => {};

const getDetalleTiquete = async () => {
  next.value.nivel = null;
  next.value.operador = null;
  await api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&select=*`)
    .then((response) => {
      tiquetesDetalles.value = response.data;
      TablaDetalles.value = true;
      mostrarModal.value = true;
    });
};
const GestionTiquete = async (accionValue) => {
  if (accion.value == "SolucionarTicket") {
    //JSON de tabla de detalles, Se modifican los estados de acuerdo a la base de datos, basandose en la descripcion
    //y no el el id -----PARA LA SOLUCION SOLO CAMBIA EL CAMPO ##SOLUCIONAR##

    FilaDetalle.value.campomodificador = "Estado";
    FilaDetalle.value.valoranterior = "Iniciado";
    FilaDetalle.value.valornuevo = "Solucionado";
    FilaDetalle.value.tiquete = Fila.value.id;
    FilaDetalle.value.operador = idusuario;
    // FilaDetalle.value.evidencia = archivos2.value;
    //se actualiza el campo del tiquete que se esta modificando
    Fila.value.estado = Estados.value.filter(
      (p) => p.descripcion == FilaDetalle.value.valornuevo
    )[0].id;

    //agregar saltos de linea al campo Comentarios
    FilaDetalle.value.comentarios = agregarSaltosDeLinea(
      FilaDetalle.value.comentarios
    );
    FilaDetalle.value.evidencia = valorDatosExportado.value;
    console.log(FilaDetalle.value);

    // post a la tabla de detalles tiquetes------------------
    await api
      .post(`detalletiquete`, FilaDetalle.value)
      .then((response) => {
        api
          .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            mostrarSolucionarTiquetes.value = false;
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se soliciono correctamente",
            });
          });
      })
      .catch((error) => {
        mostrarMensajes({
          tipomensaje: 4,
          mensaje: "Error, complete todos los campos",
        });
      });
    await getDetalleTiquete();
  } else if (accion.value == "AsignarTicket") {
    if (oldProridad.value != next.value.prioridad) {
      FilaDetalle.value.campomodificador = `- Estado \n- Nivel \n- Prioridad`;

      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion
      }\n- ${
        Procesos.value.filter((p) => p.id == Fila.value.proceso)[0].descripcion
      }\n- ${
        Prioridades.value.filter((p) => p.id == oldProridad.value)[0]
          .descripcion
      }`;

      FilaDetalle.value.valornuevo = `- Asignado\n- ${
        Procesos.value.filter((p) => p.id == next.value.nivel)[0].descripcion
      }\n- ${
        Prioridades.value.filter((p) => p.id == next.value.prioridad)[0]
          .descripcion
      }`;
    } else {
      FilaDetalle.value.campomodificador = `- Estado \n- Nivel`;

      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion
      }\n- ${
        Procesos.value.filter((p) => p.id == Fila.value.proceso)[0].descripcion
      }`;

      FilaDetalle.value.valornuevo = `- Asignado\n- ${
        Procesos.value.filter((p) => p.id == next.value.nivel)[0].descripcion
      }`;
    }

    FilaDetalle.value.tiquete = Fila.value.id;

    FilaDetalle.value.operador = idusuario;

    //se actualiza el campo del tiquete que se esta modificando
    Fila.value.estado = Estados.value.filter(
      (p) => p.descripcion == "Asignado"
    )[0].id;
    Fila.value.proceso = next.value.nivel;

    Fila.value.asignado = next.value.operador;
    Fila.value.prioridad = next.value.prioridad;
    //agregar saltos de linea al campo Comentarios
    FilaDetalle.value.comentarios = agregarSaltosDeLinea(
      FilaDetalle.value.comentarios
    );
    FilaDetalle.value.evidencia = valorDatosExportado.value;
    mostrarAsignarTiquetes.value = false;
    await api
      .post(`detalletiquete`, FilaDetalle.value)
      .then((response) => {
        api
          .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se asigno correctamente al siguiete nivel",
            });
          });
      })
      .catch((error) => {
        mostrarMensajes({
          tipomensaje: 4,
          mensaje: "Error, complete todos los campos",
        });
      });
    await getDetalleTiquete();
  } else if (accion.value == "CerrarTicket") {
    mostrarConfirm.value = true;
    if (accionValue == "ConfimarCerrar") {
      FilaDetalle.value.campomodificador = `Estado`;
      FilaDetalle.value.valoranterior = `${
        Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion
      }`;
      FilaDetalle.value.valornuevo = `Cerrado`;
      FilaDetalle.value.tiquete = Fila.value.id;
      FilaDetalle.value.operador = idusuario;

      //se actualiza el campo del tiquete que se esta modificando
      Fila.value.estado = Estados.value.filter(
        (p) => p.descripcion == "Cerrado"
      )[0].id;
      // Fila.value.prioridad = Prioridades.value.filter(
      //   (p) => p.descripcion == "Baja"
      // )[0].id;
      Fila.value.asignado = idusuario;
      //agregar saltos de linea al campo Comentarios
      FilaDetalle.value.comentarios = agregarSaltosDeLinea(
        FilaDetalle.value.comentarios
      );
      await api
        .post(`detalletiquete`, FilaDetalle.value)
        .then((response) => {
          api
            .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
            .then((response) => {
              mostrarConfirm.value = false;
              mostrarSolucionarTiquetes.value = false;
              mostrarMensajes({
                tipomensaje: 1,
                mensaje: "El ticket se cerro correctamente",
              });
              enviarCorreo();
            });
        })
        .catch((error) => {
          mostrarMensajes({
            tipomensaje: 4,
            mensaje: "Error, complete todos los campos",
          });
        });

      await getDetalleTiquete();
    }
  }
};

const LoadData = async () => {
  if (users.value.filter((p) => p.id == idusuario)[0].nivel === 3) {
    await api
      .get(`tiquete?asignado=eq.${idusuario}&select=*`)
      .then((response) => {
        tiquetes.value = response.data;
      });
  } else {
    api.get("tiquete?select=*").then((response) => {
      tiquetes.value = response.data;
    });
  }
};

const AccionTiquete = (key) => {
  accion.value = key;
  FilaDetalle.value.comentarios = "";
  FilaDetalle.value.adjunto_url = "";
  filaavatar.value = [];
  FilaDetalle.value.evidencia = "";
  const ValidadorEstado = () => {
    if (
      key == "CerrarTicket" &&
      Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion !=
        "Solucionado"
    ) {
      accion.value = "alerta";
      mensaje.value = `No se puede realizar esta acción. El ticket debe estar solucionado `;
      mostrarConfirm.value = true;
      return true;
    } else if (
      Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion ==
        "Solucionado" ||
      Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion ==
        "Cerrado" ||
      Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion ==
        "Finalizado"
    ) {
      if (
        key == "CerrarTicket" &&
        Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion ==
          "Solucionado"
      ) {
        return false;
      } else {
        accion.value = "alerta";
        mensaje.value = `No se puede realizar esta acción. El ticket se encuentra ${
          Estados.value.filter((p) => p.id == Fila.value.estado)[0].descripcion
        }`;
        mostrarConfirm.value = true;
        return true;
      }
    }
  };
  switch (key) {
    case "AsignarTicket":
      next.value.prioridad = Fila.value.prioridad;
      if (ValidadorEstado()) {
      } else if (
        Procesos.value.filter((p) => p.id > Fila.value.proceso).length == 0
      ) {
        accion.value = "alerta";
        mensaje.value =
          "No se puede asignar. El ticket se encuentra en el nivel maximo de asignación";
        mostrarConfirm.value = true;
      } else {
        next.value.nivel = null;
        next.value.operador = null;
        mostrarAsignarTiquetes.value = true;
      }
      break;
    case "SolucionarTicket":
      if (ValidadorEstado()) {
      } else {
        mostrarSolucionarTiquetes.value = true;
      }
      break;
    case "CerrarTicket":
      if (ValidadorEstado()) {
      } else {
        mensaje.value = "¿Está seguro de cerrar el tickete?";
        mostrarSolucionarTiquetes.value = true;
      }
      break;
    default:
      break;
  }
};

const DatosGenerales = async () => {
  visible.value = true;
  await api.get(`cliente?select=*`).then((response) => {
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

  await api.get("estado?select=*").then((response) => {
    Estados.value = response.data;
  });

  await api.get("proceso?select=*").then((response) => {
    Procesos.value = response.data;
  });

  await api.get("usuarios?select=*").then((response) => {
    users.value = response.data;
  });

  await api.get("solicitud?select=*").then((response) => {
    solicitudes.value = response.data;
  });

  Fila.value.asignado = "4ca6c4d3-c2f9-4c1f-9411-de9271b9519f";
  Fila.value.privado = null;
  visible.value = false;
  table.value = true;
};

//-------------------------------------------------------
//Funciones generales
const enviarCorreo = () => {
  var data = {};
  data.email = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].correo;
  data.estado = "Cerrado";
  data.mensaje1 =
    "La solicitud fue revisada y cerrada por el equipo de soporte de";
  data.mensaje2 = "Por favor verificar y dar por finalizado el ticket";
  const axios = require("axios");
  const url = "http://localhost:3000/enviar-correo";
  axios
    .post(url, data)
    .then((response) => {})
    .catch((error) => {
      console.error(error);
    });
};
const formatDate = (value) => {
  const date = new Date(value);
  // return date.toLocaleDateString();  // solo la fecha DD/MM/YY
  return date.toLocaleString(); // DD/MM/YY, 00:00:00
};

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

onMounted(async () => {
  await DatosGenerales();
  LoadData();
});

defineComponent({
  name: "MainTable",
});

//------------------------------------------
supabase
  .channel("custom-update-channel")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "tiquete" },
    (payload) => {
      accion.value = "alerta";
      // mensaje.value = `Se han realizado cambios en algun tiquete `;
      // mostrarConfirm.value = true;
      LoadData();
    }
  )
  .subscribe();

supabase
  .channel("custom-insert-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "tiquete" },
    (payload) => {
      accion.value = "alerta";
      mensaje.value = `Se genero un nuevo tiquete `;
      mostrarConfirm.value = true;
      LoadData();
    }
  )
  .subscribe();

//------------------------------------------
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
</style>
