<template>
  <div class="q-pa-md">
    <TransitionGroup>
      <q-table
        :loading="visible"
        v-if="table"
        title="Tickets"
        virtual-scroll
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
        :sort-method="customSort()"
        :sort-method-props="{ sortBy, sortDesc }"
        :visible-columns="showMaintable.showColums"
        rows-per-page-label="Registro por página"
        loading-label="Cargando..."
        no-data-label="No existen datos para mostrar"
      >
        <template v-slot:top>
          <div style="font-weight: bold" class="q-table__title">Tickets</div>
          <q-btn
            v-if="showMaintable.showGraficas"
            @click="volverDashboard('dashboard')"
            outline
            round
            class="q-mx-md"
            color="tertiary"
            icon="arrow_back"
            size="md"
          >
          </q-btn>
          <q-space />

          <slot name="reload"></slot>
          <q-btn
            @click="modalNuevoTicket = true"
            outline
            round
            class="q-ma-xs"
            color="tertiary"
            size="md"
            icon="add"
          >
          </q-btn>

          <q-btn
            v-if="!showMaintable.showGraficas"
            @click="volverDashboard('tabla')"
            outline
            class="q-ma-xs"
            color="tertiary"
            size="md"
            >Tabla Tickets
          </q-btn>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
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
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <!--  -->
              <div v-if="col.name == 'cliente'">
                {{ cliente.filter((p) => p.id == col.value)[0].nombres }}
              </div>

              <div v-else-if="col.name == 'concesion'">
                {{
                  store.generalData.concesion.filter(
                    (p) => p.id == col.value
                  )[0].nombre
                }}
              </div>
              <div v-else-if="col.name == 'peaje'">
                {{
                  store.generalData.peaje.filter((p) => p.id == col.value)[0]
                    .nombre
                }}
              </div>
              <div v-else-if="col.name == 'estado'">
                <q-badge
                  :color="
                    store.generalData.estado.filter(
                      (p) => p.orden == col.value
                    )[0].color
                  "
                >
                  {{
                    store.generalData.estado.filter(
                      (p) => p.orden == col.value
                    )[0].descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'prioridad'">
                <q-badge
                  :color="
                    store.generalData.prioridad.filter(
                      (p) => p.orden == col.value
                    )[0].color
                  "
                >
                  {{
                    store.generalData.prioridad.filter(
                      (p) => p.orden == col.value
                    )[0].descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'tipo'">
                <div v-if="col.value != null">
                  {{
                    store.generalData.tipo.filter((p) => p.id == col.value)[0]
                      .descripcion
                  }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'subtipo'">
                <div v-if="col.value != null">
                  {{
                    store.generalData.subtipo.filter(
                      (p) => p.id == col.value
                    )[0].descripcion
                  }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'equipo'">
                <div v-if="col.value != null">
                  {{
                    store.generalData.equipo.filter((p) => p.id == col.value)[0]
                      .descripcion
                  }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'solicitud'">
                {{
                  store.generalData.solicitud.filter(
                    (p) => p.orden == col.value
                  )[0].nombre
                }}
              </div>
              <div v-else-if="col.name == 'created_at'">
                {{ col.value }}
              </div>
              <div v-else-if="col.name == 'asignado'">
                {{ users.filter((p) => p.id == col.value)[0].nombre }}
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
                <div v-if="col.value == null">
                  {{ col.value }}
                </div>
                <div v-else>
                  <div>
                    <a
                      v-if="props.row.comentarios.length > 0"
                      href="#"
                      class="q-link text-primary"
                      @click="verMasComentario(props.row.id)"
                    >
                      Ver más
                    </a>
                  </div>
                </div>
              </div>

              <div
                v-else-if="
                  col.name == 'tiempo' &&
                  !selected.length > 0 &&
                  (props.row.estado == 1 ||
                    props.row.estado == 2 ||
                    props.row.estado == 3)
                "
              >
                <!-- verificar si el tiempo que hace falta es menor a una hora -->
                <q-badge color="red" v-if="props.row.tiempo < 60 * 60">
                  <div v-show="false">{{ mensajeAviso(props.row) }}</div>
                  - {{ props.row.contador }}
                </q-badge>
                <q-badge color="green" v-else>
                  {{ props.row.contador }}
                </q-badge>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </TransitionGroup>

    <!-- <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    /> -->
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
              @click="selected = []"
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
                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                        <div class="col-md-4 col-sm-6 col-xs-12">
                          <q-select
                            readonly
                            label="Telefono"
                            transition-show="scale"
                            transition-hide="scale"
                            outlined
                            v-model="Fila.cliente"
                            dense
                            :options="cliente"
                            option-label="telefono"
                            option-value="id"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                            @update:model-value="TipoSeleccion"
                            map-options
                            class="q-pa-md"
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
                          <q-select
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
                            @update:model-value="SubTipoSeleccion"
                            map-options
                            class="q-pa-md"
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                            emit-value
                            map-options
                            class="q-pa-md"
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                            option-value="orden"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-4 col-sm-6 col-xs-12">
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
                            option-value="orden"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
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

                        <div class="col-md-3 col-sm-4 col-xs-12">
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
                            option-value="orden"
                            class="q-pa-md"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-3 col-sm-4 col-xs-6 container">
                          <q-btn
                            label="Ver evidencias"
                            color="grey"
                            @click="VerEvidencias(selected[0])"
                          />
                        </div>
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
                  title="Detalles Tickets"
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
                  :sort-method="ordenarPorFecha()"
                  :sort-method-props="{ sortBy, sortDesc }"
                  :visible-columns="[
                    'operador',
                    'campomodificador',
                    'valoranterior',
                    'valornuevo',
                    'observaciones',
                    'comentarios',
                    'created_at',
                    'metodoconsulta',
                    'consultado',
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
                      @click="
                        titleSolution = 'Agregar Detalle a';
                        AccionTiquete('AgregarDetalle');
                      "
                      outline
                      to="/"
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
                              store.generalData.usuarios.filter(
                                (p) => p.id == col.value
                              ).length > 0
                            "
                          >
                            {{
                              store.generalData.usuarios.filter(
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
                              store.generalData.usuarios.filter(
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
                                href="#"
                                class="q-link text-primary"
                                @click="verMasComentario(col.value)"
                              >
                                Ver más
                              </a>
                            </div>
                          </div>
                        </div>
                        <div v-else-if="col.name == 'created_at'">
                          {{ col.value }}
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
                          <div
                            v-if="
                              metodoconsulta.filter((p) => p.id == col.value)
                                .length == 0
                            "
                          >
                            {{ col.value }}
                          </div>
                          <div v-else>
                            {{
                              metodoconsulta.filter((p) => p.id == col.value)[0]
                                .descripcion
                            }}
                          </div>
                        </div>
                        <div v-else-if="col.name == 'consultado'">
                          <div
                            v-if="
                              contactos.filter((p) => p.id == col.value)
                                .length == 0
                            "
                          >
                            {{ col.value }}
                          </div>
                          <div v-else>
                            {{
                              contactos.filter((p) => p.id == col.value)[0]
                                .nombres
                            }}
                          </div>
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
              label="Solucionar Ticket"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="
                titleSolution = 'Solucionar';
                AccionTiquete('SolucionarTicket');
              "
            />
            <q-btn
              :disable="
                Estados.filter((p) => p.orden == Fila.estado)[0].descripcion ==
                'Cerrado'
              "
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
                    option-value="orden"
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
                    option-value="orden"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <!-- {{ users.filter((p) => p.id == Fila.asignado) }} -->
                <div class="col-md-4 col-sm-4 col-xs-12">
                  <q-input
                    readonly
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
                    outlined
                    v-model="next.nivel"
                    dense
                    :options="Procesos"
                    option-label="descripcion"
                    option-value="orden"
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
                  <FileInput
                    @datos-exportado-cambiado="actualizarValorDatosExportado"
                  ></FileInput>
                  <InputTextJump
                    @text-con-salto-linea="actualizarTextExport"
                    :variable="variable"
                  ></InputTextJump>
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
      <q-form autofocus @submit.prevent="GestionTiquete(accion)">
        <q-card-section>
          <div style="font-size: 18px; font-weight: bold; align-self: center">
            {{ titleSolution }} Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div
                  class="col-md-3 col-sm-3 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-select
                    label="Metodo de Consulta"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="FilaDetalle.metodoconsulta"
                    dense
                    :options="metodoconsulta"
                    option-label="descripcion"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <div
                  class="col-md-4 col-sm-4 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-select
                    label="Persona Consultada"
                    transition-show="scale"
                    transition-hide="scale"
                    use-input
                    outlined
                    dense
                    class="q-pa-md"
                    v-model="FilaDetalle.consultado"
                    :options="contactos"
                    option-label="nombres"
                    option-value="id"
                    input-debounce="0"
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
                <div
                  class="col-md-3 col-sm-3 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-select
                    readonly
                    label="Telefono Persona Consultada"
                    transition-show="scale"
                    transition-hide="scale"
                    outlined
                    v-model="FilaDetalle.consultado"
                    dense
                    :options="contactos"
                    option-label="telefono"
                    option-value="id"
                    class="q-pa-md"
                    emit-value
                    map-options
                  />
                </div>
                <div
                  class="col-md-2 col-sm-2 col-xs-12 container2"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="person_add"
                    @click="mostrarAddPersonaContacto = true"
                  />
                </div>
                <div
                  class="col-md-4 col-sm-4 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-input
                    readonly
                    outlined
                    dense
                    class="q-pa-md"
                    v-model="
                      cliente.filter((p) => p.id === Fila.cliente)[0].nombres
                    "
                    type="text"
                    label="Nombre Cliente"
                  />
                </div>
                <div
                  class="col-md-4 col-sm-4 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-input
                    readonly
                    outlined
                    dense
                    class="q-pa-md"
                    v-model="
                      cliente.filter((p) => p.id === Fila.cliente)[0].telefono
                    "
                    type="text"
                    label="Telefono Cliente"
                  />
                </div>
                <div class="col-md-4 col-sm-4 col-xs-6">
                  <q-toggle
                    v-if="accion != 'CerrarTicket'"
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
            no-caps />
          <q-btn
            v-if="accion != 'CerrarTicket'"
            flat
            :label="'Cerrar'"
            v-close-popup
            text-color="dark"
            no-caps />
          <q-btn
            v-if="accion == 'CerrarTicket'"
            flat
            color="primary"
            :label="'Aceptar'"
            type="submit"
            @click="accion = 'CerrarTicket'"
            text-color="dark"
            no-caps
        /></q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- Modal de Add Persona de contacto -->

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
            v-if="accion == 'CerrarTicket' || accion == 'AgregarDetalle'"
            label="No"
            v-close-popup
            color="negative"
          />
          <q-btn
            class="q-mx-md"
            v-if="accion === 'CerrarTicket' || accion == 'AgregarDetalle'"
            label="Si"
            color="primary"
            @click="GestionTiquete('ConfimarCerrar')"
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

  <!-- Modal de imagen -->
  <q-dialog v-model="mostrarImagen">
    <VerImagenArray :datoProp="imagen"></VerImagenArray>
  </q-dialog>

  <q-dialog v-model="modalComentario">
    <q-card style="max-width: 100%; width: 70%"
      ><q-editor
        min-height="3rem"
        label="Observaciones"
        class="q-pa-md"
        v-model="detalleComentario"
        :toolbar="false"
        readonly
    /></q-card>
  </q-dialog>

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
                  <q-select
                    outlined
                    v-model="Fila.concesion"
                    :options="concesion"
                    option-label="nombre"
                    option-value="id"
                    label="Concesion"
                    dense
                    class="q-pa-md"
                    emit-value
                    :rules="rules"
                    lazy-rules
                    map-options
                    @update:model-value="ConcesionSeleccion"
                  ></q-select>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <q-select
                    outlined
                    v-model="Fila.peaje"
                    :options="PeajeOptions"
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
                    outlined
                    v-model="Fila.cliente"
                    :options="ClienteOptions"
                    option-label="nombres"
                    option-value="id"
                    label="Cliente"
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
                    :options="store.generalData.solicitud"
                    option-label="nombre"
                    option-value="orden"
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
                    option-value="orden"
                    class="q-pa-md"
                    emit-value
                    map-options
                    :rules="rules"
                    lazy-rules
                  />
                </div>
                <!-- <div class="col-md-3 col-sm-12 col-xs-12">
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
                </div> -->
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
</template>

<script setup>
/*eslint-disable */
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  toRefs,
} from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { mostrarMensajes } from "boot/global";
import { supabase } from "src/supabase";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
import FileInput from "src/components/FileImage.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import axios from "axios";
import * as services from "../services/services.js";
import * as servicesEmail from "../services/serviceEmail.js";
//variables para el grabado de notas de voz
const emit = defineEmits(["cambiarEstadoTabla"]);
const variable = ref(false);

const isRecording = ref(false);
const progressValue = ref(0);
let recorder;
let progressInterval;
const audioPlayer = ref(null);

const props = defineProps(["showMaintable", "dataTiquetes", "datosGenerales"]);
let { showMaintable, dataTiquetes, datosGenerales } = toRefs(props);

//supabase
const valorDatosExportado = ref("");
function actualizarValorDatosExportado(nuevoValor) {
  valorDatosExportado.value = nuevoValor;
}

const textSaltoLinea = ref("");
function actualizarTextExport(nuevoValor) {
  textSaltoLinea.value = nuevoValor;
}
let $q = useQuasar();
const idusuario = LocalStorage.getItem("IdUsuario");
const selected = ref([]);
const selectedDetalle = ref([]);
const store = useMainStore();
const configStore = useConfigStore();
const tiquetesDetalles = ref([]);
const EquiposOptions = ref([]);
const SubtipoOptions = ref([]);
const PeajeOptions = ref([]);
const ClienteOptions = ref([]);
const tiquetes = ref([]);
const Correos = ref(datosGenerales.value.correos);
const users = ref(datosGenerales.value.users);
const cliente = ref(datosGenerales.value.cliente);
const concesion = ref(store.generalData.concesion);
const peajes = ref(store.generalData.peaje);
const Tipos = ref(store.generalData.tipo);
const Subtipos = ref(store.generalData.subtipo);
const Equipos = ref(store.generalData.equipo);
const Prioridades = ref(store.generalData.prioridad);
const Estados = ref(store.generalData.estado);
const Procesos = ref(store.generalData.proceso);
const solicitudes = ref(store.generalData.solicitud);
const metodoconsulta = ref(store.generalData.metodoconsulta);
const contactos = ref([]);
const visible = ref(false);
const imagen = ref("");
const disable = ref(false);
const oldProridad = ref(null);
const mostrarModal = ref(false);
const mostrarConfirm = ref(false);
const mostrarAsignarTiquetes = ref(false);
const mostrarSolucionarTiquetes = ref(false);
const mostrarAddPersonaContacto = ref(false);
const titleSolution = ref("");
const mostrarImagen = ref(false);
const accion = ref("");
const mensaje = ref("");
const Fila = ref({});
const FilaTemporal = ref({});
const FilaDetalle = ref({});
const FilaContacto = ref({});
const tableRef = ref(null);
const expanded = ref([]);
const table = ref(true);
const TablaDetalles = ref(false);
const verDetalleCliente = ref(false);
const modalNuevoTicket = ref(false);
const next = ref({
  nivel: null,
  operador: null,
  prioridad: null,
});
const pagination = ref({
  rowsPerPage: 8,
});
const selectRule = [(value) => !!value || "Este campo es obligatorio"];
const inputRules = [
  (val) => (val && val.length > 0) || "Por favor llenar el campo",
];
const columns = [
  {
    name: "id",
    required: true,
    label: "Ticket",
    align: "center",
    field: "id",
    sortable: true,
    // format: (val, row) => `${val}%`,
  },
  {
    name: "created_at",
    align: "left",
    label: "Creacion",
    field: "created_at",
    sortable: true,
    format: (val) => `${formatDate(val)}`,
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
    align: "center",
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
    name: "equipo",
    align: "left",
    label: "Equipo",
    field: "equipo",
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
    name: "tiempo",
    align: "center",
    label: "Tiempo",
    field: "tiempo",
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
    format: (val) => `${formatDate(val)}`,
  },
  {
    name: "metodoconsulta",
    required: false,
    label: "Metodo Consulta",
    align: "left",
    field: "metodoconsulta",
    sortable: true,
  },
  {
    name: "consultado",
    required: false,
    label: "Persona Consultada",
    align: "left",
    field: "consultado",
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
// Metodos

const clickRow = (row) => {
  Fila.value = row;
  // Fila.value.equipo = null;
  FilaTemporal.value.tipo = row.tipo;
  FilaTemporal.value.subtipo = row.subtipo;
  FilaTemporal.value.equipo = row.equipo;
  oldProridad.value = row.prioridad;
  next.value.prioridad = Fila.value.prioridad;

  EquiposOptions.value = Equipos.value.filter(
    (equipo) => equipo.subtipo == row.subtipo
  );
  SubtipoOptions.value = Subtipos.value.filter((tipo) => tipo.tipo == row.tipo);

  getDetalleTiquete();
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
const ConcesionSeleccion = (value) => {
  PeajeOptions.value = peajes.value.filter((x) => x.concesion == value);
  ClienteOptions.value = cliente.value.filter((x) => x.concesion == value);
  Fila.value.peaje = null;
};
const clickRowDetalle = (row) => {};

const GestionTiquete = async (accionValue) => {
  delete Fila.value["contador"];
  delete Fila.value["tiempo"];
  if (accion.value == "SolucionarTicket") {
    mostrarSolucionarTiquetes.value = false;
    // JSON de tabla de detalles, Se modifican los estados de acuerdo a la base de datos, basandose en la descripcion
    // y no el el id -----PARA LA SOLUCION SOLO CAMBIA EL CAMPO ##SOLUCIONAR##
    if (FilaTemporal.value.tipo != Fila.value.tipo) {
      FilaDetalle.value.campomodificador =
        "- Estado \n- Tipo \n- Subtipo \n- Equipo";
      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0].descripcion
      }\n- ${
        Tipos.value.filter((p) => p.id == FilaTemporal.value.tipo)[0]
          .descripcion
      }\n- ${
        Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
          .descripcion
      }\n- ${
        FilaTemporal.value.equipo != null
          ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
              .descripcion
          : null
      }
        `;
      FilaDetalle.value.valornuevo = `- Solucionado\n- ${
        Tipos.value.filter((p) => p.id == Fila.value.tipo)[0].descripcion
      }\n- ${
        Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0].descripcion
      }\n- ${
        Fila.value.equipo != null
          ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
              .descripcion
          : null
      }`;
    } else if (FilaTemporal.value.subtipo != Fila.value.subtipo) {
      FilaDetalle.value.campomodificador = "- Estado \n- Subtipo \n- Equipo";
      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0].descripcion
      }\n- ${
        Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
          .descripcion
      }\n- ${
        FilaTemporal.value.equipo != null
          ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
              .descripcion
          : null
      }
        `;
      FilaDetalle.value.valornuevo = `- Solucionado\n- ${
        Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0].descripcion
      }\n- ${
        Fila.value.equipo != null
          ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
              .descripcion
          : null
      }`;
    } else if (FilaTemporal.value.equipo != Fila.value.equipo) {
      FilaDetalle.value.campomodificador = "- Estado  \n- Equipo";
      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0].descripcion
      }\n- ${
        FilaTemporal.value.equipo != null
          ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
              .descripcion
          : null
      }
        `;
      FilaDetalle.value.valornuevo = `- Solucionado\n- ${
        Fila.value.equipo != null
          ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
              .descripcion
          : null
      }`;
    } else {
      FilaDetalle.value.campomodificador = "- Estado ";
      FilaDetalle.value.valoranterior = `- ${
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0].descripcion
      }`;
      FilaDetalle.value.valornuevo = `- Solucionado`;
    }
    FilaDetalle.value.tiquete = Fila.value.id;
    FilaDetalle.value.operador = idusuario;
    // se actualiza el campo del tiquete que se esta modificando
    Fila.value.estado = Estados.value.filter(
      (p) => p.descripcion == "Solucionado"
    )[0].orden;
    // FilaDetalle.value.estado = Estados.value.filter(
    //   (p) => p.orden == Fila.value.estado
    // )[0].vercliente;

    FilaDetalle.value.estado = verDetalleCliente.value;
    // agregar saltos de linea al campo Comentarios
    FilaDetalle.value.comentarios = textSaltoLinea.value;
    FilaDetalle.value.evidencia = valorDatosExportado.value;
    // post a la tabla de detalles tiquetes------------------
    await services
      .postDetallesTiquetes(FilaDetalle.value)
      .then((response) => {
        delete Fila.value["contador"];
        delete Fila.value["tiempo"];
        services
          .patchTiquetes(`id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            servicesEmail.enviarNotify();
            if (verDetalleCliente.value) {
              mensajeCliente("actualizacion");
            }
            variable.value = !variable.value;
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se solucionó correctamente",
            });
            valorDatosExportado.value = "";
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
    mostrarAsignarTiquetes.value = false;
    if (oldProridad.value != next.value.prioridad) {
      if (FilaTemporal.value.tipo != Fila.value.tipo) {
        FilaDetalle.value.campomodificador =
          "- Estado \n- Nivel \n- Prioridad \n- Tipo \n- Subtipo \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == oldProridad.value)[0]
            .descripcion
        }\n- ${
          Tipos.value.filter((p) => p.id == FilaTemporal.value.tipo)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == next.value.prioridad)[0]
            .descripcion
        }\n- ${
          Tipos.value.filter((p) => p.id == Fila.value.tipo)[0].descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else if (FilaTemporal.value.subtipo != Fila.value.subtipo) {
        FilaDetalle.value.campomodificador =
          "- Estado \n- Nivel \n- Prioridad \n- Subtipo \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == oldProridad.value)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == next.value.prioridad)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else if (FilaTemporal.value.equipo != Fila.value.equipo) {
        FilaDetalle.value.campomodificador =
          "- Estado \n- Nivel \n- Prioridad \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == oldProridad.value)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == next.value.prioridad)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else {
        FilaDetalle.value.campomodificador = "- Estado \n- Nivel \n- Prioridad";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == oldProridad.value)[0]
            .descripcion
        }`;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Prioridades.value.filter((p) => p.orden == next.value.prioridad)[0]
            .descripcion
        }`;
      }
    } else {
      if (FilaTemporal.value.tipo != Fila.value.tipo) {
        FilaDetalle.value.campomodificador =
          "- Estado \n- Nivel \n- Tipo \n- Subtipo \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Tipos.value.filter((p) => p.id == FilaTemporal.value.tipo)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Tipos.value.filter((p) => p.id == Fila.value.tipo)[0].descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else if (FilaTemporal.value.subtipo != Fila.value.subtipo) {
        FilaDetalle.value.campomodificador =
          "- Estado \n- Nivel \n- Subtipo \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == FilaTemporal.value.subtipo)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Subtipos.value.filter((p) => p.id == Fila.value.subtipo)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else if (FilaTemporal.value.equipo != Fila.value.equipo) {
        FilaDetalle.value.campomodificador = "- Estado \n- Nivel \n- Equipo";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }\n- ${
          FilaTemporal.value.equipo != null
            ? Equipos.value.filter((p) => p.id == FilaTemporal.value.equipo)[0]
                .descripcion
            : null
        }
        `;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }\n- ${
          Fila.value.equipo != null
            ? Equipos.value.filter((p) => p.id == Fila.value.equipo)[0]
                .descripcion
            : null
        }`;
      } else {
        FilaDetalle.value.campomodificador = "- Estado \n- Nivel ";
        FilaDetalle.value.valoranterior = `- ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
        }\n- ${
          Procesos.value.filter((p) => p.orden == Fila.value.proceso)[0]
            .descripcion
        }`;
        FilaDetalle.value.valornuevo = `- Asignado\n- ${
          Procesos.value.filter((p) => p.orden == next.value.nivel)[0]
            .descripcion
        }`;
      }
    }
    FilaDetalle.value.tiquete = Fila.value.id;
    FilaDetalle.value.operador = idusuario;
    // se actualiza el campo del tiquete que se esta modificando
    Fila.value.estado = Estados.value.filter(
      (p) => p.descripcion == "Asignado"
    )[0].orden;
    FilaDetalle.value.estado = Estados.value.filter(
      (p) => p.orden == Fila.value.estado
    )[0].vercliente;
    Fila.value.proceso = next.value.nivel;
    Fila.value.asignado = next.value.operador;
    Fila.value.prioridad = next.value.prioridad;
    // agregar saltos de linea al campo Comentarios
    FilaDetalle.value.comentarios = textSaltoLinea.value;
    FilaDetalle.value.evidencia = valorDatosExportado.value;

    await services
      .postDetallesTiquetes(FilaDetalle.value)
      .then((response) => {
        delete Fila.value["contador"];
        delete Fila.value["tiempo"];
        services
          .patchTiquetes(`id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            servicesEmail.enviarNotify();
            mensajeAsignacion();
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se asignó correctamente al siguiete nivel",
            });

            valorDatosExportado.value = "";
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
      mostrarConfirm.value = false;
      FilaDetalle.value.campomodificador = "Estado";
      FilaDetalle.value.valoranterior = `${
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0].descripcion
      }`;
      FilaDetalle.value.valornuevo = "Cerrado";
      FilaDetalle.value.tiquete = Fila.value.id;
      FilaDetalle.value.operador = idusuario;
      FilaDetalle.value.evidencia = valorDatosExportado.value;
      // se actualiza el campo del tiquete que se esta modificando
      Fila.value.estado = Estados.value.filter(
        (p) => p.descripcion == "Cerrado"
      )[0].orden;
      // FilaDetalle.value.estado = Estados.value.filter(
      //   (p) => p.orden == Fila.value.estado
      // )[0].vercliente;
      FilaDetalle.value.estado = Estados.value.filter(
        (p) => p.orden == Fila.value.estado
      )[0].vercliente;
      Fila.value.asignado = users.value.filter(
        (p) => p.nivel == 1 && p.estado == true
      )[0].id;
      // agregar saltos de linea al campo Comentarios
      FilaDetalle.value.comentarios = textSaltoLinea.value;
      await services
        .postDetallesTiquetes(FilaDetalle.value)
        .then((response) => {
          delete Fila.value["contador"];
          delete Fila.value["tiempo"];
          services
            .patchTiquetes(`id=eq.${Fila.value.id}`, Fila.value)
            .then((response) => {
              mostrarSolucionarTiquetes.value = false;
              mostrarMensajes({
                tipomensaje: 1,
                mensaje: "El ticket se cerro correctamente",
              });
              mostrarModal.value = false;
              mensajeCliente("cerrado");
              valorDatosExportado.value = "";
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
  } else if (accion.value == "AgregarDetalle") {
    mostrarConfirm.value = true;
    if (accionValue == "ConfimarCerrar") {
      mostrarConfirm.value = false;
      FilaDetalle.value.campomodificador = "--";
      FilaDetalle.value.valoranterior = `--`;
      FilaDetalle.value.valornuevo = "--";
      FilaDetalle.value.tiquete = Fila.value.id;
      FilaDetalle.value.operador = idusuario;
      FilaDetalle.value.evidencia = valorDatosExportado.value;
      // se actualiza el campo del tiquete que se esta modificando
      // Fila.value.estado = Estados.value.filter(
      //   (p) => p.descripcion == "Cerrado"
      // )[0].orden;
      FilaDetalle.value.estado = verDetalleCliente.value;
      Fila.value.asignado = users.value.filter(
        (p) => p.nivel == 1 && p.estado == true
      )[0].id;
      // agregar saltos de linea al campo Comentarios
      FilaDetalle.value.comentarios = textSaltoLinea.value;
      await services
        .postDetallesTiquetes(FilaDetalle.value)
        .then((response) => {
          delete Fila.value["contador"];
          delete Fila.value["tiempo"];
          mostrarSolucionarTiquetes.value = false;
          mostrarMensajes({
            tipomensaje: 1,
            mensaje: "Se agregó el detalle correctamente",
          });
          mostrarModal.value = false;
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
      await getDetalleTiquete();
    }
  }
};
const AccionTiquete = (key) => {
  verDetalleCliente.value = false;
  accion.value = key;
  FilaDetalle.value = {};
  const ValidadorEstado = () => {
    if (
      key == "CerrarTicket" &&
      Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
        .descripcion != "Solucionado"
    ) {
      accion.value = "alerta";
      mensaje.value =
        "No se puede realizar esta acción. El ticket debe estar solucionado ";
      mostrarConfirm.value = true;
      return true;
    } else if (key == "SolucionarTicket" && Fila.value.asignado != idusuario) {
      accion.value = "alerta";
      mensaje.value = `El ticket no se encuentra asignado a usted`;
      mostrarConfirm.value = true;
      return true;
    } else if (
      Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
        .descripcion == "Solucionado" ||
      Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
        .descripcion == "Cerrado" ||
      Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
        .descripcion == "Finalizado"
    ) {
      if (
        key == "CerrarTicket" &&
        Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
          .descripcion == "Solucionado"
      ) {
        return false;
      } else {
        accion.value = "alerta";
        mensaje.value = `No se puede realizar esta acción. El ticket se encuentra ${
          Estados.value.filter((p) => p.orden == Fila.value.estado)[0]
            .descripcion
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
        Procesos.value.filter((p) => p.orden > Fila.value.proceso).length == 0
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
    case "AgregarDetalle":
      if (false) {
      } else {
        mensaje.value = "¿Está seguro de agregar el detalle al ticket?";
        mostrarSolucionarTiquetes.value = true;
      }
      break;

    default:
      break;
  }
};

const AgregarTicket = async () => {
  modalNuevoTicket.value = false;
  visible.value = true;
  delete Fila.value.id;
  delete Fila.value.created_at;
  delete Fila.value.numero;
  Fila.value.asignado = users.value.filter(
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
  Fila.value.audio = "";
  await services
    .postTiquetes(Fila.value)
    .then((response) => {
      if (response.status == 201 || response.status == 200) {
        $q.notify({
          type: "positive",
          message: "Ticket Creado exitosamente",
          timeout: 4000,
        });
        let dataMessage = {};
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
      console.log("error postTiquetes");
    });

  loadData();
};

//Manejo de data
const loadData = async () => {
  var filtroNivel = "";
  visible.value = true;
  let nivelUser = users.value.filter((p) => p.id == idusuario)[0].nivel;
  if (nivelUser === 3) {
    filtroNivel = `asignado=eq.${idusuario}&`;
  } else if (nivelUser === 1) {
    filtroNivel = ``;
  } else {
    $q.notify({
      type: "negative",
      message: `ESTED NO TIENE ACCESO A BACKOFFICE`,
      timeout: 4000,
    });
    visible.value = false;
  }
  switch (showMaintable.value.showFilter) {
    case "Solicitudes":
      tiquetes.value = dataTiquetes.value;
      break;
    case "Incidentes":
      tiquetes.value = dataTiquetes.value.filter((p) => p.solicitud == 1);
      break;
    case "Requerimiento":
      tiquetes.value = dataTiquetes.value.filter((p) => p.solicitud == 2);
      break;
    case "PQR":
      tiquetes.value = dataTiquetes.value.filter((p) => p.solicitud == 3);

      break;
  }
  visible.value = false;
  await updateTiempoRegresivo();
};

const getDetalleTiquete = async () => {
  visible.value = true;
  next.value.nivel = null;
  next.value.operador = null;
  await services
    .getDetalleTiquete(`tiquete=eq.${Fila.value.id}&`)
    .then((response) => {
      tiquetesDetalles.value = response.data;
      TablaDetalles.value = true;
      mostrarModal.value = true;
      visible.value = false;
    });
};

const DatosGenerales = async () => {
  visible.value = true;
  await CargarContactos();
  visible.value = false;
  table.value = true;
};
const CargarContactos = async () => {
  FilaContacto.value = {};
  FilaContacto.telefono = null;
  await services.getContactos("").then((response) => {
    contactos.value = response.data;
  });
};
const addPersonConsulta = async () => {
  mostrarAddPersonaContacto.value = false;
  if (FilaContacto.telefono != null) {
    FilaContacto.telefono = parseInt(FilaContacto.telefono);
  }
  await services.postContactos(FilaContacto.value);
  await CargarContactos();
};
// -------------------------------------------------------
// Funciones generales
//-------------------------------------------------------
let idTemporal = Correos.value;
const mensajeAviso = async (row) => {
  const estaPresente1 = idTemporal.includes(row.id);
  if (
    !estaPresente1 &&
    (row.estado == 1 || row.estado == 2 || row.estado == 3)
  ) {
    idTemporal.push(row.id);
    const data = {};
    data.email = users.value.filter((p) => p.id == row.asignado)[0].correo;
    data.cliente = users.value.filter((p) => p.id == row.asignado)[0].nombre;

    servicesEmail.correoAviso(data, Fila.value.id);
    var dataControlCorreo = {
      idtiquete: row.id,
      operador: row.asignado,
      asunto: `Recordatorio para solucionar ticket`,
    };

    services.postEnvioCorreos(dataControlCorreo);
  }
};

const mensajeAsignacion = async (row) => {
  const data = {};
  data.email = users.value.filter((p) => p.id == Fila.value.asignado)[0].correo;
  data.cliente = users.value.filter(
    (p) => p.id == Fila.value.asignado
  )[0].nombre;

  servicesEmail.correoAsignacion(data, Fila.value.id);
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
  data.email = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].correo;
  data.cliente = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].nombres;
  const data2 = {
    sender: {
      name: "Soporte Utraffic",
      email: "soporte@utraffic.co",
    },
    to: [
      {
        email: data.email,
        name: data.cliente,
      },
    ],
    subject: `Ticket ${data.estado}`,
    htmlContent: plantilla,
  };
  await services.postCorreo(data2);
};

const formatDate = (value) => {
  // return date.toLocaleDateString();  // solo la fecha DD/MM/YY
  const date = new Date(value);
  return date.toLocaleString(); // DD/MM/YY, 00:00:00
};

const VerEvidencias = (row) => {
  imagen.value = row.evidencia;
  mostrarImagen.value = true;
};

const calcularTiempoTiquete = (row) => {
  let diferenciaSegundos = 0;
  let tiempo = "";
  const fechaActual = new Date(); // Obtener la fecha actual
  const fechaString = row.created_at; // Tu fecha en formato 'yyyy-mm-ddThh'
  const fechaEspecifica = new Date(fechaString); // Convertir la cadena en un objeto Date
  const diferenciaEnMilisegundos = Math.abs(fechaEspecifica - fechaActual); // Restar las fechas
  //se pasa el tiempo de milisegundos a segundos
  diferenciaSegundos = diferenciaEnMilisegundos / 1000;
  switch (row.solicitud) {
    case 1:
      switch (row.prioridad) {
        case 1:
          row.tiempo = 60 * 60 * 2 - diferenciaSegundos;
          // row.tiempo = 2460 - diferenciaSegundos;
          tiempo = "2 horas";
          break;
        case 2:
          row.tiempo = 60 * 60 * 8 - diferenciaSegundos;
          tiempo = "8 horas";
          break;
        case 3:
          row.tiempo = 60 * 60 * 48 - diferenciaSegundos;
          tiempo = "48 horas";
          break;
      }
      break;
    case 2:
      switch (row.prioridad) {
        case 1:
          row.tiempo = 60 * 60 * 8 - diferenciaSegundos;
          tiempo = "8 horas";
          break;
        case 2:
          row.tiempo = 60 * 60 * 24 - diferenciaSegundos;
          tiempo = "24 horas";
          break;
        case 3:
          row.tiempo = 60 * 60 * 72 - diferenciaSegundos;
          tiempo = "72 horas";
          break;
      }
      break;
    case 3:
      row.tiempo = 60 * 60 * 24 * 8 - diferenciaSegundos;
      tiempo = "8 Dias";
      break;
  }
  //se calculan los segunos, minutos y horas para luego pasarlos al formato de fecha
  const segundos = Math.floor(Math.abs(row.tiempo)) % 60;
  const minutos = Math.floor(Math.abs(row.tiempo) / 60) % 60;
  const horas = Math.floor(Math.abs(row.tiempo) / 60 / 60);
  const dias = Math.floor(Math.abs(row.tiempo) / 86400);
  // row.ordenTiempo = diferenciaSegundos;
  let formatoDiferencia;
  if (horas > 24) {
    formatoDiferencia = `${dias} dias - ${
      horas - dias * (24).toString().padStart(2, "0")
    }:${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;
  } else {
    formatoDiferencia = `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  }
  return { contador: formatoDiferencia, tiempo: row.tiempo };
};

const updateTiempoRegresivo = () => {
  tiquetes.value.forEach((row) => {
    const { contador, tiempo } = calcularTiempoTiquete(row);
    row.contador = contador;
    row.tiempo = tiempo; // Actualiza el valor de row.tiempo
  });
};

//Procesamiento de componente comentario
const modalComentario = ref(false);
const detalleComentario = ref("");
function verMasComentario(comentario) {
  detalleComentario.value = comentario;
  modalComentario.value = true;
}

//emitir cambio de vista al padre
const volverDashboard = (valor) => {
  emit("cambiarEstadoTabla", valor);
};

//Ordenar tabla
const sortBy = ref("prioridad");
const sortDesc = ref(false);
function customSort() {
  tiquetes.value.sort((a, b) => {
    // const aValue = a[sortBy.value];
    // const bValue = b[sortBy.value];

    // if (aValue < bValue) {
    //   return sortDesc.value ? 1 : -1;
    // }
    // if (aValue > bValue) {
    //   return sortDesc.value ? -1 : 1;
    // }
    // return 0;
    const statusA = a["estado"];
    const statusB = b["estado"];

    // Ordenar por estado (ascendente)
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    const priorityA = a["prioridad"];
    const priorityB = b["prioridad"];

    // Ordenar por prioridad (ascendente)
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const tiempoA = a["tiempo"];
    const tiempoB = b["tiempo"];

    // Ordenar por prioridad (ascendente)
    if (tiempoA !== tiempoB) {
      return tiempoA - tiempoB;
    }
  });
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

///subscribe to table
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
// Funciones de construccion
let interval; // Variable para almacenar el intervalo
onMounted(async () => {
  await DatosGenerales();
  loadData();
  // Calcular el tiempo restante para cada fila cuando se crea el componente o cuando los datos cambian
  // Actualiza la cuenta regresiva cada segundo
  setInterval(updateTiempoRegresivo, 5000);
});
onBeforeUnmount(() => {
  // Limpia el intervalo cuando el componente se destruye para evitar fugas de memoria
  clearInterval(interval);
});
onUnmounted(() => {
  if (recorder && isRecording.value) {
    recorder.stop().catch(() => {});
  }
});
defineComponent({
  name: "MainTable",
});
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
