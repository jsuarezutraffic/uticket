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
          <q-space />
          <q-btn
            v-if="showMaintable.showGraficas"
            outline
            to="/"
            class="q-ma-xs"
            color="tertiary"
            size="md"
            >Volver
          </q-btn>
          <q-btn
            v-if="!showMaintable.showGraficas"
            outline
            to="/tiquetes"
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
                  :color="Estados.filter((p) => p.orden == col.value)[0].color"
                >
                  {{
                    Estados.filter((p) => p.orden == col.value)[0].descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'prioridad'">
                <q-badge
                  :color="
                    Prioridades.filter((p) => p.orden == col.value)[0].color
                  "
                >
                  {{
                    Prioridades.filter((p) => p.orden == col.value)[0]
                      .descripcion
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'tipo'">
                <div v-if="col.value != null">
                  {{ Tipos.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'subtipo'">
                <div v-if="col.value != null">
                  {{ Subtipos.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'equipo'">
                <div v-if="col.value != null">
                  {{ Subtipos.filter((p) => p.id == col.value)[0].descripcion }}
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </div>
              <div v-else-if="col.name == 'solicitud'">
                {{ solicitudes.filter((p) => p.orden == col.value)[0].nombre }}
              </div>
              <div v-else-if="col.name == 'created_at'">
                {{ formatDate(col.value) }}
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
                  <div
                    v-if="
                      expanded2[props.row.id] ||
                      props.row.observaciones.length <= 50
                    "
                  >
                    <div
                      v-html="col.value.replace(/(?:\r\n|\r|\n)/g, '<br />')"
                    ></div>
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
              <div v-else-if="col.name == 'tiempo' && !selected.length > 0">
                <!-- verificar si el tiempo que hace falta es menor a una hora -->
                {{ calcularTiempoTiquete(props.row) }}
                <q-badge color="red" v-if="props.row.tiempo < 60 * 60">
                  {{ props.row.contador }}
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
                  :visible-columns="[
                    'operador',
                    'campomodificador',
                    'valoranterior',
                    'valornuevo',
                    'observaciones',
                    'comentarios',
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
              label="Solucionar Ticket"
              color="primary"
              class="q-mx-md"
              no-caps
              @click="AccionTiquete('SolucionarTicket')"
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
            Solucionar Tiquete
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div class="row" style="background: #ffffff">
                <div
                  class="col-md-5 col-sm-5 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-select
                    :rules="selectRule"
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
                  class="col-md-5 col-sm-5 col-xs-12"
                  v-if="accion == 'SolucionarTicket'"
                >
                  <q-select
                    :rules="selectRule"
                    label="Persona Consultada"
                    transition-show="scale"
                    transition-hide="scale"
                    use-input
                    outlined
                    v-model="FilaDetalle.consultado"
                    dense
                    :options="contactos"
                    option-label="nombres"
                    option-value="id"
                    class="q-pa-md"
                    input-debounce="0"
                    @filter="filterFn"
                    style="width: 250px"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
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
            v-if="accion == 'CerrarTicket'"
            label="No"
            v-close-popup
            color="negative"
          />
          <q-btn
            class="q-mx-md"
            v-if="accion == 'CerrarTicket'"
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
</template>

<script setup>
/*eslint-disable */
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  watchEffect,
  computed,
  onBeforeUnmount,
  onUnmounted,
  toRefs,
} from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "boot/axios";
import { mostrarMensajes } from "boot/global";
import { supabase } from "src/supabase";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
import FileInput from "src/components/FileImage.vue";
import InputTextJump from "src/components/InputTextSaltoLinea.vue";
import VerImagenArray from "src/components/VerImagenArray.vue";
import axios from "axios";
//variables para el grabado de notas de voz
const isRecording = ref(false);
const progressValue = ref(0);
let recorder;
let progressInterval;
const audioPlayer = ref(null);

const props = defineProps(["showMaintable"]);
let { showMaintable } = toRefs(props);
const filtro = LocalStorage.getItem("filtro");

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
const tiquetes = ref([]);
const tiquetesDetalles = ref([]);
const concesion = ref({});
const peajes = ref([]);
const cliente = ref([]);
const users = ref([]);
const Equipos = ref([]);
const EquiposOptions = ref([]);
const SubtipoOptions = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const Prioridades = ref([]);
const Estados = ref([]);
const Procesos = ref([]);

const solicitudes = ref([]);
const contactos = ref([]);
const metodoconsulta = ref([]);
const visible = ref(false);
const next = ref({
  nivel: null,
  operador: null,
  prioridad: null,
});
const pagination = ref({
  rowsPerPage: 8,
});
const imagen = ref("");
const disable = ref(false);
const oldProridad = ref(null);
const mostrarModal = ref(false);
const mostrarConfirm = ref(false);
const mostrarAsignarTiquetes = ref(false);
const mostrarSolucionarTiquetes = ref(false);
const mostrarAddPersonaContacto = ref(false);
const mostrarImagen = ref(false);
const accion = ref("");
const mensaje = ref("");
const Fila = ref({});
const FilaTemporal = ref({});
const FilaDetalle = ref({});
const FilaContacto = ref({});
const tableRef = ref(null);
const expanded = ref([]);
const table = ref(false);
const TablaDetalles = ref(false);
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
    name: "asignado",
    align: "left",
    label: "Asignado",
    field: "asignado",
    sortable: true,
  },
  {
    name: "tiempo",
    align: "left",
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
// -------------------------------------------------------
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

const clickRowDetalle = (row) => {};

const getDetalleTiquete = async () => {
  visible.value = true;
  // Fila.value = row;
  // oldProridad.value = row.prioridad;
  // next.value.prioridad = Fila.value.prioridad;
  next.value.nivel = null;
  next.value.operador = null;
  await api
    .get(`detalletiquete?tiquete=eq.${Fila.value.id}&select=*`)
    .then((response) => {
      tiquetesDetalles.value = response.data;
      TablaDetalles.value = true;
      mostrarModal.value = true;
      visible.value = false;
    });
};
const GestionTiquete = async (accionValue) => {
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
    FilaDetalle.value.estado = Estados.value.filter(
      (p) => p.orden == Fila.value.estado
    )[0].vercliente;
    // agregar saltos de linea al campo Comentarios
    FilaDetalle.value.comentarios = textSaltoLinea.value;
    FilaDetalle.value.evidencia = valorDatosExportado.value;
    // post a la tabla de detalles tiquetes------------------
    await api
      .post("detalletiquete", FilaDetalle.value)
      .then((response) => {
        api
          .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se soliciono correctamente",
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
    await api
      .post("detalletiquete", FilaDetalle.value)
      .then((response) => {
        api
          .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
          .then((response) => {
            mostrarMensajes({
              tipomensaje: 1,
              mensaje: "El ticket se asigno correctamente al siguiete nivel",
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
      FilaDetalle.value.estado = Estados.value.filter(
        (p) => p.orden == Fila.value.estado
      )[0].vercliente;
      Fila.value.asignado = users.value.filter(
        (p) => p.nivel == 1 && p.estado == true
      )[0].id;
      // agregar saltos de linea al campo Comentarios
      FilaDetalle.value.comentarios = textSaltoLinea.value;
      await api
        .post("detalletiquete", FilaDetalle.value)
        .then((response) => {
          api
            .patch(`tiquete?id=eq.${Fila.value.id}`, Fila.value)
            .then((response) => {
              mostrarSolucionarTiquetes.value = false;
              mostrarMensajes({
                tipomensaje: 1,
                mensaje: "El ticket se cerro correctamente",
              });
              mostrarModal.value = false;
              enviarCorreo();
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
  }
};

const LoadData = async () => {
  var filtroNivel = "";
  visible.value = true;
  if (users.value.filter((p) => p.id == idusuario)[0].nivel === 3) {
    filtroNivel = `asignado=eq.${idusuario}&`;
    LocalStorage.set("filtro", "Solicitudes");
  } else if (users.value.filter((p) => p.id == idusuario)[0].nivel === 1) {
    filtroNivel = ``;
  } else {
    $q.notify({
      type: "negative",
      message: `ESTED NO TIENE ACCESO A BACKOFFICE`,
      timeout: 4000,
    });
    visible.value = false;
  }

  switch (filtro) {
    case "Solicitudes":
      await api.get(`tiquete?${filtroNivel}select=*`).then((response) => {
        tiquetes.value = response.data;
        visible.value = false;
      });
      break;
    case "Incidentes":
      var solicitud = solicitudes.value.filter((v) => v.nombre == filtro)[0]
        .orden;
      await api
        .get(`tiquete?${filtroNivel}solicitud=eq.${solicitud}&select=*`)
        .then((response) => {
          tiquetes.value = response.data;
          visible.value = false;
        });
      break;
    case "Requerimiento":
      var solicitud = solicitudes.value.filter((v) => v.nombre == filtro)[0]
        .orden;
      await api
        .get(`tiquete?${filtroNivel}solicitud=eq.${solicitud}&select=*`)
        .then((response) => {
          tiquetes.value = response.data;
          visible.value = false;
        });
      break;
    case "PQR":
      var solicitud = solicitudes.value.filter((v) => v.nombre == filtro)[0]
        .orden;
      await api
        .get(`tiquete?${filtroNivel}solicitud=eq.${solicitud}&select=*`)
        .then((response) => {
          tiquetes.value = response.data;
          visible.value = false;
        });
      break;
  }
  visible.value = false;
};

const AccionTiquete = (key) => {
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
    default:
      break;
  }
};

const DatosGenerales = async () => {
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

  await api.get("metodoconsulta?select=*").then((response) => {
    metodoconsulta.value = response.data;
  });

  await api.get("equipo?select=*").then((response) => {
    Equipos.value = response.data;
  });

  await CargarContactos();
  // Fila.value.asignado = "4ca6c4d3-c2f9-4c1f-9411-de9271b9519f";
  // Fila.value.privado = null;
  visible.value = false;
  table.value = true;
};

// -------------------------------------------------------
// Funciones generales
//-------------------------------------------------------
const addPersonConsulta = async () => {
  mostrarAddPersonaContacto.value = false;
  if (FilaContacto.telefono != null) {
    FilaContacto.telefono = parseInt(FilaContacto.telefono);
  }
  await api.post("contactos", FilaContacto.value).then((response) => {});
  await CargarContactos();
};
const CargarContactos = async () => {
  FilaContacto.value = {};
  FilaContacto.telefono = null;
  await api.get("contactos?select=*").then((response) => {
    contactos.value = response.data;
  });
};
const configJson = require("/public/config.json");
const enviarCorreo = async () => {
  const data = {};
  data.email = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].correo;
  data.cliente = cliente.value.filter(
    (p) => p.id == Fila.value.cliente
  )[0].nombres;
  data.estado = "Cerrado";
  data.mensaje1 =
    "La solicitud fue revisada y cerrada por el equipo de soporte de";
  data.mensaje2 = "Por favor verificar y dar por finalizado el ticket";

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
        email: data.email,
        name: data.nombres,
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
  const intervalo = setInterval(() => {
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
    const segundos = Math.floor(row.tiempo) % 60;
    const minutos = Math.floor(row.tiempo / 60) % 60;
    const horas = Math.floor(row.tiempo / 60 / 60);
    const dias = Math.floor(row.tiempo / 86400);
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
    row.contador = formatoDiferencia;
  }, 1000);
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
    const tiempoA = a["tiempo"];
    const tiempoB = b["tiempo"];

    // Ordenar por prioridad (ascendente)
    if (tiempoA !== tiempoB) {
      return tiempoA - tiempoB;
    }

    const priorityA = a["prioridad"];
    const priorityB = b["prioridad"];

    // Ordenar por prioridad (ascendente)
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const statusA = a["estado"];
    const statusB = b["estado"];

    // Ordenar por estado (ascendente)
    return statusA - statusB;

    // const timeA = a["time"];
    // const timeB = b["time"];

    // // Ordenar por tiempo (ascendente)
    // return timeA - timeB;
  });
}
customSort();
onMounted(async () => {
  await DatosGenerales();
  LoadData();
});

defineComponent({
  name: "MainTable",
});

//----------------Subscripcion a la tabla tiquetes--------------------------
const tiquete = supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tiquete" },
    (payload) => {
      if (payload.eventType == "INSERT") {
        $q.notify({
          type: "positive",
          message: `Se ha agregado un nuevo ticket`,
          timeout: 4000,
        });
      }
      if (payload.eventType == "UPDATE") {
        $q.notify({
          type: "warning",
          message: `Se ha actualizado el ticket N° ${payload.old.id}`,
          timeout: 4000,
        });
      }
      location.reload();
      LoadData();
      DatosGenerales();
    }
  )
  .subscribe();

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
