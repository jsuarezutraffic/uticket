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
        :sort-method="customSort()"
        :sort-method-props="{ sortBy, sortDesc }"
        :visible-columns="[
          'id',
          'created_at',
          'cliente',
          'concesion',
          'peaje',
          'solicitud',
          // 'observaciones',
          'estado',
          'prioridad',
          'tipo',
          'subtipo',
          'finalizar',
          'devuelto',
          'eliminar',
        ]"
      >
        <template v-slot:top>
          <q-btn
            class="q-ma-xs"
            color="secondary"
            size="md"
            @click="
              Fila = {};
              modalNuevoTicket = true;
              clearAudio();
            "
            >Nuevo Ticket
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
                {{ Subtipos.filter((p) => p.id == col.value)[0].descripcion }}
              </div>
              <div v-else-if="col.name == 'finalizar'">
                <q-btn
                  :disabled="
                    Estados.filter((p) => p.id == props.row.estado)[0]
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
                    Estados.filter((p) => p.id == props.row.estado)[0]
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
                  "
                  >Devolver
                </q-btn>
              </div>
              <div v-else-if="col.name == 'eliminar'">
                <q-btn
                  :disabled="
                    Estados.filter((p) => p.id == props.row.estado)[0]
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
              <div v-else-if="col.name == 'observaciones'">
                <div v-if="col.value == null || col.value == ''">
                  {{ col.value }}N/A
                </div>
                <div v-else>
                  <div
                    v-if="
                      expanded2[props.row.id] ||
                      props.row.observaciones.length <= 50
                    "
                  >
                    <div v-html="col.value"></div>
                  </div>
                  <div v-if="props.row.observaciones.length > 50">
                    <a
                      v-if="
                        props.row.observaciones.length > 50 &&
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
  >
    <q-card style="max-width: 100%; width: 70%">
      <q-form autofocus @submit.prevent="AgregarTicket()">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            Agregar Nuevo Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div class="col-md-4 col-sm-6 col-xs-12">
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
                <div class="col-md-4 col-sm-4 col-xs-12">
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
                <div class="col-md-3 col-sm-4 col-xs-12">
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
                <div class="col-md-3 col-sm-4 col-xs-12">
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
                    @update:model-value="SubTipoSeleccion"
                    :rules="rules"
                    lazy-rules
                  />
                </div>
                <div
                  v-if="EquiposOptions.length > 0"
                  class="col-md-3 col-sm-4 col-xs-12"
                >
                  <q-select
                    label="Equipo"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="Fila.equipo"
                    dense
                    :options="EquiposOptions"
                    option-label="descripcion"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
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
                      v-if="accion == 'play'"
                      @click="startAudio"
                      outline
                      round
                      color="green"
                      icon="play_arrow"
                    />
                    <q-btn
                      v-if="accion != 'play'"
                      @click="startStopRecording"
                      outline
                      round
                      :color="color"
                      icon="mic"
                    />
                  </q-circular-progress>
                  <div v-if="isRecording">
                    Duración de la grabación: {{ recordingDuration }}
                  </div>
                  <q-btn
                    v-if="accion == 'play'"
                    @click="clearAudio"
                    outline
                    round
                    color="red"
                    icon="delete"
                  />
                  <audio
                    ref="audioPlayer"
                    :src="recordedAudio"
                    @play="onPlay"
                    @pause="onPause"
                  ></audio>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>
                  <InputTextJump
                    @text-con-salto-linea="actualizarTextExport"
                    :texto="transcript"
                  ></InputTextJump>
                </div>

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
          <div class="col-2">
            <q-btn
              flat
              label="Copiar Ticket"
              style="display: flex; margin-left: auto"
              @click="modalNuevoTicket = true"
            />
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
                        <div class="col-md-3 col-sm-3 col-xs-12">
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
                        <div class="col-md-3 col-sm-3 col-xs-12">
                          <q-select
                            readonly
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
                        <div class="col-md-3 col-sm-3 col-xs-12 container">
                          <q-btn
                            label="Ver evidencias"
                            color="grey"
                            @click="VerEvidencias(Fila)"
                          />
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
                            readonly
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

        <div class="row justify-center">
          <div class="col-auto">
            <q-card flat>
              <div class="q-pa-md" v-if="TablaDetalles">
                <q-table
                  :loading="visible"
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
                    // 'adjunto_url',
                    'verevidencias',
                  ]"
                >
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
                              Usuarios.filter((p) => p.id == col.value)
                                .length == 0
                            "
                          >
                            {{ col.value }}
                          </div>
                          <div v-else>
                            {{
                              Usuarios.filter((p) => p.id == col.value)[0]
                                .nombre
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
                          <div v-if="col.value == null">{{ col.value }}</div>
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
</template>

<script setup>
import { defineComponent, ref, onMounted, watchEffect, onUnmounted } from "vue";
import { LocalStorage, date } from "quasar";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import FileInput from "src/components/FileImage.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import Recorder from "recorder-js";
import axios from "axios";

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
    sortable: false,
  },
  {
    name: "devuelto",
    align: "left",
    label: "",
    field: "devuelto",
    sortable: false,
  },
  {
    name: "eliminar",
    align: "left",
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
  Fila.value = row;
  modalDetalles.value = true;
  getDetalleTiquete();
};

const getDetalleTiquete = async () => {
  visible.value = true;
  // Fila.value.id = FilaFinalizar.value.id;
  await api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&estado=eq.true&select=*`)
    .then((response) => {
      tiquetesDetalles.value = response.data;
      TablaDetalles.value = true;
    });
  visible.value = false;
};
const loadData = async () => {
  var eliminado = Estados.value.filter((p) => p.descripcion == "Completado")[0]
    .id;
  await api
    .get(
      `tiquete?cliente=eq.${cliente.value[0].id}&estado=neq.${eliminado}&select=*`
    )
    .then((response) => {
      tiquetes.value = response.data;
    });
  visible.value = false;
};

const DatosGenerales = async () => {
  visible.value = true;
  await api
    .get(`cliente?usuario=eq.` + idusuario + `&select=*`)
    .then((response) => {
      cliente.value = response.data;
    });

  await api
    .get("concesion?id=eq." + cliente.value[0].concesion + "&select=*")
    .then((response) => {
      concesion.value = response.data;
    });

  await api
    .get("peaje?concesion=eq." + concesion.value[0].id + "&select=*")
    .then((response) => {
      peajes.value = response.data;
    });

  await api.get("tipo?select=*").then((response) => {
    Tipos.value = response.data;
  });

  await api.get("subtipo?select=*").then((response) => {
    Subtipos.value = response.data;
  });
  await api.get("equipo?select=*").then((response) => {
    Equipos.value = response.data;
  });

  await api.get("prioridad?select=*").then((response) => {
    Prioridades.value = response.data;
    Prioridades.value.sort(function (b, a) {
      return b.orden - a.orden;
    });
  });

  await api.get("estado?select=*").then((response) => {
    Estados.value = response.data;
  });

  await api.get("solicitud?select=*").then((response) => {
    Solicitudes.value = response.data;
  });

  await api.get("proceso?select=*").then((response) => {
    Procesos.value = response.data;
    table.value = true;
    visible.value = false;
  });

  await api.get("usuarios?select=*").then((response) => {
    Usuarios.value = response.data;
  });
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
        Estados.value.filter((p) => p.id == FilaFinalizar.value.estado)[0]
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
        )[0].id;
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
      )[0].id;

      break;
    case "eliminar":
      dataMessage.estado = "Eliminado";
      dataMessage.mensaje1 = "La solicitud fue eliminada satisfactoriamente";
      dataMessage.mensaje2 = "";
      FilaDetalle.value.valornuevo = "Eliminado";
      FilaDetalle.value.valoranterior = "Iniciado";
      FilaFinalizar.value.estado = Estados.value.filter(
        (p) => p.descripcion == "Completado"
      )[0].id;

      break;
  }

  modalConfirm.value = false;
  modalDevolverTiquete.value = false;

  FilaDetalle.value.campomodificador = "Estado";
  FilaDetalle.value.tiquete = FilaFinalizar.value.id;
  FilaDetalle.value.operador = FilaFinalizar.value.asignado;

  // se actualiza el campo del tiquete que se esta modificando
  FilaDetalle.value.estado = Estados.value.filter(
    (p) => p.id == FilaFinalizar.value.estado
  )[0].vercliente;
  // agregar saltos de linea al campo Comentarios
  FilaDetalle.value.comentarios = textSaltoLinea.value;
  FilaDetalle.value.evidencia = valorDatosExportado.value;
  await api
    .put("tiquete?id=eq." + FilaFinalizar.value.id, FilaFinalizar.value)
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
  await api
    .post("detalletiquete", FilaDetalle.value)
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
const TipoSeleccion = (value) => {
  SubtipoOptions.value = Subtipos.value.filter((tipo) => tipo.tipo == value);
  Fila.value.subtipo = null;
};

const SubTipoSeleccion = (value) => {
  EquiposOptions.value = Equipos.value.filter(
    (equipo) => equipo.subtipo == value
  );
  Fila.value.equipo = null;
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
  Fila.value.observaciones = textSaltoLinea.value;
  if (Fila.value.solicitud == 1 || Fila.value.solicitud == 3) {
    Fila.value.prioridad = 1;
  } else if (Fila.value.solicitud == 2) {
    Fila.value.prioridad = 2;
  } else {
    Fila.value.prioridad = 3;
  }
  Fila.value.audio = base64Audio.value;
  console.log(Fila.value);
  await api
    .post("tiquete", Fila.value)
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

const enviarCorreo = async (data) => {
  const dominio = "https://uticket.cus.utraffic.co/";
  const apiKey =
    "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";
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

  await axios
    .post("https://api.brevo.com/v3/smtp/email", data2, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    })
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

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

setInterval(() => {
  loadData();
}, 60000);
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
