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
          <BackOffice :showMaintable="showMaintable" />
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-md">
      <q-card>
        <ApexBarra
          heightDonut="height: 160px;"
          :Series="countArrayEstado"
          :cliente="cliente"
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
let $q = useQuasar();
LocalStorage.set("filtro", "Solicitudes");
const idusuario = LocalStorage.getItem("IdUsuario");
const tiquetes = ref([]);
const concesion = ref([]);
const peajes = ref([]);
const cliente = ref([]);
const Tipos = ref([]);
const Subtipos = ref([]);
const Equipos = ref([]);
const Prioridades = ref([]);
const Estados = ref([]);
const Procesos = ref([]);
const Solicitudes = ref([]);
const users = ref([]);
const metodoconsulta = ref([]);
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
  showColums: ["id", "estado", "prioridad"],
};
const filtro = ref("all");
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

    // const filteredArray = computed(() => {
    //   return tiquetes.value.filter((item1) =>
    //     Prioridades.value.some((item2) => item2.id === item1.prioridad)
    //   );
    // });
    countArrayEstado.value = Object.values(countByEstado);
    countArrayPrioridad.value = Object.values(countByPrioridad);
    countArrayTipo.value = Object.values(countByTipo);
  }
});
const loadData = async () => {
  visible.value = true;
  if (users.value.filter((p) => p.id == idusuario)[0].nivel === 3) {
    await api
      .get(`tiquete?asignado=eq.${idusuario}&select=*`)
      .then((response) => {
        tiquetes.value = response.data;
        visible.value = false;
      });
  } else if (users.value.filter((p) => p.id == idusuario)[0].nivel === 1) {
    await api.get("tiquete?select=*").then((response) => {
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
};

const conteoPorParametro = () => {
  cardsValue.value.incidentes = tiquetes.value.filter(
    (p) =>
      p.solicitud ==
      Solicitudes.value.filter((v) => v.nombre == "Incidentes")[0].id
  ).length;
  cardsValue.value.requerimientos = tiquetes.value.filter(
    (p) =>
      p.solicitud ==
      Solicitudes.value.filter((v) => v.nombre == "Requerimiento")[0].id
  ).length;
  cardsValue.value.pqr = tiquetes.value.filter(
    (p) =>
      p.solicitud == Solicitudes.value.filter((v) => v.nombre == "PQR")[0].id
  ).length;
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
    Solicitudes.value = response.data;
  });

  await api.get("metodoconsulta?select=*").then((response) => {
    metodoconsulta.value = response.data;
  });

  await api.get("equipo?select=*").then((response) => {
    Equipos.value = response.data;
  });

  // Fila.value.asignado = "4ca6c4d3-c2f9-4c1f-9411-de9271b9519f";
  // Fila.value.privado = null;
  visible.value = false;
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
  await conteoPorParametro();
  // var chart = new ApexCharts(document.querySelector("#chart"), options);
  // chart.render();
});
//----------------Subscripcion a la tabla tiquetes--------------------------
supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tiquete" },
    (payload) => {
      location.reload();
      console.log("cambio tiquete");
    }
  )
  .subscribe();
</script>
<style lang="scss"></style>
