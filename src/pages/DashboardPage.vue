<template>
  <div class="row bg-accent" v-if="!selectFiltro">
    <div class="col-sm-12 col-xs-12 col-md-6 col-lg-6 bg-white">
      <div class="row text-primary">
        <div class="col-12 q-py-lg q-px-sm">
          <div class="row justify-between">
            <div class="col-6 text-center">
              <BtnBox
                @click="clickBotonFiltro('Solicitudes')"
                title="Solicitudes"
                color="primary"
                :valor="tiquetes.length"
              ></BtnBox>
            </div>
            <div class="col-6 text-center">
              <BtnBox
                @click="clickBotonFiltro('Requerimiento')"
                title="Requerimiento"
                color="primary"
                :valor="cardsValue.requerimientos"
              ></BtnBox>
            </div>
          </div>
        </div>
        <div class="col-12 q-pa-lg">
          <div class="row">
            <div class="col-xs-12 col-sm-4 col-md-4 center-vertical">
              <apex-donut
                heightDonut="height: 160px;"
                :Series="countArrayEstado"
                :cliente="cliente"
                title="Estados"
                width="250"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 center-vertical">
              <apex-donut
                heightDonut="height: 160px;"
                :Series="countArrayPrioridad"
                :cliente="cliente"
                title="Prioridad"
                width="250"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 center-vertical">
              <apex-donut
                heightDonut="height: 160px;"
                :Series="countArrayTipo"
                :cliente="cliente"
                title="Tipo"
                width="250"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <SolicitudesTiempo
            :dataSolicitudesTiempo="dataSolicitudesTiempo"
          ></SolicitudesTiempo>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-xs-12 col-md-6 col-lg-6 bg-primary">
      <div class="row text-primary">
        <div class="col-12 q-py-lg q-px-sm">
          <div class="row justify-between">
            <div class="col-6 text-center">
              <BtnBox
                @click="clickBotonFiltro('Incidentes')"
                title="Incidentes"
                color="white"
                :valor="cardsValue.incidentes"
                text-color="primary"
              ></BtnBox>
            </div>
            <div class="col-6 text-center">
              <BtnBox
                @click="clickBotonFiltro('PQR')"
                title="PQR"
                color="white"
                :valor="cardsValue.pqr"
                text-color="primary"
              ></BtnBox>
            </div>
          </div>
        </div>
        <div class="col-12">
          <BackOffice
            :key="countArrayEstado"
            :showMaintable="showMaintable"
            :dataTiquetes="tiquetes"
            :datosGenerales="datosGenerales"
            @cambiarEstadoTabla="cambiarEstadoTabla"
          >
            <template #reload>
              <q-btn
                @click="loadData()"
                outline
                round
                class="q-ma-xs"
                color="tertiary"
                size="md"
                icon="refresh"
              >
              </q-btn></template
          ></BackOffice>
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-md">
      <q-card>
        <ApexBarra
          heightDonut="height: 160px;"
          :Series="countArrayEstado"
          :tiquetes="tiquetes"
          :usuarios="users"
          title="Estados"
          width="250"
        />
      </q-card>
    </div>
  </div>
  <div v-if="selectFiltro">
    <BackOffice
      :key="countArrayEstado"
      :showMaintable="showMaintable"
      :dataTiquetes="tiquetes"
      :datosGenerales="datosGenerales"
      @cambiarEstadoTabla="cambiarEstadoTabla"
    >
      <template #reload>
        <q-btn
          @click="loadData()"
          outline
          round
          class="q-ma-xs"
          color="tertiary"
          size="md"
          icon="refresh"
        >
        </q-btn></template
    ></BackOffice>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useQuasar } from "quasar";
import { LocalStorage } from "quasar";
import BtnBox from "src/components/Charts/BtnBox.vue";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import ApexBarra from "src/components/Charts/ApexBarra.vue";
import SolicitudesTiempo from "src/components/Charts/SolicitudesTiempo.vue";
import { supabase } from "src/supabase";
import BackOffice from "src/pages/GestionarTiquete.vue";
import { useMainStore } from "src/stores/main";
import * as services from "../services/services.js";

LocalStorage.set("filtro", "Dash");
const store = useMainStore();
let $q = useQuasar();
const idusuario = LocalStorage.getItem("IdUsuario");
const selectFiltro = ref(false);
const visible = ref(false);
const tiquetes = ref([]);
const cliente = ref([]);
const users = ref([]);
const datosGenerales = ref({});
const dataSolicitudesTiempo = ref([]);
const countArrayEstado = ref([]);
const countArrayPrioridad = ref([]);
const countArrayTipo = ref([]);
const showMaintable = ref({
  showFilter: "Solicitudes",
  showGraficas: false,
  showColums: ["id", "estado", "prioridad", "tiempo"],
});
const cardsValue = ref({
  incidentes: 0,
  requerimientos: 0,
  pqr: 0,
});

