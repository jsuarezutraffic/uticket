<template>
  <div class="q-pa-md flex">
    <TransitionGroup>
      <div class="container" v-if="showMaintable.showGraficas">
        <q-card
          class="q-my-md q-mr-md row justify-evenly"
          v-if="table && countArrayEstado.length > 0"
        >
          <apex-donut
            heightDonut="height: 260px;"
            :Series="countArrayEstado"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Estados"
            width="320"
          />

          <!-- <apex-donut
            heightDonut="height: 260px;"
            :Series="countArrayPrioridad"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Prioridades"
            width="320"
          /> -->

          <!-- <apex-donut
            heightDonut="height: 260px;"
            :Series="countArraySolicitud"
            :cliente="cliente"
            :prioridades="Prioridades"
            title="Solicitudes"
            width="320"
          /> -->

          <apex-donut
            heightDonut="height: 260px;"
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
        :sort-method="customSort()"
        :sort-method-props="{ sortBy, sortDesc }"
        :visible-columns="showMaintable.showColums"
        rows-per-page-label="Registro por página"
        loading-label="Cargando..."
        no-data-label="No existen datos para mostrar, por favor cree un nuevo ticket"
      >
        <template v-slot:top>
          <div style="font-weight: bold" class="q-table__title">Tickets</div>
          <q-space />
          <q-btn
            class="q-ma-xs"
            color="tertiary"
            size="md"
            @click="
              chatStore.indicePreguntaActual = 0;
              Fila = {};
              modalNuevoTicket = true;
              clearAudio();
            "
            >Nuevo Ticket
          </q-btn>
          <!-- <q-btn
            v-if="showMaintable.showGraficas"
            outline=""
            to="/"
            class="q-ma-xs"
            color="tertiary"
            size="md"
            >Volver
          </q-btn> -->
          <q-btn
            v-if="!showMaintable.showGraficas"
            outline=""
            to="/tiquetes"
            class="q-ma-xs"
            color="tertiary"
            size="md"
            >Tabla Tickets
          </q-btn>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              class="th-text"
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
                {{ clientes.filter((p) => p.id == col.value)[0].nombres }}
              </div>
              <div v-else-if="col.name == 'concesion'">
                {{ concesion.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'peaje'">
                {{ peajes.filter((p) => p.id == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'solicitud'">
                <!-- {{ Solicitudes.filter((p) => p.orden == col.value)[0].nombre }} -->
              </div>
              <div v-else-if="col.name == 'estado'">
                <div
                  v-if="
                    Estados.filter((p) => p.orden == col.value)[0].vercliente
                  "
                >
                  <q-badge
                    :color="
                      Estados.filter((p) => p.orden == col.value)[0].color
                    "
                  >
                    {{
                      Estados.filter((p) => p.orden == col.value)[0].descripcion
                    }}
                  </q-badge>
                </div>
                <div v-else>
                  <q-badge color="blue"> En Proceso </q-badge>
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
                {{
                  store.generalData.subtipo.filter((p) => p.id == col.value)[0]
                    .descripcion
                }}
              </div>
              <div v-else-if="col.name == 'finalizar'">
                <q-btn
                  :disabled="
                    Estados.filter((p) => p.orden == props.row.estado)[0]
                      .descripcion != 'Cerrado'
                  "
                  class="q-px-sm"
                  color="primary"
                  size="sm"
                  no-caps
                  dense
                  @click="FinalizarTiquete(props.row)"
                  >Finalizar
                </q-btn>
              </div>
              <div v-else-if="col.name == 'devuelto'">
                <q-btn
                  :disabled="
                    Estados.filter((p) => p.orden == props.row.estado)[0]
                      .descripcion != 'Cerrado'
                  "
                  class="q-px-sm"
                  color="light-green-5"
                  size="sm"
                  no-caps
                  dense
                  @click="
                    FilaFinalizar = props.row;
                    Fila = props.row;
                    modalDevolverTiquete = true;
                    LocalStorage.set('transcript', store.encryptptData(''));
                  "
                  >Devolver
                </q-btn>
              </div>
              <div v-else-if="col.name == 'eliminar'">
                <q-btn
                  :disabled="
                    Estados.filter((p) => p.orden == props.row.estado)[0]
                      .descripcion != 'Iniciado'
                  "
                  class="q-px-sm"
                  color="red"
                  size="sm"
                  no-caps
                  dense
                  @click="EliminarTiquete(props.row)"
                  >Eliminar
                </q-btn>
              </div>
              <div v-else-if="col.name == 'id'">
                <q-btn
                  class="q-px-sm"
                  color="primary"
                  size="md"
                  no-caps
                  outline
                  dense
                  @click="
                    props.selected = !props.selected;
                    clickRow(props.row);
                  "
                  ><span style="color: black">{{ col.value }}</span>
                </q-btn>
              </div>
              <div
                v-else-if="
                  col.name == 'comentarios' || col.name == 'observaciones'
                "
              >
                <div v-if="col.value == null">
                  {{ col.value }}
                </div>
                <div v-else>
                  <div>
                    <a
                      href="#"
                      class="q-link text-primary"
                      @click="verMasComentario(col.value)"
                    >
                      Ver más
                    </a>
                  </div>
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
    </TransitionGroup>
    <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>

  <!-- Modal Nuevo ticket -->
  <q-dialog
    v-model="modalNuevoTicket"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card style="max-width: 100%; width: 50%">
      <!-- <q-form autofocus @submit.prevent="AgregarTicket()">AgregarTicketStore -->
      <q-form autofocus @submit.prevent="AgregarTicketStore()">
        <ChatBotSimple></ChatBotSimple>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modalConfirm">
    <q-card style="width: 35em">
      <div class="column" style="margin: 20px">
        <div class="col-4" style="margin: auto; padding: 10px">
          <q-icon name="error_outline" size="6em" />
        </div>
        <div class="col-4" style="margin: auto; padding: 10px">
          <span style="font-size: 18px"> {{ mensaje }}</span>
        </div>
        <div class="col-2" style="margin: auto; padding: 10px">
          <q-btn label="No" v-close-popup color="negative" />
          <span style="padding-right: 40px"></span>
          <q-btn label="Si" color="primary" @click="PostTiquete()" />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="chatStore.confirModal">
    <q-card style="width: 35em">
      <div class="column" style="margin: 20px">
        <div class="col-4" style="margin: auto; padding: 10px">
          <q-icon name="error_outline" size="6em" />
        </div>
        <div class="col-4" style="margin: auto; padding: 10px">
          <span style="font-size: 18px">
            Confirmar para agregar nuevo ticket</span
          >
        </div>
        <div class="col-2" style="margin: auto; padding: 10px">
          <q-btn label="No" v-close-popup color="negative" />
          <span style="padding-right: 40px"></span>
          <q-btn label="Si" color="primary" @click="AgregarTicketStore()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
  <!-- Modal Principal de accion de tiquete -->
  <q-dialog
    v-model="modalDetalles"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 90%; max-width: 100%; height: 90vh">
      <q-card-section>
        <div class="row">
          <div class="col-9 self-center">
            <span
              style="font-size: 18px; font-weight: bold; margin: 10px 0 0 15px"
              >Ticket N° {{ Fila.id }}</span
            >
          </div>
          <!-- modalNuevoTicket -->
          <div class="col-1">
            <q-btn
              :disable="!(Fila.estado == 1)"
              outline
              round
              color="tertiary"
              size="md"
              icon="mode"
              @click="editMode = false"
            >
            </q-btn>
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

      <q-card-section style="max-height: 75%" class="scroll q-pa-md">
        <div class="row justify-center">
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
                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            :readonly="editMode"
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
                          />
                        </div>
                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            :readonly="editMode"
                            label="Subtipo"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.subtipo"
                            dense
                            :options="SubtipoOptions"
                            option-label="descripcion"
                            option-value="id"
                            emit-value
                            map-options
                            class="q-pa-md"
                            @update:model-value="SubTipoSeleccion"
                          />
                        </div>
                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            :readonly="editMode"
                            label="Equipo"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.equipo"
                            dense
                            :options="Equipos"
                            option-label="descripcion"
                            option-value="id"
                            emit-value
                            map-options
                            class="q-pa-md"
                          />
                        </div>
                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            :readonly="editMode"
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
                        <div class="col-md-3 col-sm-3 col-xs-12 container">
                          <q-btn
                            label="Ver evidencias"
                            color="grey"
                            @click="VerEvidencias(Fila)"
                          />
                        </div>
                        <div
                          class="col-md-12 col-sm-12 col-xs-12"
                          v-if="!editMode"
                        >
                          <FileInput
                            @datos-exportado-cambiado="
                              actualizarValorDatosExportado
                            "
                          ></FileInput>
                        </div>
                        <div class="col-md-3 col-sm-12 col-xs-12">
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
                              :disabled="Fila.audio == null"
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
                        <div class="col-md-12 col-sm-12 col-xs-12 q-pa-md">
                          <q-editor
                            min-height="5rem"
                            label="Observaciones"
                            class="q-pa-md"
                            v-model="Fila.observaciones"
                            :toolbar="false"
                            :readonly="editMode"
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

        <div class="row justify-center" v-if="editMode">
          <div class="col-auto">
            <q-card flat>
              <div class="q-pa-md" v-if="TablaDetalles">
                <q-table
                  title="Detalles Tickets"
                  :loading="visible"
                  separator="horizontal"
                  flat
                  bordered
                  ref="tableRef"
                  :rows="tiquetesDetalles"
                  :columns="columnsDetalles"
                  :table-colspan="6"
                  :sort-method="ordenarPorFecha()"
                  :sort-method-props="{ sortBy, sortDesc }"
                  row-key="id"
                  selection="single"
                  v-model:selected="selectedDetalle"
                  v-model:pagination="pagination"
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

                    // 'adjunto_url',
                    'verevidencias',
                  ]"
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
                      :disable="Fila.estado == 6"
                      @click="
                        LocalStorage.set('transcript', store.encryptptData(''));
                        textSaltoLinea = '';
                        valorDatosExportado = '';
                        mostrarSolucionarTiquetes = true;
                      "
                      outline
                      class="q-ma-xs"
                      color="tertiary"
                      size="md"
                      >Agregar Detalle
                    </q-btn>
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
                      @click="props.selected = !props.selected"
                    >
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name == 'operador'">
                          <div
                            v-if="
                              store.generalData.usuario.filter(
                                (p) => p.id == col.value
                              ).length > 0
                            "
                          >
                            {{
                              store.generalData.usuario.filter(
                                (p) => p.id == col.value
                              )[0].nombre
                            }}
                          </div>
                          <div
                            v-if="
                              store.generalData.clientes.filter(
                                (p) => p.usuario == col.value
                              ).length > 0
                            "
                          >
                            {{
                              store.generalData.clientes.filter(
                                (p) => p.usuario == col.value
                              )[0].nombres
                            }}
                          </div>
                          <div
                            v-else-if="
                              store.generalData.usuario.filter(
                                (p) => p.id == col.value
                              ).length == 0
                            "
                          >
                            {{ col.value }}
                          </div>
                        </div>
                        <div
                          v-else-if="
                            col.name == 'campomodificador' ||
                            col.name == 'valoranterior' ||
                            col.name == 'valornuevo'
                          "
                        >
                          <div v-if="col.value == null">{{ col.value }}</div>
                          <div v-else>
                            <div
                              v-html="
                                col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')
                              "
                            ></div>
                          </div>
                        </div>
                        <div
                          v-else-if="
                            col.name == 'comentarios' ||
                            col.name == 'observaciones'
                          "
                        >
                          <div v-if="col.value == null">
                            {{ col.value }}
                          </div>
                          <div v-else>
                            <div>
                              <a
                                v-if="props.row.comentarios.length > 0"
                                href="#/tiquetes"
                                class="q-link text-primary"
                                @click="verMasComentario(col.value)"
                              >
                                Ver más
                              </a>
                            </div>
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
                        <div v-else-if="col.name == 'metodoconsulta'">
                          {{ col.value }}
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

      <q-card-section v-show="!editMode">
        <div class="row">
          <div class="col-12" style="display: flex">
            <q-btn
              :disabled="visible"
              label="Actualizar"
              style="margin-left: auto; margin-right: auto"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="UpdateTiquete()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal de imagen -->
  <q-dialog v-model="mostrarImagen">
    <VerImagenArray :datoProp="imagen"></VerImagenArray>
  </q-dialog>

  <!-- Modal de Gestion de tiquete -->
  <q-dialog
    v-model="modalDevolverTiquete"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="max-width: 100%; width: 70%">
      <q-form autofocus @submit.prevent="DevolverTiquete()">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            Devolver Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>
                  <InputTextJump
                    @text-con-salto-linea="actualizarTextExport"
                    :texto="transcript"
                  ></InputTextJump>
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
    <q-editor
      min-height="3rem"
      min-weight="12rem"
      label="Observaciones"
      class="q-pa-md"
      v-model="detalleComentario"
      :toolbar="false"
      readonly="true"
    />
  </q-dialog>
</template>

<script setup>
import {
  defineComponent,
  ref,
  toRefs,
  onMounted,
  watchEffect,
  onUnmounted,
} from "vue";
import { LocalStorage, date } from "quasar";
import { useQuasar } from "quasar";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import FileInput from "src/components/FileImage.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import ChatBotSimple from "src/components/ChatComponent.vue";
import Recorder from "recorder-js";
import * as services from "../services/services";
import * as servicesEmail from "../services/serviceEmail";
import { useChatStore } from "src/stores/chat"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
import { useMainStore } from "src/stores/main"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
const mostrarSolucionarTiquetes = ref(false);
const mostrarConfirm = ref(false);

const chatStore = useChatStore();
const store = useMainStore();
const admi = LocalStorage.getItem("admi");

//props
const props = defineProps(["showMaintable"]);
let { showMaintable } = toRefs(props);

const filtro = LocalStorage.getItem("filtro");
//variables para la transcripcion de la grabacioon
const isRecording2 = ref(false);
const transcript = ref("");
let recognition;

//variables para el grabado de notas de voz
const isRecording = ref(false);
const recordedAudio = ref(null);
const recordingDuration = ref(0);
const base64Audio = ref(null);
const progressValue = ref(0);
const editMode = ref(false);
let recorder;
let startTime;
let progressInterval;
const audioPlayer = ref(null);
const accion = ref("start");
const color = ref("primary");
let audioStream;

const idusuario = LocalStorage.getItem("IdUsuario");
const email = LocalStorage.getItem("email");
let $q = useQuasar();

const valorDatosExportado = ref("");
function actualizarValorDatosExportado(nuevoValor) {
  valorDatosExportado.value = nuevoValor;
}

const textSaltoLinea = ref("");
function actualizarTextExport(nuevoValor) {
  textSaltoLinea.value = nuevoValor;
}

const selected = ref([]);
const selectedDetalle = ref([]);
// const seedSize = seed.length;
const pagination = ref({
  rowsPerPage: 10,
});

const tiquetes = ref([]);
const concesion = ref([]);
const peajes = ref([]);
const cliente = ref([]);
const clientes = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const Equipos = ref([]);
const SubtipoOptions = ref([]);
const EquiposOptions = ref([]);
const Prioridades = ref([]);
const Estados = ref([]);
const Procesos = ref([]);
const Solicitudes = ref([]);
const Usuarios = ref([]);
const mensaje = ref("");

const modalNuevoTicket = ref(false);
const modalDetalles = ref(false);
const modalConfirm = ref(false);
const mostrarImagen = ref(false);
const modalDevolverTiquete = ref(false);
const Fila = ref({});
const FilaDetalle = ref({});
const tiquetesDetalles = ref([]);
const FilaFinalizar = ref({});
const tableRef = ref(null);
const expanded = ref([]);
const rules = [(val) => !!val || "* Campo Obligatorio"];
const table = ref(false);
const visible = ref(false);
const TablaDetalles = ref(false);
const countArrayEstado = ref([]);
const countArrayPrioridad = ref([]);
const countArrayTipo = ref([]);
const countArraySolicitud = ref([]);
const configJson = require("/public/config.json");
const { v4: uuidv4 } = require("uuid");

const imagen = ref("");
var dataMessage = {};
const columns = [
  {
    name: "id",
    // required: true,
    label: "Ticket",
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
    sortable: false,
  },

  {
    name: "concesion",
    align: "left",
    label: "Concesión",
    field: "concesion",
    sortable: false,
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
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "privado",
    align: "center",
    label: "Privado",
    field: "privado",
    sortable: true,
  },
  {
    name: "prioridad",
    align: "center",
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
    align: "center",
    label: "",
    field: "finalizar",
    sortable: false,
  },
  {
    name: "devuelto",
    align: "center",
    label: "",
    field: "devuelto",
    sortable: false,
  },
  {
    name: "eliminar",
    align: "center",
    label: "",
    field: "eliminar",
    sortable: false,
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

  // {
  //   name: "adjunto_url",
  //   align: "left",
  //   label: "Url Adjunto",
  //   field: "adjunto_url",
  //   sortable: true,
  // },
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

const clickRow = (row) => {
  editMode.value = true;
  Fila.value = row;
  modalDetalles.value = true;
  TipoSeleccion();
  getDetalleTiquete();
};

const getDetalleTiquete = async () => {
  visible.value = true;
  await services
    .getDetalleTiquete(`tiquete=eq.${Fila.value.id}&estado=eq.true&`)
    .then((response) => {
      tiquetesDetalles.value = response.data;
      TablaDetalles.value = true;
    });
  visible.value = false;
};

const loadData = async () => {
  if (!admi) {
    switch (filtro) {
      case "Solicitudes":
        await getDataTiquetes(
          `cliente=eq.${cliente.value[0].id}&estado=neq.8&`
        );
        break;
      case "Incidentes":
        await getDataTiquetes(
          `cliente=eq.${cliente.value[0].id}&estado=neq.8&solicitud=eq.1&`
        );
        break;
      case "Requerimiento":
        await getDataTiquetes(
          `cliente=eq.${cliente.value[0].id}&estado=neq.8&solicitud=eq.2&`
        );
        break;
      case "PQR":
        await getDataTiquetes(
          `cliente=eq.${cliente.value[0].id}&estado=neq.8&solicitud=eq.3&`
        );
        break;
    }
  } else {
    switch (filtro) {
      case "Solicitudes":
        await getDataTiquetes(
          `concesion=eq.${cliente.value[0].concesion}&estado=neq.8&`
        );
        break;
      case "Incidentes":
        await getDataTiquetes(
          `concesion=eq.${cliente.value[0].concesion}&estado=neq.8&solicitud=eq.1&`
        );
        break;
      case "Requerimiento":
        await getDataTiquetes(
          `concesion=eq.${cliente.value[0].concesion}&estado=neq.8&solicitud=eq.2&`
        );
        break;
      case "PQR":
        await getDataTiquetes(
          `concesion=eq.${cliente.value[0].concesion}&estado=neq.8&solicitud=eq.3&`
        );
        break;
    }
  }
  visible.value = false;
};

const getDataTiquetes = async (filtro) => {
  services.getTiquetes(filtro).then((response) => {
    tiquetes.value = response.data;
  });
};

const DatosGenerales = async () => {
  visible.value = true;
  cliente.value = store.generalData.cliente;
  clientes.value = store.generalData.clientes;
  concesion.value = store.generalData.concesion;
  peajes.value = store.generalData.peaje;
  Tipos.value = store.generalData.tipo;
  Subtipos.value = store.generalData.subtipo;
  Equipos.value = store.generalData.equipo;
  Prioridades.value = store.generalData.prioridad;
  Estados.value = store.generalData.estado;
  Solicitudes.value = store.generalData.solicitud;
  Procesos.value = store.generalData.proceso;
  Usuarios.value = store.generalData.usuario;
  visible.value = false;
  table.value = true;
};

const DevolverTiquete = async () => {
  accion.value = "devolver";
  mensaje.value = "¿Esta seguro de Devolver el Ticket?";
  modalConfirm.value = true;
};
const FinalizarTiquete = async (row) => {
  accion.value = "finalizar";
  FilaFinalizar.value = row;
  mensaje.value = "¿Esta seguro de Finalizar el Ticket?";
  modalConfirm.value = true;
};
const EliminarTiquete = async (row) => {
  accion.value = "eliminar";
  FilaFinalizar.value = row;
  mensaje.value = "¿Esta seguro de Eliminar el Ticket?";
  modalConfirm.value = true;
};

const PostTiquete = async () => {
  dataMessage = {};
  switch (accion.value) {
    case "finalizar":
      dataMessage.estado = "Finalizado";
      dataMessage.mensaje1 =
        "La solicitud fue revisada y finalizada por el equipo de soporte de";
      dataMessage.mensaje2 = "";

      if (
        Estados.value.filter((p) => p.orden == FilaFinalizar.value.estado)[0]
          .descripcion == "Finalizado"
      ) {
        $q.notify({
          type: "warning",
          message: "Ticket ya fue Finalizado",
          timeout: 4000,
        });
        return;
      } else {
        FilaDetalle.value.valornuevo = "Finalizado";
        FilaDetalle.value.valoranterior = "Cerrado";
        FilaFinalizar.value.estado = Estados.value.filter(
          (p) => p.descripcion == "Finalizado"
        )[0].orden;
      }

      break;
    case "devolver":
      dataMessage.estado = "Devuelto";
      dataMessage.mensaje1 =
        "La solicitud sera revisada nuevamente por el equipo de soporte de";
      dataMessage.mensaje2 =
        "Sera informado por este medio y el aplicativo cuando se solucione la problematica.";
      FilaDetalle.value.valoranterior = "Cerrado";
      FilaDetalle.value.valornuevo = "Devuelto";
      FilaFinalizar.value.estado = Estados.value.filter(
        (p) => p.descripcion == "Devuelto"
      )[0].orden;
      mensajeOperador();
      break;
    case "eliminar":
      dataMessage.estado = "Eliminado";
      dataMessage.mensaje1 = "La solicitud fue eliminada satisfactoriamente";
      dataMessage.mensaje2 = "";
      FilaDetalle.value.valornuevo = "Eliminado";
      FilaDetalle.value.valoranterior = "Iniciado";
      FilaFinalizar.value.estado = Estados.value.filter(
        (p) => p.descripcion == "Completado"
      )[0].orden;

      break;
  }

  modalConfirm.value = false;
  modalDevolverTiquete.value = false;

  FilaDetalle.value.campomodificador = "Estado";
  FilaDetalle.value.tiquete = FilaFinalizar.value.id;
  FilaDetalle.value.operador = idusuario;

  // se actualiza el campo del tiquete que se esta modificando
  FilaDetalle.value.estado = Estados.value.filter(
    (p) => p.orden == FilaFinalizar.value.estado
  )[0].vercliente;
  // agregar saltos de linea al campo Comentarios
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  await services
    .putTiquetes(`id=eq.${FilaFinalizar.value.id}`, FilaFinalizar.value)
    .then((response) => {
      loadData();
      modalNuevoTicket.value = false;
      enviarCorreo(dataMessage);
      if (
        response.status == 201 ||
        response.status == 200 ||
        response.status == 204
      ) {
        $q.notify({
          type: "positive",
          message: "Cambio realizado exitosamente, revise su correo",
          timeout: 4000,
        });
      }
      valorDatosExportado.value = "";
    });

  // post a la tabla de detalles tiquetes------------------
  await services
    .postDetallesTiquetes(FilaDetalle.value)
    .then((response) => {})
    .catch((error) => {
      $q.notify({
        type: "negative",
        message: "Error, complete todos los campos",
        timeout: 4000,
      });
    });
  Fila.value.id = FilaFinalizar.value.id;
  await getDetalleTiquete();
};

const UpdateTiquete = async () => {
  visible.value = true;
  Fila.value.evidencia = valorDatosExportado.value;
  await services
    .putTiquetes(`id=eq.${Fila.value.id}`, Fila.value)
    .then((response) => {
      loadData();
      modalDetalles.value = false;
      visible.value = false;
      if (
        response.status == 201 ||
        response.status == 200 ||
        response.status == 204
      ) {
        $q.notify({
          type: "positive",
          message: "Cambio realizado exitosamente, revise su correo",
          timeout: 4000,
        });
      }
      valorDatosExportado.value = "";
    });
};

const TipoSeleccion = (value) => {
  SubtipoOptions.value = Subtipos.value.filter(
    (tipo) => tipo.tipo == Fila.value.tipo
  );
  // Fila.value.subtipo = null;
};

const SubTipoSeleccion = (value) => {
  // EquiposOptions.value = Equipos.value.filter(
  //   (equipo) => equipo.subtipo == Fila.value.subtipo
  // );
  // Fila.value.equipo = null;
};

const AgregarTicket = async () => {
  clearAudio();
  modalNuevoTicket.value = false;
  visible.value = true;
  // Fila.value.id = 0;
  delete Fila.value.id;
  delete Fila.value.created_at;
  delete Fila.value.numero;

  Fila.value.cliente = cliente.value[0].id;
  Fila.value.concesion = concesion.value[0].id;
  Fila.value.asignado = Usuarios.value.filter(
    (p) => p.nivel == 1 && p.estado == true
  )[0].id;
  Fila.value.privado = null;
  Fila.value.proceso = 1;
  Fila.value.estado = 1;
  Fila.value.evidencia = valorDatosExportado.value;
  //Solicitudes.value.filter((x) => x.nombre == 'Incidentes')[0].nombre;
  Fila.value.observaciones = textSaltoLinea.value;
  if (Fila.value.solicitud == 1 || Fila.value.solicitud == 3) {
    Fila.value.prioridad = 1;
  } else if (Fila.value.solicitud == 2) {
    Fila.value.prioridad = 2;
  } else {
    Fila.value.prioridad = 3;
  }
  Fila.value.audio = base64Audio.value;
  await services
    .postTiquetes(Fila.value)
    .then((response) => {
      if (response.status == 201 || response.status == 200) {
        $q.notify({
          type: "positive",
          message: "Ticket Creado exitosamente",
          timeout: 4000,
        });
        dataMessage = {};
        dataMessage.estado = "Creado";
        dataMessage.mensaje1 =
          "La solicitud sera atendida por el equipo de soporte de";
        dataMessage.mensaje2 =
          "Sera informado por este medio y el aplicativo cuando se solucione la problematica.";
        enviarCorreo(dataMessage);
        valorDatosExportado.value = "";
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

  loadData();
};
const agregarComentario = async () => {
  mostrarConfirm.value = false;
  FilaDetalle.value.campomodificador = "--";
  FilaDetalle.value.valoranterior = `--`;
  FilaDetalle.value.valornuevo = "--";
  FilaDetalle.value.tiquete = Fila.value.id;
  FilaDetalle.value.operador = idusuario;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  FilaDetalle.value.estado = true;
  // agregar saltos de linea al campo Comentarios
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  await services
    .postDetallesTiquetes(FilaDetalle.value)
    .then((response) => {
      mostrarSolucionarTiquetes.value = false;
      $q.notify({
        type: "positive",
        message: "Se agregó el detalle correctamente",
        timeout: 4000,
      });
      mensajeOperador();
      textSaltoLinea.value = "";
      valorDatosExportado.value = "";
    })
    .catch((error) => {
      $q.notify({
        type: "negative",
        message: "Error, complete todos los campos",
        timeout: 4000,
      });
    });
  getDetalleTiquete();
};

const mensajeOperador = async (accion) => {
  const data = {};
  data.email = store.generalData.usuario.filter(
    (p) => p.id == Fila.value.asignado
  )[0].correo;
  data.cliente = store.generalData.usuario.filter(
    (p) => p.id == Fila.value.asignado
  )[0].nombre;
  servicesEmail.correoOperador(data, Fila.value.id);
};
const mensajeBack = async (accion) => {
  const data = {};
  const idback = Usuarios.value.filter(
    (p) => p.nivel == 1 && p.estado == true
  )[0].id;
  data.email = store.generalData.usuario.filter(
    (p) => p.id == idback
  )[0].correo;
  data.cliente = store.generalData.usuario.filter(
    (p) => p.id == idback
  )[0].nombre;
  servicesEmail.correoBackoffice(data, Fila.value.id);
};
const AgregarTicketStore = async () => {
  chatStore.confirModal = false;
  chatStore.indicePreguntaActual = 0;
  modalNuevoTicket.value = false;
  visible.value = true;
  // Fila.value.id = 0;
  delete Fila.value.id;
  delete Fila.value.created_at;
  delete Fila.value.numero;

  Fila.value.cliente = cliente.value[0].id;
  Fila.value.concesion = concesion.value[0].id;
  Fila.value.asignado = Usuarios.value.filter(
    (p) => p.nivel == 1 && p.estado == true
  )[0].id;

  // Ejemplo de uso
  Fila.value.asignacion = generarNumeroAleatorioUUID();
  Fila.value.privado = null;
  Fila.value.proceso = 1;
  Fila.value.estado = 1;
  Fila.value.peaje = chatStore.preguntas[0].respuesta.id;
  Fila.value.tipo = chatStore.preguntas[1].respuesta.id;
  Fila.value.subtipo = chatStore.preguntas[2].respuesta.id;
  Fila.value.prioridad = chatStore.preguntas[3].respuesta.id;
  Fila.value.evidencia = chatStore.preguntas[4].respuesta;
  Fila.value.audio = chatStore.preguntas[5].respuesta;
  Fila.value.observaciones = store.descryptptData(
    LocalStorage.getItem("transcript")
  );
  Fila.value.solicitud = 2;
  console.log(Fila.value);
  await services
    .postTiquetes(Fila.value)
    .then((response) => {
      if (response.status == 201 || response.status == 200) {
        services.postAsignaciones({
          usuario: Fila.value.asignado,
          asignacion: Fila.value.asignacion,
        });
        $q.notify({
          type: "positive",
          message: "Ticket Creado exitosamente",
          timeout: 4000,
        });
        dataMessage = {};
        dataMessage.estado = "Creado";
        dataMessage.mensaje1 =
          "La solicitud sera atendida por el equipo de soporte de";
        dataMessage.mensaje2 =
          "Sera informado por este medio y el aplicativo cuando se solucione la problematica.";
        enviarCorreo(dataMessage);
        mensajeBack();
        valorDatosExportado.value = "";
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

  loadData();
};
const enviarCorreo = async (data) => {
  const dominio = "https://uticket.cus.utraffic.co/";
  var accion = `Ticket ${data.estado} Exitosamente!`;
  var mensaje = `${data.mensaje1} <strong>Utraffic SAS.</strong><br> ${data.mensaje2}`;
  var plantilla = require("./PlantillaCorreo.html").default.toString();
  plantilla = plantilla.replace("${accion}", accion);
  plantilla = plantilla.replace("${mensaje}", mensaje);
  plantilla = plantilla.replace("${dominio}", dominio);

  //soporte@utraffic.co
  //#Utraffic2022**
  const data2 = {
    sender: {
      name: "Soporte Utraffic",
      email: "soporte@utraffic.co",
    },
    to: [
      {
        email: email,
        name: cliente.value[0].nombres,
      },
    ],
    subject: `Ticket ${data.estado}`,
    htmlContent: plantilla,
  };
  await services.postCorreo(data2);
};

// Genera un nuevo UUID

function generarNumeroAleatorioUUID() {
  const nuevoUuid = uuidv4();
  // console.log("Nuevo UUID:", nuevoUuid);

  // // Generar un número decimal entre 0 y 1
  // var numeroDecimal = Math.random();

  // // Multiplicar por 256 para obtener un número en el rango de 0 a 255
  // var numeroEnRango = numeroDecimal * 256;

  // // Redondear hacia abajo para obtener un número entero
  // var numeroEntero = Math.floor(numeroEnRango);

  // return numeroEntero;
  return nuevoUuid;
}

const formatDate = (value) => {
  const date = new Date(value);
  // return date.toLocaleDateString();  // solo la fecha DD/MM/YY
  return date.toLocaleString(); // DD/MM/YY, 00:00:00
};

const VerEvidencias = (row) => {
  imagen.value = row.evidencia;
  mostrarImagen.value = true;
};

//---------ordenar la tabla de forma descendente por id--------------
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
        case 7:
          label = "Devuelto";
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

      if (estado === 1 || estado === 5 || estado === 6 || estado == 7) {
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
  }
});

onMounted(async () => {
  await DatosGenerales();
  loadData();
});

//Procesamiento de componente comentario
const modalComentario = ref(false);
const detalleComentario = ref("");
function verMasComentario(comentario) {
  detalleComentario.value = comentario;
  modalComentario.value = true;
}

// //funciones para el grabado de notas de voz
function startStopRecording() {
  clearInterval(progressInterval);
  progressValue.value = 0;
  if (accion.value == "start") {
    color.value = "red";
    accion.value = "stop";
    startRecording();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioStream = stream;
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        recorder = new Recorder(audioContext, { numChannels: 1 });
        recorder.init(stream);

        startTime = Date.now();
        recorder.start();
        isRecording.value = true;

        // Actualizar la duración de grabación cada segundo
        setInterval(() => {
          recordingDuration.value = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);
      })
      .catch(function (err) {
        console.error("Error al acceder al micrófono: ", err);
      });
  } else if (accion.value == "stop") {
    stopRecording();
    accion.value = "play";
    if (recorder && isRecording.value) {
      color.value = "primary";
      recorder
        .stop()
        .then(function ({ blob }) {
          recordedAudio.value = URL.createObjectURL(blob);
          isRecording.value = false;
          recordingDuration.value = 0;
          convertToBase64();
          if (audioStream) {
            const tracks = audioStream.getTracks();
            tracks.forEach((track) => track.stop());
          }
        })
        .catch(function (err) {
          console.error("Error al detener la grabación: ", err);
        });
    }
  }
}

function convertToBase64() {
  if (recordedAudio.value) {
    const audioBlob = fetch(recordedAudio.value).then((response) =>
      response.blob()
    );
    audioBlob.then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        base64Audio.value = reader.result;
      };
      reader.readAsDataURL(blob);
    });
  }
}

function onPlay() {
  progressInterval = setInterval(() => {
    if (audioPlayer.value) {
      const currentTime = audioPlayer.value.currentTime;
      const duration = audioPlayer.value.duration;
      progressValue.value = (currentTime / duration) * 100;
    }
  }, 100);
}

function clearAudio() {
  transcript.value = "";
  clearInterval(progressInterval);
  progressValue.value = 0;
  accion.value = "start";
  recordedAudio.value = null;
  color.value = "primary";
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

//funciones para la transcripcion de la grabacion
let silenceTimeout;

function startRecording() {
  recognition = new webkitSpeechRecognition(); // Para navegadores basados en WebKit (Chrome, Safari)
  // recognition = new SpeechRecognition(); // Para navegadores compatibles con la especificación W3C

  recognition.lang = "es-ES"; // Establece el idioma del reconocimiento de voz
  recognition.continuous = true; // Habilita el reconocimiento continuo

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    transcript.value += lastResult[0].transcript;
  };

  recognition.onend = () => {
    // Reiniciar la grabación después de 5 segundos de inactividad
    silenceTimeout = setTimeout(() => {
      startRecording();
    }, 500);
    // setTimeout(() => {
    //   startRecording();
    // }, 500);
  };

  recognition.start();
  isRecording2.value = true;
}

function stopRecording() {
  if (recognition) {
    recognition.onend = null; // Eliminar el evento onend para evitar que se reinicie la grabación
    recognition.stop();
    clearTimeout(silenceTimeout);
    isRecording2.value = false;
  }
}

const ordenarPorFecha = (a, b) => {
  tiquetesDetalles.value.sort((a, b) => {
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

.head-styles {
  background-color: white !important;
  padding: 10px !important;
  margin-right: 10px !important;
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
