<template>
  <div class="row bg-accent">
    <div class="col-sm-12 col-xs-12 col-md-6 col-lg-6 bg-white">
      <div class="row text-primary">
        <div class="col-12 q-py-lg q-px-sm">
          <div class="row justify-between">
            <div class="col-6 text-center">
              <BtnBox
                title="Solicitudes"
                color="primary"
                :valor="tiquetes.length"
              ></BtnBox>
            </div>
            <div class="col-6 text-center">
              <BtnBox
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
                :prioridades="Prioridades"
                title="Estados"
                width="250"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 center-vertical">
              <apex-donut
                heightDonut="height: 160px;"
                :Series="countArrayPrioridad"
                :cliente="cliente"
                :prioridades="Prioridades"
                title="Prioridad"
                width="250"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4 center-vertical">
              <apex-donut
                heightDonut="height: 160px;"
                :Series="countArrayTipo"
                :cliente="cliente"
                :prioridades="Prioridades"
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
                title="Incidentes"
                color="white"
                :valor="cardsValue.incidentes"
                text-color="primary"
              ></BtnBox>
            </div>
            <div class="col-6 text-center">
              <BtnBox
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
          />
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
          :Solicitudes="Solicitudes"
          :prioridades="Prioridades"
          title="Estados"
          width="250"
        />
      </q-card>
    </div>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  watch,
  defineComponent,
  getCurrentInstance,
  watchEffect,
} from "vue";
import { useQuasar } from "quasar";
import { useMainStore } from "../stores/main";
import { LocalStorage } from "quasar";
import BtnBox from "src/components/Charts/BtnBox.vue";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import ApexBarra from "src/components/Charts/ApexBarra.vue";
import SolicitudesTiempo from "src/components/Charts/SolicitudesTiempo.vue";
import { api } from "boot/axios";
import { supabase } from "src/supabase";
import BackOffice from "src/pages/GestionarTiquete.vue";
import * as services from "../services/services.js";
LocalStorage.set("origen", "dash");
const store = useMainStore();
let $q = useQuasar();
LocalStorage.set("filtro", "Solicitudes");
const idusuario = LocalStorage.getItem("IdUsuario");
const tiquetes = ref([]);
const cliente = ref([]);
const Prioridades = ref(store.prioridad);
const Solicitudes = ref(store.solicitud);
const users = ref([]);
const cardsValue = ref({
  incidentes: 0,
  requerimientos: 0,
  pqr: 0,
});
const visible = ref(false);
const dataSolicitudesTiempo = ref([]);
const countArrayEstado = ref([]);
const countArrayPrioridad = ref([]);
const countArrayTipo = ref([]);
const showMaintable = {
  showGraficas: false,
  showColums: ["id", "estado", "prioridad", "tiempo"],
};
const filtro = ref("all");
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
};

const conteoPorParametro = () => {
  cardsValue.value.incidentes = tiquetes.value.filter(
    (p) => p.solicitud == 1
  ).length;
  cardsValue.value.requerimientos = tiquetes.value.filter(
    (p) => p.solicitud == 2
  ).length;
  cardsValue.value.pqr = tiquetes.value.filter((p) => p.solicitud == 3).length;
};

const DatosGenerales = async () => {
  await services.getCliente("").then((response) => {
    cliente.value = response.data;
  });

  await services.getUsuarios("").then((response) => {
    users.value = response.data;
  });
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
      loadData();
    }
  )
  .subscribe();
</script>
<style lang="scss"></style>