watchEffect(() => {
  {
    const countByEstado = {};
    const countByPrioridad = {};
    const countByTipo = {};
    // Contar la cantidad de objetos por estado
    tiquetes.value.forEach((obj) => {
      const estado = obj.estado;
      const prioridad = obj.prioridad;
      const tipo = obj.tipo;

      let label;
      let labelPrioridad;
      let labelTipo;

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
    });
    countArrayEstado.value = Object.values(countByEstado);
    countArrayPrioridad.value = Object.values(countByPrioridad);
    countArrayTipo.value = Object.values(countByTipo);
  }
});

//Metodos
const clickBotonFiltro = (seleccion) => {
  showMaintable.value = {
    showFilter: seleccion,
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
      "equipo",
      "finalizar",
      "devuelto",
      "eliminar",
      "tiempo",
    ],
  };
  selectFiltro.value = true;
};
const cambiarEstadoTabla = (newValue) => {
  if (newValue == "dashboard") {
    showMaintable.value = {
      showFilter: "Solicitudes",
      showGraficas: false,
      showColums: ["id", "estado", "prioridad", "tiempo"],
    };
    selectFiltro.value = false;
  } else {
    clickBotonFiltro("Solicitudes");
  }
};

//Carga de data
const loadData = async () => {
  visible.value = true;
  if (users.value.filter((p) => p.id == idusuario)[0].nivel === 3) {
    await services.getTiquetes(`asignado=eq.${idusuario}&`).then((response) => {
      tiquetes.value = response.data;
      visible.value = false;
    });
  } else if (users.value.filter((p) => p.id == idusuario)[0].nivel === 1) {
    await services.getTiquetes("").then((response) => {
      tiquetes.value = response.data;
      visible.value = false;
    });
  } else {
    $q.notify({
      type: "negative",
      message: `ESTED NO TIENE ACCESO A BACKOFFICE`,
      timeout: 4000,
    });
    visible.value = false;
  }
  solicitudesTiempo();
  conteoPorParametro();
  store.setListNotificaciones("clear");
};
const DatosGenerales = async () => {
  await services.getCliente("").then((response) => {
    cliente.value = response.data;
    datosGenerales.value.cliente = cliente.value;
  });

  await services.getUsuarios("").then((response) => {
    users.value = response.data;
    datosGenerales.value.users = users.value;
  });

  await services.getEnvioCorreos("").then((response) => {
    let correos = [];
    for (const iterator of response.data) {
      correos.push(iterator.idtiquete);
    }
    datosGenerales.value.correos = correos;
  });
};

//Procesamiento de data para graficas
const conteoPorParametro = () => {
  cardsValue.value.incidentes = tiquetes.value.filter(
    (p) => p.solicitud == 1
  ).length;
  cardsValue.value.requerimientos = tiquetes.value.filter(
    (p) => p.solicitud == 2
  ).length;
  cardsValue.value.pqr = tiquetes.value.filter((p) => p.solicitud == 3).length;
};
const solicitudesTiempo = () => {
  // Array original con objetos JSON
  const arrayOriginal = tiquetes.value;

  // Objeto para realizar el seguimiento del recuento de elementos por mes
  const countByMonth = {};

  // Itera sobre cada elemento del array original
  arrayOriginal.forEach((obj) => {
    const createdAt = new Date(obj.created_at);
    const month = createdAt.getMonth();

    // Incrementa el recuento correspondiente al mes actual
    if (countByMonth[month]) {
      countByMonth[month]++;
    } else {
      countByMonth[month] = 1;
    }
  });

  // Crea un nuevo array con la cantidad de elementos por mes
  const arrayCantidadPorMes = [];
  for (let i = 0; i < 12; i++) {
    const cantidad = countByMonth[i] || 0;
    arrayCantidadPorMes.push(cantidad);
  }

  // Imprime el nuevo array
  dataSolicitudesTiempo.value = arrayCantidadPorMes;
};

onMounted(async () => {
  await DatosGenerales();
  await loadData();
});
//----------------Subscripcion a la tabla tiquetes--------------------------
supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tiquete" },
    (payload) => {
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
    }
  )
  .subscribe();
</script>
<style lang="scss"></style>
